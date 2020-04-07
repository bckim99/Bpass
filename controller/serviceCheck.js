const axios = require("axios");
const utils = require("../common/utils");

//서비스 가능 여부 조회(114page)
//https://[Domain Name]/v1/usp/devices/{3des(mdn)}/simpass/join?staging=N&nopAgent={nopAgent}

function fn(join_type, mdn) {
  return new Promise(function(resolve, reject){
    var url = utils.getUrl("/v1/usp/devices/" + mdn + "/simpass/join");
    axios.post(url, {
      join_type: join_type
    }).then(function (res) {
      console.log(res.data);

      if (res.data.body.svc_result === "Y") {
        resolve(res.data);
      } else {
        reject(res.data);
      }
    }).catch(function (e) {
      console.log(e.response.data);

      reject(e);
    });
  });
};

module.exports = fn;
