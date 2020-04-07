const axios = require("axios");
const utils = require("../common/utils");
const response = require("../common/response");
const sevicePossibilityCheck = require("./serviceCheck");
const db = require("../common/db");

//인증서 저장
//https://[Domain Name]/v1/usp/devices/{3des(mdn)}/simpass/rsaRegPv?staging=N&nopAgent={nopAgent}

function fn(httpReq, httpRes) {
  var mdn = httpReq.body.mdn;
  var pv = httpReq.body.pv;
  var display1 = httpReq.body.display1 || "인증서를 발급하겠습니까?";
  var display2 = httpReq.body.display2 || "등록할 인증서의 비밀번호를 입력하세요.";
  var display3 = httpReq.body.display3 || "";
  var aom_yn = httpReq.body.aom_yn || "Y";
  var name = httpReq.body.name || "";
  var birth = httpReq.body.birth || "";

  sevicePossibilityCheck("RSAA", mdn).then(function(serviceCheckResData){
    db.setTranLog(httpReq.headers["x-bpass-key"], httpReq.body, serviceCheckResData);

    var url = utils.getUrl("/v1/usp/devices/" + mdn + "/simpass/rsaRegPv");
    axios.post(url, {
      join_type: "RSAA",
      pv: pv,
      display1: display1,
      display2: display2,
      display3: display3,
      aom_yn: "Y",
      name: name,
      birth: birth
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
