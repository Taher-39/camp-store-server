import config from "../config";
import { transporter } from "./mailTransporter";

export const sendVerificationEmail = async (to: string, code: string) => {
  const mailOptions = {
    from: `"Halal Zone" <${config.GMAIL}>`,
    to,
    subject: 'ইমেইল ভেরিফিকেশন কোড',
    html: `
      <h3>ইমেইল ভেরিফিকেশন</h3>
      <p>আপনার ভেরিফিকেশন কোড:</p>  
      <h2>${code}</h2>
      <p>এই কোডটি ২ মিনিটের জন্য প্রযোজ্য।</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
