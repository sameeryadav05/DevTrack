const nodemailer = require('nodemailer')

const sendEmail = async ({email,subject,message})=>{
    try {
        const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
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
    } catch (error) {
            console.log("failed to send email")
    }

}

module.exports = {sendEmail}