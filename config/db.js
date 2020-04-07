var vcap_services = {
  "connectionLimit": "50"
};

try {
  var vcap = JSON.parse(process.env.VCAP_SERVICES);

  vcap_services.host = vcap["p.mysql"][0].credentials.hostname;
  vcap_services.user = vcap["p.mysql"][0].credentials.username;
  vcap_services.password = vcap["p.mysql"][0].credentials.password;
  vcap_services.port = vcap["p.mysql"][0].credentials.port;
  vcap_services.database = vcap["p.mysql"][0].credentials.name;
} catch (e) {
  vcap_services.host = "localhost";
  vcap_services.port = "3306";
  vcap_services.user = "root";
  vcap_services.password = "11111111";
  vcap_services.database = "usim";
}

//console.log(vcap_services);

module.exports = vcap_services;
