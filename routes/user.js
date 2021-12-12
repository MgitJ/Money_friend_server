module.exports = function(connection){

  const route = require('express').Router();

//1. 회원가입
  route.post('/join', function(req,res){
    console.log(req.body);
    var user_id = req.body.user_id;
    var user_pwd = req.body.user_pwd;
    var user_name = req.body.user_name;

    // 삽입을 수행하는 sql문.
    var sql = 'INSERT INTO Users (user_id, user_pwd, user_name) VALUES (?, ?, ?)';
    var params = [user_id, user_pwd, user_name];

    // sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = '에러가 발생했습니다';

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            message = '회원가입에 성공했습니다.';
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    });
  })

//2. 로그인
  route.post('/login', function (req, res) {
  var user_id = req.body.user_id;
  var user_pwd = req.body.user_pwd;
  var sql = 'select * from users where email = ?';
console.log(user_id+user_pwd);
  connection.query(sql, user_id, function (err, result) {
      var resultCode = 404;
      var message = '에러가 발생했습니다';
console.log('conn:'+user_id+result[0].user_pwd+result[0].user_id);
      if (err) {
          console.log(err);
      } else {
          if (result.length === 0) {
              resultCode = 204;
              message = '존재하지 않는 계정입니다!';
          } else if (user_pwd !== result[0].password) {
              resultCode = 204;
              message = '비밀번호가 틀렸습니다!';
          } else {
              resultCode = 200;
              message = '로그인 성공!';
          }
      }

      res.json({
          'code': resultCode,
          'message': message,
          //'user_id':result[0].user_id
      });
  })
  });

//3. 전체 유저 리스트
  route.get('/list',function(request, response){

     var user_id = parseInt(request.query.email);
      var sql = 'SELECT email, status FROM users U LEFT JOIN friends F ON (CASE WHEN F.friend1 = ? THEN F.friend2 = U.user_id WHEN F.friend2= ? THEN F.friend1= U.user_id END)';

      var params = [user_id,user_id];
      var data=[];
     connection.query(sql, params, function(err,result,fields){
       if(err) throw err;

       result.forEach(function(result){
             data.push({
               email: result.email,
               status: result.status
             });
         });

      response.json(data);
     });
  });

return route;
};
