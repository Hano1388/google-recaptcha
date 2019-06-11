const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/captcha", (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    return res.json({
      success: false,
      msg: "Please Select captcha"
    });
  }

  // Secret Key
  const secretKey = process.env.RECAPTCHA_SECRET;

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req
    .body.captcha}$remoteip=${req.connection.remoteAddress}`;

  // Make request to verify URL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
  });

  // If not successful
  if (body.success !== undefined && !body.success) {
    return res.json({
      success: false,
      msg: "Failed captcha verification"
    });
  }

  // If successful
  return res.json({
    success: true,
    msg: "Captcha successfully passed"
  });
});

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
