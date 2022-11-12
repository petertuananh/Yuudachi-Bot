const Tesseract = require("tesseract.js")

module.exports = {
    name: 'test',
    category: 'Admin',
    description: 'Evalculate Javascript commands',
    ownerOnly: true,
    run: async (client, message, args) => {
        Tesseract.recognize(
            'https://tesseract.projectnaptha.com/img/eng_bw.png',
            'eng',
            { logger: m => {} }
          ).then(({ data: { text } }) => {
            console.log(text.includes("Mild Splendour"));
          })
    }
}