const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET
);
const emailFrom = process.env.FROM_EMAIL;

const websiteDomain = "http://localhost:3000";

const sendRegistrationEmail = async (email, name, token) => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: emailFrom,
            Name: "Clockaburra",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Welcome to Our Platform",
          TextPart: `Hi ${name},\n\nWelcome to our platform. Please click the following link to complete your registration.\n\n${websiteDomain}/validation?token=${token}`,
          HTMLPart: `<h3>Hi ${name}</h3><br />Welcome to our platform. Please click the following link to complete your registration.<br /><a href="${websiteDomain}/validation?token=${token}">Complete Your Registration</a>`,
          CustomID: "UserRegistration",
        },
      ],
    });
    const emailResponse = await request;
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendResetPasswordEmail = async (email, name, token) => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: emailFrom,
            Name: "Clockaburra",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Reset your password",
          TextPart: `Hi ${name},\n\nYou have requested a link to reset your password, please click in the following link to introduce your new password.\n\n${websiteDomain}/reset-password?token=${token}`,
          HTMLPart: `<h3>Hi ${name}</h3><br />You have requested a link to reset your password, please click in the following link to introduce your new password.<br /> <a href="${websiteDomain}/reset-password?token=${token}">Reset your password here!</a>  <br /><br /> If it was not you, please ignore this mail.`,
          CustomID: "UserResetPassword",
        },
      ],
    });
    const emailResponse = await request;
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

module.exports = {
  sendRegistrationEmail,
  isValidEmail,
  sendResetPasswordEmail,
};
