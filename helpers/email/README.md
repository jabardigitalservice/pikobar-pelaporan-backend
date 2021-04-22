## HOW TO USE

### CODE QUALITY (CODE OF CONDUCT)
This function is useful for setup email using package nodemailer

```js
// Initial transport
const smtpTrans = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
  sender: SUBJECT_NAME,
	tls: true
})
```

```js
// Initial transport
const smtpTrans = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
  sender: SUBJECT_NAME,
	tls: true
})
```

```js
// verify connection configuration check if connected or fails
smtpTrans.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server Email is ready to take our messages");
  }
});
```

```js
// options email sending setup with attachment
const optionsWithAttachment = (subject, attachments, email) => {
	return {
    from: process.env.EMAIL_FROM,
	  to: email,
	  subject, attachments,
    text: TEXT_EMAIL
  }
}
```

```js
// progress sending email
const sendEmailWithAttachment = (subject, attachments, email, path, jobId) => {
  smtpTrans.sendMail(optionsWithAttachment(subject, attachments, email), async (err, res) => {
    const param = {
      job_status: null, job_progress: 100,
      type: 'email', message: null
    }
    if(err) {
      param.job_status = 'Failed'
      param.message = err.toString()
      await updateLogJob(jobId, param)
    } else {
      fs.unlinkSync(path)
      param.job_status = 'Done'
      await updateLogJob(jobId, param)
    }
  })
}
```


