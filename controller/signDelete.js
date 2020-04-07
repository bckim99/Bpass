const axios = require("axios");
const utils = require("../common/utils");
const response = require("../common/response");
const sevicePossibilityCheck = require("./serviceCheck");
const db = require("../common/db");

//인증서 삭제
//https://[Domain Name]/v1/usp/devices/{3des(mdn)}/simpass/rsaDelPv?staging=N&nopAgent={nopAgent}

function fn(httpReq, httpRes) {
  var mdn = httpReq.body.mdn;
  sevicePossibilityCheck("RSAA", mdn).then(function(serviceCheckResData){
    db.setTranLog(httpReq.headers["x-bpass-key"], httpReq.body, serviceCheckResData);

    var url = utils.getUrl("/v1/usp/devices/" + mdn + "/simpass/rsaDelPv");
    axios.post(url, {
      join_type: "RSAA"
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
