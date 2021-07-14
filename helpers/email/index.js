const nodemailer = require('nodemailer')
const { SUBJECT_NAME, TEXT_CASE, TEXT_HISTORY, QUEUE } = require('../constant')
const { updateLogJob } = require('../job/log')
const fs = require('fs')

//Initial the SMTP server
const smtpTrans = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
  sender: SUBJECT_NAME,
  secureConnection: true
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
const optionsWithAttachment = (subject, attachments, email, jobName) => {
  let text
  if (jobName === QUEUE.CASE) {
    text = TEXT_CASE
  } else {
    text = TEXT_HISTORY
  }
	return {
    from: process.env.EMAIL_FROM,
	  to: email,
	  subject, attachments, text
  }
}

const condition = async (err, path, jobId) => {
  const param = {
    job_status: null, job_progress: 100,
    type: 'email', message: null
  }
  if(err) {
    console.info(`sending email error : ${err}`)
    param.job_status = 'Error'
    param.message = err.toString()
    await updateLogJob(jobId, param)
  } else {
    if(path) fs.unlinkSync(path)
    console.info(`sending email success`)
    param.job_status = 'Sent'
    param.message = 'Email Sent'
    await updateLogJob(jobId, param)
  }
}

const sendEmailWithAttachment = (subject, attachments, email, path, jobId, jobName) => {
  smtpTrans.sendMail(optionsWithAttachment(subject, attachments, email, jobName), async (err, res) => {
    await condition(err, path, jobId)
  })
}


module.exports = {
  sendEmailWithAttachment
}