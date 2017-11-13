

/// 모듈 추가 및 DB 테이블 생성 sqlite 와 goo.gl 모듈 둘 다 추가
function Init_DB()
{
googl = require('goo.gl');
googl.setKey('AIzaSyBN-o3sWgTZbknAEfPdet92TrIKJ96ax7Q');
sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database(':memory:');
db.run("CREATE TABLE i_db (TIME float, ID int primary key, PASSWARD varchar2(15) not null, L_URL text, S_URL text)");
// db.run("CREATE TABLE ACCOUNT (E_MAIL text, AUTH_CODE text, CLIENT_ID text, CLIENT_SECRET text, REFRESH_TOKEN text, ACCESS_TOKEN text, EXPIRES_IN float)");
}

////이미지 테이블 INSERT long url까지만 인자로 받음
function i_db_insert(time, id, passward, l_url)
{
googl.shorten(l_url).then(function (shortUrl) {
var stmt = db.prepare("INSERT INTO i_db VALUES (?,?,?,?,?)");
stmt.run(time, id, passward, l_url, shortUrl);
stmt.finalize();
})
}

//// 이미지 테이블 UPDATE
 function i_db_update(time, passward, l_url, s_url, id)
{
var stmt = db.prepare("UPDATE i_db SET TIME = ?, PASSWARD = ?, L_URL = ?, S_URL = ? WHERE ID = ?");
stmt.run(time,passward,l_url,s_url, id);
stmt.finalize();
}
/// 이미지 테이블 DELETE
function i_db_del(id)
{
var stmt = db.prepare("DELETE FROM i_db WHERE ID = ?");
stmt.run(id);
stmt.finalize();
}


// ///계정 테이블 INSERT
// function ACCOUNT_insert(e_mail, auth_code, client_id, client_secret, refresh_token, access_token, expires_in)
// {
// var stmt = db.prepare("INSERT INTO ACCOUNT VALUES (?,?,?,?,?,?,?)");
// stmt.run(e_mail, auth_code, client_id, client_secret, refresh_token, access_token, expires_in);
// stmt.finalize();
// }
// ///계정 테이블 UPDATE
//  function ACCOUNT_update(e_mail, auth_code, client_id, client_secret, refresh_token, access_token, expires_in, e_mail_2)
// {
// var stmt = db.prepare("UPDATE ACCOUNT SET E_MAIL = ?, AUTH_CODE = ?, CLIENT_ID = ?, CLIENT_SECRET = ?, REFRESH_TOKEN = ?, ACCESS_TOKEN = ? ,EXPIRES_IN = ? WHERE E_MAIL = ?");
// stmt.run(e_mail, auth_code, client_id, client_secret, refresh_token, access_token, expires_in, e_mail_2);
// stmt.finalize();
// }
//
// ///계정 테이블 DELETE
// function ACCOUNT_del(e_mail)
// {
// var stmt = db.prepare("DELETE FROM ACCOUNT WHERE E_MAIL = ?");
// stmt.run(e_mail);
// stmt.finalize();
// }
