import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject, model, signal } from '@angular/core';
import { OpenAI } from 'openai';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, filter, from, lastValueFrom, map } from 'rxjs';

export interface ApiResponse {
  choices: { message: { content: string } }[];
}

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private http = inject(HttpClient);
  $messages = signal('');
  $loadingApiResponse = signal(false);

  private API = {
    key: 'sk-proj-09BCmJKGPZGaq7r3Ka8XT3BlbkFJQXRXP5gHNNh08yjhybCd',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
  };

  async sendImage(image: string) {
    this.$loadingApiResponse.set(true);
    this.$messages.set('');

    const conversation = [
      { role: 'system', content: 'Що на зображенні?' },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: image,
              detail: 'high',
            },
          },
        ],
      },
    ];

    const promise = this.OpenAiResponse(conversation).then((response) => {
      const apiResponse: ApiResponse = response as ApiResponse;
      const botResponse = apiResponse.choices[0].message.content.trim();

      this.$messages.set(botResponse);
      this.$loadingApiResponse.set(false);

      return botResponse;
    });

    return promise;
  }

  private OpenAiResponse(conversation: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.API.key}`,
    });
    const response = this.http.post(
      this.API.url,
      { model: this.API.model, messages: conversation },
      { headers }
    );

    return lastValueFrom(response, {
      defaultValue: new Object(),
    });
  }
}
