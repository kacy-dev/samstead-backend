import nodemailer from "nodemailer";

export const generateOTP = (): string => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  return otp.toString();
};

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "believeosawaru2@gmail.com",
      pass: "rhirvyfbxtcqaqqz",
    },
  });

  const mailOptions = {
    from: "believeosawaru2@gmail.com",
    to: email,
    subject: "Your OTP code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log("OTP sent successfully");
  } catch (error) {
    console.log("Error sending OTP", error);
  }
};
