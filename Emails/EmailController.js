const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// const transporter = nodemailer.createTransport({
//   host: 'mail.guardtrol.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'noreply@alphatrol.com',
//     pass: 'gzZH;p;?R~!Q',
//   },
// })

const transporter = nodemailer.createTransport({
  host: "natxult1.armadaservers.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@alphatrol.com",
    pass: "E$f!fk2z&kiM",
  },
});

const sendVerificationMail = async (props) => {
  const filePath = path.join(__dirname, "Templates", "verify-account.hbs");

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: "Lets Confirm Its Really You",
    html: template({
      title: "Email Verification",
      code: props.code,
      name: props.name,
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

const sendWelcomeMail = async (props) => {
  const filePath = path.join(__dirname, "Templates", "welcome.hbs");

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: "Welcome to Guardtrol",
    html: template({
      name: props.name,
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

const sendPasswordResetLink = async (props) => {
  const filePath = path.join(__dirname, "Templates", "reset-password.hbs");

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: "Reset Your Password",
    html: template({
      token: props.token,
      name: props.name,
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

const sendPasswordResetSuccessMail = async (props) => {
  const filePath = path.join(
    __dirname,
    "Templates",
    "PasswordResetSuccessMail.hbs"
  );

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: "You Have Changed Your Password",
    html: template({}),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

const sendNotificationMail = async (props) => {
  const filePath = path.join(__dirname, "Templates", "notification.hbs");

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: props.subject,
    html: template({
      header: props.header,
      name: props.name,
      title: props.title,
      message1: props.message1 || null,
      message2: props.message2 || null,
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

const sendSubscriptionMail = async (props) => {
  const filePath = path.join(__dirname, "Templates", "transaction-receipt.hbs");

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: props.subject,
    html: template({
      header: props.header,
      name: props.name,
      title: props.title,
      plan: props.plan,
      beats: props.beats,
      date: props.date,
      amount: props.amount,
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

const sendSubcriptionUpdateMail = async (props) => {
  const filePath = path.join(__dirname, "Templates", "subscription-update.hbs");

  const templateSource = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(templateSource);

  const mailOptions = {
    from: "noreply@alphatrol.com",
    to: props.email,
    subject: props.subject,
    html: template({
      header: props.header,
      name: props.name,
      title: props.title,
      plan: props.plan,
      beats: props.beats,
      maxextraguards: props.maxextraguards,
      date: props.date,
      amount: props.amount,
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }

    console.log("Message sent: %s", info.response);
    return true;
  });
};

exports.sendVerificationMail = sendVerificationMail;
exports.sendWelcomeMail = sendWelcomeMail;
exports.sendPasswordResetLink = sendPasswordResetLink;
exports.sendPasswordResetSuccessMail = sendPasswordResetSuccessMail;
exports.sendNotificationMail = sendNotificationMail;
exports.sendSubscriptionMail = sendSubscriptionMail;
exports.sendSubcriptionUpdateMail = sendSubcriptionUpdateMail;
