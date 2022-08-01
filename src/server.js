const express = require("express");
const serverless = require("serverless-http");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const port = 5000;



// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/.netlify/functions/api", router);
app.listen(port, () => console.log("Server Running"));


router.get("/hi", (req, res) => {
  res.json({
    hello: "hi!"
  });
});


const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "arora1234vaibhav@gmail.com",
    pass: "kmemkkwotfnkitql"
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: "arora1234vaibhav@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});



module.exports = app;
module.exports.handler = serverless(app);