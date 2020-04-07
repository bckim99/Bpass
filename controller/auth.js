const axios = require("axios");
const utils = require("../common/utils");
const response = require("../common/response");
const sevicePossibilityCheck = require("./serviceCheck");
const db = require("../common/db");

//고객인증
//https://[Domain Name]/v1/usp/devices/{3des(mdn)}/simpass/uaAuth?staging=N&nopAgent={nopAgent}

function fn(httpReq, httpRes) {
  var mdn = httpReq.body.mdn;
  var name = httpReq.body.name || "";
  var birth = httpReq.body.birth || "";
  var pin_cert_yn = httpReq.body.pin_cert_yn || "Y";
  var pin = httpReq.body.pin || "";
  var display1 = httpReq.body.display1 || "PIN 번호 6자리를 입력하세요.";
  var aom_yn = httpReq.body.aom_yn || "Y";

  sevicePossibilityCheck("UA", mdn).then(function(serviceCheckResData){
    db.setTranLog(httpReq.headers["x-bpass-key"], httpReq.body, serviceCheckResData);

    var url = utils.getUrl("/v1/usp/devices/" + mdn + "/simpass/uaAuth");
    axios.post(url, {
      name: name,
      birth: birth,
      pin_cert_yn: pin_cert_yn,
      pin: pin,
      display1: display1,
      aom_yn: aom_yn
    }).then(function (res) {
      console.log(res.data);

      response(httpReq, httpRes, "", res.data);
    }).catch(function (e) {
      console.log(e.response.data);

      response(httpReq, httpRes, e.response.status, e.response.data);
    });
  }).catch(function(e){
    //서비스 사용 여부 API에러
    if (e.response) {
      response(httpReq, httpRes, e.response.status, e.response.data);
    } else {
      response(httpReq, httpRes, "", e);
    }
  });
};

module.exports = fn;
