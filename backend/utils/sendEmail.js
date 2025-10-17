const nodemailer = require('nodemailer')

const sendEmail = async ({email,subject,message})=>{
    const transporter = nodemailer.createTransport({
        host:process.env.HOST,
        service:process.env.SERVICE,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL,
            pass:process.env.PASSWORD
        }
    })

    const options = {
        from:process.env.MAIL,
        to:email,
        subject,
        html:message
    }
    await transporter.sendMail(options)

}

module.exports = {sendEmail}