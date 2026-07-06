const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

exports.sendOTP = async (email, otp, name) => {
  const mailOptions = {
    from: `"Rasa Beauty & Wellness" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - Rasa Beauty & Wellness 🌿',
    html: `
      <div style="background-color: #F7F6FA; padding: 40px 20px; font-family: sans-serif; text-align: center; color: #1C281F;">
        <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E3EAE5; overflow: hidden; box-shadow: 0 4px 12px rgba(78, 110, 88, 0.08);">
          <div style="background-color: #4E6E58; padding: 24px; text-align: center;">
            <span style="font-size: 32px; display: block; margin-bottom: 8px;">🌿</span>
            <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Rasa</h1>
          </div>
          
          <div style="padding: 32px 24px; text-align: left;">
            <p style="font-size: 16px; line-height: 1.6; color: #1C281F; margin: 0 0 16px 0;">Hello ${name || 'there'},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #6E7E73; margin: 0 0 24px 0;">Thank you for starting your personalised care journey with Rasa. Please use the following One-Time Password (OTP) to verify your email address and complete your registration:</p>
            
            <div style="background-color: #E6EFEA; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 700; color: #354D3D; letter-spacing: 6px; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="font-size: 12px; line-height: 1.5; color: #6E7E73; margin: 0 0 16px 0; font-style: italic; text-align: center;">
              ⚠️ This code will expire in <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background-color: #F7F6FA; border-top: 1px solid #E3EAE5; padding: 16px; text-align: center;">
            <p style="font-size: 11px; color: #9EAEA3; margin: 0;">© ${new Date().getFullYear()} Rasa Beauty & Wellness. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}
