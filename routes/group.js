module.exports = function(connection){
  const route = require('express').Router();

//1-2. 회원초대
//1-1. 그룹 생성
/*
group_name , group_desc , user_id_fk
멤버수, 멤버
*/

route.post('/create',function(req, res){
  var sql_create = `INSERT INTO example2.groups(group_name,group_desc,user_id_fk) VALUES(?,?,?)`;
  //var sql_member = 'INSERT INTO group_users(group_id_fk, user_id_fk) SELECT group_id,user_id_fk FROM example2.groups WHERE user_id_fk=? AND group_name = ?';
  //var sql_member = 'INSERT INTO group_users(group_id_fk,user_id_fk) SELECT G.group_id, G.user_id_fk  FROM example2.groups G LEFT JOIN group_users U ON G.group_id = U.group_id_fk'+
              //    ' WHERE G.user_id_fk = ? AND U.group_id_fk IS NULL';
 /*var sql_member = //'INSERT INTO group_users(group_id_fk,user_id_fk) VALUES((SELECT LAST_INSERT_ID()),?);'
*/

  var sql_member = `
  DELIMITER $$
  CREATE PROCEDURE myFunction100()
  BEGIN DECLARE i INT DEFAULT ?;
      WHILE (i <= ?) DO
          INSERT INTO group_users(group_id_fk, user_id_fk) VALUE ((SELECT LAST_INSERT_ID()),?);
          SET i = i + 1;
        END WHILE;
    END$$
  DELIMITER ;

  CALL myFunction100();`;
  var group_name = req.body.group_name;
  var group_desc = req.body.group_desc;
  var user_id_fk = parseInt(req.body.user_id_fk);

 //회원초대
/*  console.log(req.body.member.length);
  var member = [];
  for(var i = 0; i<req.body.member.length; i++){
    member[i] = req.body.member[i];
    //console.log(member[i]);
  }
 */
 //회원이 10명이라고하면, 10명의 쿼리를 만들어서 할 순 없자너??/ 그럼 for문이나 while문을 만들어서 해야할것같은디...

console.log("ㅣ둫"+req.body.member.length);
  var params = [group_name,group_desc,user_id_fk];
  var params2 = [1, 3, 2];

  connection.query(sql_create, params, function(err,result){
    if(err) throw err;
    console.log('create');
  });

  connection.query(sql_member,params2, function(err,result){
    if(err) throw err;
    console.log('member');
  });

});

//2-1. 회원알림리스트
route.get('/request/list',function(req,res){
      var sql = `SELECT * FROM example2.group_users U ,example2.groups G
                WHERE U.status = ? AND U.group_id_fk = G.group_id AND U.user_id_fk = ?;`
      var params = ['0', req.query.user_id];
     var data = [];
      connection.query(sql, params, function(err,result){
        if(err) throw err;

        result.forEach(function(){
              data.push({
                group_name: result.group_name,
                group_desc: result.group_desc
              });
          });

       res.json(data);
      });
});

//2-2. 회원수락
route.post('/member',function(req, res){
   var sql = `UPDATE group_users SET status = ? WHERE group_id_fk = ? AND user_id_fk = ?;`;
   var params = ['1', req.body.group_id, req.body.user_id];

connection.query(sql, params, function(err,result){
                  if(err) throw err;
        });
});

//3. 회원들의 리스트
  return route;
};
