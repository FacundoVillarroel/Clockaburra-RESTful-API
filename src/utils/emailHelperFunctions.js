const jwt = require("jsonwebtoken");
const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET
);

const secretKey = process.env.JWT_VALIDATION_LINK_SECRET;

const sendRegistrationEmail = async (email, name) => {
  try {
    const token = jwt.sign({ name, email }, secretKey, { expiresIn: "5d" });
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
          TextPart: `Hi ${name},\n\nWelcome to our platform. Please click the following link to complete your registration.\n\nhttp://localhost:8080/auth/validation?token=${token}`,
          HTMLPart: `<h3>Hi ${name}</h3><br />Welcome to our platform. Please click the following link to complete your registration.<br /><a href="http://localhost:8080/auth/validation?token=${token}">Complete Your Registration</a>`,
          CustomID: "UserRegistration",
        },
      ],
    });
    console.log(`http://localhost:8080/auth/validation?token=${token}`);
    const emailResponse = await request;
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendRegistrationEmail };
