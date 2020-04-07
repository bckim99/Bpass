const mariadb = require("mariadb");
const fs = require("fs");

const config = require("../config/db");

const pool = mariadb.createPool(config);

let obj = {};

async function setTranLog(key, reqBody, resData) {
  let conn;
  try {
  	conn = await pool.getConnection();
  	const rows = await conn.query("SELECT * FROM MGT_SVC WHERE SVC_KEY=? AND SVC_ACT_YN='Y' AND DEL_YN='N' LIMIT 1", [key]);

    var txid = "";
    if (resData.body) {
      txid = resData.body.tid;
    }

    if (rows.length > 0) {
      var row = rows[0];
      const res = await conn.query("INSERT INTO MGT_TX_LOG (PVR_ID, TX_ID, SVC_KEY, REQ_BODY, RES_BODY, COR_ID) VALUES (?, ?, ?, ?, ?, ?)", ["sk", txid, key, JSON.stringify(reqBody), JSON.stringify(resData), row.COR_ID]);
    }
  } catch (err) {
    console.log(err);
  } finally {
	   if (conn) {
       return conn.end();
     }
  }
};

async function tokenCheck(key, next, res) {
  let conn;
  try {
  	conn = await pool.getConnection();
  	const rows = await conn.query("SELECT * FROM MGT_SVC WHERE SVC_KEY=? AND SVC_ACT_YN='Y' AND DEL_YN='N'", [key]);

  	if (rows.length > 0) {
      next();
    } else {
      res.status(403).json({
        error: {
           "id": "403",
           "message": "토큰이 유효하지 않습니다."
        }
      });
    }
  } catch (err) {
    console.log(err);
    //error
    res.status(500).json({
      error: {
         "id": "500",
         "message": "Internal Server Error"
      }
    });
  } finally {
	   if (conn) {
       return conn.end();
     }
  }
};

async function getTranLog(svckey, res) {
  let conn;
  try {
  	conn = await pool.getConnection();

    var rows = [];
    if (svckey) {
      rows = await conn.query("SELECT * FROM MGT_TX_LOG AS log JOIN MGT_USR AS usr ON usr.USR_ID = log.COR_ID WHERE SVC_KEY=?", [svckey]);
    } else {
      rows = await conn.query("SELECT * FROM MGT_TX_LOG AS log JOIN MGT_USR AS usr ON usr.USR_ID = log.COR_ID");
    }

    res.render("logs", {
      rows: rows
    });

  } catch (err) {
    console.log(err);
  } finally {
	   if (conn) {
       return conn.end();
     }
  }
};

async function getPrts(res) {
  let conn;
  try {
  	conn = await pool.getConnection();

    var rows = await conn.query("SELECT * FROM MGT_PTR");
    res.render("prts", {
      rows: rows
    });

  } catch (err) {
    console.log(err);
  } finally {
	   if (conn) {
       return conn.end();
     }
  }
};

async function getUsers(res) {
  let conn;
  try {
  	conn = await pool.getConnection();

    var rows = await conn.query("SELECT * FROM MGT_USR");
    res.render("users", {
      rows: rows
    });

  } catch (err) {
    console.log(err);
  } finally {
	   if (conn) {
       return conn.end();
     }
  }
};

obj.setTranLog = setTranLog;
obj.tokenCheck = tokenCheck;
obj.getTranLog = getTranLog;
obj.getPrts = getPrts;
obj.getUsers = getUsers;

module.exports = obj;
