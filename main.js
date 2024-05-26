import { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { message } from "telegraf/filters";

const token = "7139046789:AAFtkZA-RWaG1AIgecUT51jbzlZzYAnawo4";
const webAppUrl = "https://clevervol-ng-tg.web.app";

const bot = new Telegraf(token);

bot.command("start", (ctx) => {
  ctx.reply("Привіт! Завантажте фото, або перейдіть до аплікації");
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.update.message.photo) {
    const imageID = msg.update.message.photo[2].file_id;
    fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${imageID}`)
      .then((res) => res.json())
      .then((data) => {
        const filePath = data.result.file_path;
        //finds the URL to download the image from Telegram servers
        const url = `https://api.telegram.org/file/bot${token}/${filePath}`;
        //defines where we want Node to download the image
        console.log(url);
        msg.reply(
          "Для продовження, перейдіть до аплікації",
          Markup.inlineKeyboard([
            Markup.button.webApp("До аплікації", webAppUrl + "/?fileUrl=" + url)
          ])
        );
      });
  }
});
bot.on(message("web_app_data"), async (ctx) => {
  const data = ctx.webAppData.data.json();
  ctx.reply(`Ваше сообщение: ${data?.text}` ?? "empty message");
});

bot.launch();
