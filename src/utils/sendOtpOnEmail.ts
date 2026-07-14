import nodemailer from "nodemailer";

let transporter: any = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

export const sendOtpOnMail = async (
  email: string,
  otp: string | number,
): Promise<{ success?: string; error?: string }> => {
  if (!email) {
    return { error: "Please provide an email address." };
  }

  try {
    const mailTransporter = getTransporter();
    await mailTransporter.sendMail({
      from: `"OTP verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes. Do not share it with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; padding:30px; border:1px solid #ddd; border-radius:8px;">
          <h2 style="text-align:center; color:#4f46e5;">Email Verification</h2>

          <p>Hello,</p>

          <p>Use the following One-Time Password (OTP) to verify your email address:</p>

          <div style="margin:30px 0; text-align:center;">
            <span style="display:inline-block; padding:15px 30px; font-size:32px; font-weight:bold; letter-spacing:8px; background:#f3f4f6; border-radius:8px;">
              ${otp}
            </span>
          </div>

          <p>This OTP is valid for <strong>10 minutes</strong>.</p>

          <p>If you didn't request this code, you can safely ignore this email.</p>

          <br>

          <p>Regards,</p>
          <p><strong>Your App Team</strong></p>
        </div>
      `,
    });

    return {
      success: "OTP sent successfully.",
    };
  } catch (error) {
    console.error("Failed to send OTP:", error);

    return {
      error: "Failed to send OTP. Please try again.",
    };
  }
};

