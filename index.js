const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const e = require('express');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

var database_connection = mysql.createPool({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b1abf5379fdd30",
  password: "4d65d9bc",
  database: "heroku_13ed534030c3d23"

  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "saaz"
});

let mail_sender = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'azuankhairil00@gmail.com',
    pass: '990507017959'
  }
});

app.get('/', (req, res) => {
  console.log("Functioning!");
});

app.get('/display_value', (req, res) => {
  var node_studid = req.query.studid;

  database_connection.getConnection(function (err, connection) {
    if (err) { console.log(err); }
    else {
      var sql = "SELECT * FROM STUDENT WHERE STUDID = '" + node_studid + "'";
      database_connection.query(sql, function (err, result) {
        if (err) { console.log(err); }
        else {
          for (var i = 0; i < result.length; i++) {
            if (result[i].classID === null) {
              var secsql = "SELECT * FROM STUDENT WHERE STUDID = '" + node_studid + "'";
              database_connection.query(secsql, function (err, result) {
                if (err) { console.log(err); }
                else { res.send(result); }
              });
            }
            else {
              var secsql = "SELECT * FROM STUDENT S JOIN CLASS C ON S.CLASSID = C.CLASSID JOIN PROGRAM P ON C.PROGCODE = P.PROGCODE WHERE S.STUDID = '" + node_studid + "'";
              database_connection.query(secsql, function (err, result) {
                if (err) { console.log(err); }
                else { res.send(result); }
              });
            }
          }
        }
        connection.release();
      });
    }
  });
});

app.post('/send_email', function (req, res) {
  var node_studemail = req.body.studemail;
  var node_studid = req.body.studid;
  var node_studpass = req.body.studpass;
  var node_studname = req.body.studname;
  
  var mail_content = {
    from: "saaz@noreply.com",
    to: node_studemail,
    subject: "SAAZ STUDENT MANAGEMENT SYSTEM LOGIN INFORMATION",
    text: "<div>Student ID: " + node_studid + "</div><div>Student Password: " + node_studpass + "</div><div>Student Name: " + node_studname + "</div>"
  };

  mail_sender.sendMail(mail_content, function(err, res) {
    if (err) { console.log(err); }
    else { console.log(res.response); }
  });
});

const port_number = process.env.PORT;
app.listen(port_number, () => {
  console.log("Listening to port number " + port_number);
});