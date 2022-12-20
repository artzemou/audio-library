// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// Todo
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const mailTo = (to, from, subject, text, html) => {
    let msg = {
        to: to,
        from: from,
        subject: subject,
        text: text,
        html: `<b>${text}</b>`,
    };
    sgMail.send(msg);
}

module.exports = mailTo