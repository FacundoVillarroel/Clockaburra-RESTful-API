const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET
);

const sendRegistrationEmail = async (email, name) => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "facu.villarroel96@gmail.com",
            Name: "Clockaburra",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Welcome to Our Platform",
          TextPart: `Hi ${name},\n\nWelcome to our platform. Please click the following link to complete your registration.\n\n[Registration Link]`,
          HTMLPart: `<h3>Hi ${name}</h3><br />Welcome to our platform. Please click the following link to complete your registration.<br /><a href="[Registration Link]">Complete Your Registration</a>`,
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

module.exports = { sendRegistrationEmail };
