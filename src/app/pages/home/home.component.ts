import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  inject,
  OnDestroy,
  signal,
  ViewChildren,
} from '@angular/core';
import { TelegramService } from '../../services/telegram.service';
import { OpenAiService } from '../../services/openai.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, map, take } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styles: `
    .form {
      heigth: 70vh;
      justify-content: center;
    }
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  http = inject(HttpClient);

  telegram = inject(TelegramService);
  @ViewChild('fileUploader') fileUploader!: ElementRef;
  openai = inject(OpenAiService);
  fileUrl: any;

  selectedFile: string | null = null;
  image = signal('');

  constructor() {
    // this.sendData = this.sendData.bind(this);
  }

  ngOnInit(): void {
    // this.telegram.MainButton.setText('Upload image');
    // this.telegram.MainButton.show();
    //  this.telegram.MainButton.onClick(this.fileUploader.nativeElement.cl);
    this.fileUrl = this.route.snapshot.queryParamMap.get('fileUrl');
    if (this.fileUrl) {
      this.openai.sendImage(this.fileUrl);
      this.image.set(this.fileUrl);
    }
  }
  ngAfterViewInit() {}
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.selectedFile = reader.result as string;
      this.image.set(reader.result as string);
      this.openai
        .sendImage(this.selectedFile)
        .then((res) => this.telegram.sendData({ text: res }));
    };
  }

  ngOnDestroy(): void {
    // this.telegram.MainButton.offClick(this.sendData);
  }
}
