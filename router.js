const router = require("express").Router();
const auth = require("./controller/auth");
const sign = require("./controller/sign");
const signDelete = require("./controller/signDelete");
const signSave = require("./controller/signSave");

//본인인증
router.post("/bpass/v1/devices/auth/:id", auth);
//인증서저장
router.post("/bpass/v1/devices/rsa/pv", signSave);
//서명
router.post("/bpass/v1/devices/rsa/sign", sign);
//인증서삭제
router.post("/bpass/v1/devices/rsa/pv/delete", signDelete);

const db = require("./common/db");
//
router.get("/logs", function (req, res) {
  db.getTranLog(req.query.svckey, res);
});

router.get("/ptrs", function (req, res) {
  db.getPrts(res);
});

router.get("/users", function (req, res) {
  db.getUsers(res);
});

module.exports = router;
