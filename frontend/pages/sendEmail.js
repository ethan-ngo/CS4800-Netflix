var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'domainfilms4800@gmail.com',
    pass: 'ajxb urse rcll uypz'
  }
});

var mailOptions = {
  from: 'domainfilms4800@gmail.com',
  to: 'ethanngo3539@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});