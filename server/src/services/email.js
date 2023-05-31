const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text) {
	const msg = {
		to,
		from: process.env.EMAIL_FROM,
		subject,
		text,
	};

	try {
		await sgMail.send(msg);
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	sendEmail,
};
