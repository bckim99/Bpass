const crypto = require("crypto");
const fs = require("fs");
const config = require("../config/config");

//let _config = fs.readFileSync(__dirname + "/config/config.json");
//let config = JSON.parse(_config);
let utils = { };

utils.getUrl = function (url) {
  var _url = config.domain + url + "?staging=" + config.staging + "&nopAgent=";
  var nopAgent = "";
  nopAgent = nopAgent + "" + config.application.ClientType;
  nopAgent = nopAgent + ";" + config.application.ClientID;
  nopAgent = nopAgent + ";" + config.application.PackageName;
  nopAgent = nopAgent + ";" + config.application.ComponentID;
  nopAgent = nopAgent + ";" + config.application.STID;
  nopAgent = nopAgent + ";";
  _url = _url + nopAgent;

  console.log(_url);
  return _url;
};

//sha1로 인코딩(본인인증에 사용)
utils.createSha1 = function (text) {
  var buf1 = Buffer.from([0x53, 0x49, 0x4D, 0x50, 0x41, 0x53, 0x53, 0x3F]);
  var buf2 = Buffer.from(text, "utf8");
  var buf3 = Buffer.concat([buf1, buf2]);

  for (var i=0; i<10; i++) {
    var shasum = crypto.createHash("sha1");
    shasum.update(buf3);
    buf3 = shasum.digest();
  }
  return buf3.toString("hex");
};

//sha256로 인코딩(서명 및 인증서 저장시 키 생성에 사용. 키는 상위 16바이트를 사용.)
utils.createSha256 = function (text) {
  var buf1 = Buffer.from([0x53, 0x49, 0x4D, 0x50, 0x41, 0x53, 0x53, 0x3F]);
  var buf2 = Buffer.from(text, "utf8");
  var buf3 = Buffer.concat([buf1, buf2]);

  for (var i=0; i<10; i++) {
    var shasum = crypto.createHash("sha256");
    shasum.update(buf3);
    buf3 = shasum.digest();
  }
  return buf3.toString("hex");
};

utils.padding = function (buf) {
  var remainder = buf.length % 16;
  var _padding = 16 - remainder;
  var length = 0;
  if (_padding > 0) {
    length = 16 - _padding;
  }

  var padding = [];
  for (var i=0; i<length; i++) {
    padding.push(0x00);
  }
  return Buffer.from(padding);
};

utils.getAes128Cbc = function (text, key) {
  var buf1 = Buffer.from([0x53, 0x49, 0x4D, 0x50, 0x41, 0x53, 0x53, 0x3F]);
  var buf2 = Buffer.from(text, "hex");
  var buf3 = Buffer.concat([buf1, buf2]);
  var buf4 = Buffer.concat([buf3, utils.padding(buf3)]);
  var keyBuf = Buffer.from(key, "hex");

  var _iv = [];
  for (var i=0; i<16; i++) {
    _iv.push(0x00);
  }

  var cipher = crypto.createCipheriv("aes-128-cbc", keyBuf, Buffer.from(_iv));
  var result = cipher.update(buf4, "utf8", "binary");

  return Buffer.from(result, "binary").toString("hex");
};

module.exports = utils;
