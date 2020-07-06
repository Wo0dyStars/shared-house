const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

exports.sendEmail = (receiver, token) => {
	const oauth2Client = new OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'https://developers.google.com/oauthplayground'
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.GOOGLE_REFRESH_TOKEN
	});

	const accessToken = oauth2Client.getAccessToken();

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: 'kerteszpetr@gmail.com',
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
			accessToken: accessToken
		}
	});

	let mailOptions = {
		from: 'kerteszpetr@gmail.com',
		to: receiver,
		subject: 'Confirmation',
		html: `http://localhost:4200/confirmation/${token}`
	};

	transporter.sendMail(mailOptions, (error, response) => {
		if (error) {
			console.log(error);
		} else {
			console.log('The message has been sent to ', receiver, ', with the following details: ', response);
		}
	});
};
