var nodemailer = require('nodemailer');

var Email = {};
Email.Config = {
    secureConnection: false,
    port: 587,
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {ciphers:'SSLv3'}
};
Email.Send = function(inFromName, inToEmail, inSubject, inMessage)
{
    var email = {
        from: "<"+process.env.EMAIL_USERNAME+">",
        to: inToEmail,
        subject: inSubject + " (from "+inFromName+")",
        text:'',
        html: inMessage
    };

    return new Promise(function(inResolve, inReject){
        nodemailer
        .createTransport(Email.Config)
        .sendMail(email, function(error, info){
            if(error){
                inReject(error);
            }else{
                inResolve();
            }
        });
    });

};

module.exports = Email;