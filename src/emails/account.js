const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name) {
    sgMail.send({
        to: email,
        from: "calebjanhunen@gmail.com",
        subject: "Welcome to Task Manager",
        text: `Welcome ${name}. Thank you for joining Task Manager. Let me know how your experience goes with the app.`,
    });
}

function sendCancelEmail(email, name) {
    sgMail.send({
        to: email,
        from: "calebjanhunen@gmail.com",
        subject: "Task Manager Canellation",
        text: `Goodbye, ${name}. We're sorry to see you go. Let us know if we could improve on anything.`,
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail,
};
