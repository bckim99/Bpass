"use strict";
const path = require('path');
const FileStreamRotator = require("file-stream-rotator");
const morgan = require("morgan");

let express = require("express");
let app = express();
let router = require("./router");
let bodyParser = require("body-parser");
let cors = require("cors")();
let tokenVerify = require("./common/tokenVerify");
let db = require("./common/db");

app.engine("html", require("hogan-express"));
app.enable("view cache");
app.set("views", __dirname + "/views");
app.set("view engine", "html");

var logDirectory = path.join(__dirname, "log");
var accessLogStream = FileStreamRotator.getStream({
	date_format: "YYYYMMDD",
	filename: path.join(logDirectory, "access-%DATE%.log"),
	frequency: "daily",
	verbose: true
});

morgan.token('user-agent', function (req, res) {
	return req.headers['user-agent'] + " req-body[" + JSON.stringify(req.body) + "] res-body[" + JSON.stringify(res.resBody) + "]";
});

app.use(morgan("combined", {
	stream: accessLogStream
}));

app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(tokenVerify);
app.use("/", router);

app.listen(8080, function() {
  console.log("localhost:8080");
});
