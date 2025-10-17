function generateEmailTemplate(verificationCode) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; 
              border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    
    <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">Verification Code</h2>
    
    <p style="font-size: 16px; color: #333;">Dear User,</p>
    <p style="font-size: 16px; color: #333;">Your verification code is:</p>

    <div style="text-align: center; margin: 25px 0;">
      <span style="display: inline-block; font-size: 24px; font-weight: bold; 
                   color: #4CAF50; padding: 10px 25px; border: 1px solid #4CAF50; 
                   border-radius: 5px; background-color: #e8f5e9;">
        ${verificationCode}
      </span>
    </div>

    <p style="font-size: 16px; color: #333;">
      Please use this code to verify your email address. 
      The code will expire in <strong>5 minutes</strong>.
    </p>
    <p style="font-size: 16px; color: #333;">
      If you did not request this, please ignore this email.
    </p>

    <footer style="margin-top: 25px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br><strong>DevTrack Team</strong></p>
      <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
    </footer>
  </div>
  `;
}

module.exports = {generateEmailTemplate}