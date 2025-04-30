// import nodemailer from "nodemailer";

const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() + 900000);

  return otp.toString();
};

const sendOTP = async (email: string): Promise<void> => {
  const otp = generateOTP;

  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "believeosawaru2@gmail.com",
  //       pass: "fhfbfiugofp",
  //     },
  //   });

  //   const mailOptions = {
  //     from: "believeosawaru2@gmail.com",
  //     to: email,
  //     subject: "Your OTP code",
  //     text: `Your OTP code is ${otp}`,
  //   };

  //   try {
  //     await transporter.sendMail(mailOptions);

  //     console.log("OTP sent successfully");
  //   } catch (error) {
  //     console.log("Error sending OTP", error);
  //   }
};

export default sendOTP;
