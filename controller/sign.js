const axios = require("axios");
const utils = require("../common/utils");
const response = require("../common/response");
const sevicePossibilityCheck = require("./serviceCheck");
const db = require("../common/db");

//인증서 서명
//https://[Domain Name]/v1/usp/devices/{3des(mdn)}/simpass/rsaReqSign?staging=N&nopAgent={nopAgent}

function fn(httpReq, httpRes) {
  var mdn = httpReq.body.mdn;
  var verify_data = httpReq.body.verify_data;
  var display1 = httpReq.body.display1 || "서명하시겠습니까?";
  var name = httpReq.body.name || "";
  var birth = httpReq.body.birth || "";

  sevicePossibilityCheck("RSAA", mdn).then(function(serviceCheckResData){
    db.setTranLog(httpReq.headers["x-bpass-key"], httpReq.body, serviceCheckResData);

    var url = utils.getUrl("/v1/usp/devices/" + mdn + "/simpass/rsaReqSign");
    axios.post(url, {
      join_type: "RSAA",
      verify_data: verify_data,
      display1: display1,
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
