const nodemailer = require('nodemailer')
const fs = require('fs')
//Instantiate the SMTP server
const smtpTrans = nodemailer.createTransport({
	host: process.env.HOST_EMAIL,
	port: process.env.EMAIL_PORT,
	secure: true,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
})

// verify connection configuration
smtpTrans.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server Email is ready to take our messages");
  }
});

//Specify what the email will look like
const optionsWithAttachment = (subject, attachments) => {
	return {
    from: process.env.GMAIL_USER,
	  to: process.env.EXAMPLE_USER,
	  subject, attachments
  }
}

const sendEmailWithAttachment = (subject, attachments, user, path) => {
  smtpTrans.sendMail(optionsWithAttachment(subject, attachments), (err, res)=>{
    if(err) {
      console.log(err)
    } else {
      console.log(`data send to user : ${user.fullname}`);
      fs.unlinkSync(path)
    }
  })
}


module.exports = {
  sendEmailWithAttachment
}