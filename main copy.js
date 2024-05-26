import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";

const token = "7139046789:AAFtkZA-RWaG1AIgecUT51jbzlZzYAnawo4";
const webAppUrl = "https://clevervol-ng-tg.web.app";

const bot = new Telegraf(token);

bot.command("start", (ctx) => {
  ctx.reply(
    "Добро пожаловать! Нажмите на кнопку нижеБ чтобы запустить приложение",
    Markup.keyboard([Markup.button.webApp("Отправить сообщение", webAppUrl)])
  );
});

bot.on(message("web_app_data"), async (ctx) => {
  const data = ctx.webAppData.data.json();
  ctx.reply(`Ваше сообщение: ${data?.text}` ?? "empty message");
});

bot.launch();
