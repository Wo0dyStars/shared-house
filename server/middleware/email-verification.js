const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

exports.sendEmail = (receiver, token, angularURL) => {
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
		html: `
			<!DOCTYPE html>
			<html lang="en">
			<body>
				Dear User,<br><br>

				<strong>Thank you for your registration in my Shared house application!</strong><br><br>

				I am really excited to see you on board, so please go ahead and verify your email address by clicking the following link<br><br>
				<a href='${angularURL}/confirmation/${token}' style='color: blue; text-decoration: none; font-size: 1.2rem;'>Verification link</a><br><br>

				Thank you again and see you later. :)
			</body>
			</html>
			
			`
	};

	transporter.sendMail(mailOptions, (error, response) => {
		if (error) {
			console.log(error);
		} else {
			console.log('The message has been sent to ', receiver, ', with the following details: ', response);
		}
	});
};
