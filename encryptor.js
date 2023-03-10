const CryptoJS = require("crypto-js");
const TelegramBot = require("node-telegram-bot-api");
const token = "YOUR-TOKEN";
const bot = new TelegramBot(token, { polling: true });

/*

      * * * FUNCTIONS * * *

*/

// Function to encrypt data
const encryptData = (data, key) => CryptoJS.AES.encrypt(data, key).toString();

// Function to decrypt data
const decryptData = (data, key) =>
  CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);

// Function to delete messages
const deleteMessage = (msg) => bot.deleteMessage(msg.chat.id, msg.message_id);

/*

      * * * COMMANDS * * *

*/

// Encrypt command
bot.onText(/^\/encrypt(.+)/, (msg, match) => {
  deleteMessage(msg)
    .then(() => {
      const pass = match[1].split(" ")[1];
      const message = match[1].replace(pass, "").trim();
      const encryptTxt = encryptData(message, pass);

      if (encryptTxt !== "") bot.sendMessage(msg.chat.id, encryptTxt);
    })
    .catch(() =>
      bot.sendMessage(
        msg.chat.id,
        "Please give me permissions that allow me to delete messages."
      )
    );
});

// Decrypt command with 2 differents ways
bot.onText(/^\/decrypt(.+)/, (msg, match) => {
  var decryptTxt;
  deleteMessage(msg)
    .then(() => {
      // Decrypts the message that is given as a response
      if (match[1].split(" ").length == 2) {
        if (msg.reply_to_message === undefined) return;
        const pass = match[1].trim();
        decryptTxt = decryptData(msg.reply_to_message.text, pass);
      }
      // Decrypts the given message in the message itself with the format:
      // "command (space) pass (space) encrypted message"
      else {
        const pass = match[1].split(" ")[1];
        const message = match[1].replace(pass, "").trim();
        decryptTxt = decryptData(message, pass);
      }
      if (decryptTxt != "")
        bot
          .sendMessage(msg.chat.id, decryptTxt)
          .then((response) => setTimeout(deleteMessage, 30000, response));
    })
    .catch(() =>
      bot.sendMessage(
        msg.chat.id,
        "Please give me permissions that allow me to delete messages."
      )
    );
});

// Start command
bot.onText(/^\/start/, (msg) =>
  bot.sendMessage(
    msg.chat.id,
    `Hi ${msg.from.first_name}, nice to meet you!\nI'm your *Encryptor Bot*??????\n\n` +
      "Use the _/help_ command to get all the different commands to help you.",
    {
      parse_mode: "Markdown",
    }
  )
);

// Command for help
bot.onText(/^\/help/, (msg) =>
  bot.sendMessage(
    msg.chat.id,
    "*Bot Commands*\n" +
      "\n1. Use _/encrypt + password + message_ to encrypt a message." +
      "\n2. Use _/decrypt + password + message_ to decrypt a message or " +
      "use _/decrypt + password_ to decrypt a message you are replying " +
      "to.\nThe password must be the same.",
    { parse_mode: "Markdown" }
  )
);

// Command for tests
bot.onText(/^\/test/, (msg) => {});

/*
    Bot available in telegram ( @encrypt0r_bot )
    Created by: Rub??n Palomo Font??n
    LinkedIn: https://www.linkedin.com/in/ruben-palomo-fontan/
    Contact: ruben.palomof@gmail.com
 */
