let db = require("./db");
const response = require("./response");

function tokenVerify(req, res, next) {
  if(req.url === "/" || req.url === "/favicon.ico" || /^\/logs/.test(req.url) || /^\/ptrs/.test(req.url) || /^\/users/.test(req.url)) {
    next();
  } else {
    var mdn = req.body.mdn;
    if (!mdn) {
      response(req, res, 400, {
        error: {
           "id": "400",
           "message": "Bad Request"
        }
      });
      return;
    }

    db.tokenCheck(req.headers["x-bpass-key"], next, res);
  }
}

module.exports = tokenVerify;
