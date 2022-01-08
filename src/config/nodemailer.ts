type Nodemailer = {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth: {
    user: string; // generated ethereal user
    pass: string; // generated ethereal password
  };
};

export const nodemailerConfig: Nodemailer = {
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
