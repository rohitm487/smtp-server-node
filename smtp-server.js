const { SMTPServer } = require('smtp-server');
const simpleParser = require('mailparser').simpleParser;

const server = new SMTPServer({
  authOptional: true,

  onMailFrom(address, session, callback) {
    console.log('Mail From:', address.address);
    callback(); // Accept the sender address
  },

  onRcptTo(address, session, callback) {
    console.log('Rcpt To:', address.address);
    callback(); // Accept the recipient address
  },

  onData(stream, session, callback) {
    simpleParser(stream, {}, (err, parsed) => {
      if (err) {
        console.error('Error parsing email:', err);
        return callback(err);
      }
      console.log('Received email:');
      console.log('From:', parsed.from.text);
      console.log('To:', parsed.to.text);
      console.log('Subject:', parsed.subject);
      console.log('Text:', parsed.text);
      console.log('HTML:', parsed.html);
      callback(null); // Accept the message once processed
    });
  },

  onAuth(auth, session, callback) {
    callback(null, { user: auth.username }); // Accept all auth attempts
  }
});

server.listen(2525, () => {
  console.log('SMTP server listening on port 2525');
});
