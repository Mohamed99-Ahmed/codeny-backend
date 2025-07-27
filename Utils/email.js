const nodemailer = require("nodemailer");

// sendEmail function
// opt will equal to = {email, subject, text, html}
const sendEmail = async opt => {
    // create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{ 
            user: process.env.EMAIL_USER, // my email that i will send from to user
            pass: process.env.EMAIL_PASSWORD // my password of my email
        }
    })

    // define email options 
    const options = {
        from: `${process.env.EMAIL_USER}`,
        to: opt.email,
        subject: opt.subject,
        text: opt.message, // للمتصفحات التي لا تدعم HTML
        html: opt.html // إضافة دعم محتوى HTML
    }

    // Actually send to email
    await transporter.sendMail(options)
}

module.exports = sendEmail;