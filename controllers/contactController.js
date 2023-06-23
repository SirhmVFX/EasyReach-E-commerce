const HttpError = require("../HttpException");
const sendEmail = require("../utils/sendEmail");

const sendContact = async (req, res) => {
  const { email, name, message } = req.body;
  if (!email || !name || !message) {
    throw new HttpError("Required parameters");
  }

  const subject = "New Contact Submission";
  const send_to = "admin@gmail.com";
  const sent_from = "Econnect App <hello@seemetracker.com>";
  const reply_to = "no-reply@ecnnect.com";
  const template = "contact";

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
    );
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = {
  sendContact
};
