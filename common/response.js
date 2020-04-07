let db = require("./db");

function response(req, res, code, resData) {
  res.setHeader("Server", "SKTDC");

  var _resData = JSON.parse(JSON.stringify(resData));
  if (typeof _resData === "string") {
    res.json({
      error: {
        id: code,
        message: "WebServer Error"
      }
    });
    return;
  }
  if (_resData.body){
    if (_resData.body.tid) {
      var tx_id = _resData.body.tid;
      delete _resData.body.tid;
      _resData.body.tx_id = tx_id;
    }
  }

  if (code) {
    res.status(code);
    if (_resData.body) {
      res.json(_resData.body);
    } else {
      //error블럭이 있음
      res.json(_resData);
    }
  } else {
    res.json({
      res_body: _resData.body
    });
  }
  //파일 로그를 위해 프로퍼티 생성
  res.resBody = _resData.body
  db.setTranLog(req.headers["x-bpass-key"], req.body, resData);
}

module.exports = response;
