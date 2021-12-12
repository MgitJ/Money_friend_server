 module.exports = function(connection){
   const route = require('express').Router();

 //1. 친구요청
       route.get('/request',function(request,response){

         var sql = 'INSERT INTO friends VALUES (?, ?, ?)';
         var user_id = parseInt(request.query.user_id);
         var friend_id = parseInt(request.query.friend_id);
         var params = [user_id,friend_id,'0'];

          connection.query(sql,params,function(err, result){
             if(err) throw err;
             console.log('friend_apply');
          });
       });


//2. 친구요청받은 리스트
   route.get('/request/list',function(request, response) {
      var sql = 'SELECT U.email FROM friends F,users U WHERE F.friend2 = ? AND F.status = ? AND F.friend1 = U.user_id';
      var params = [parseInt(request.query.user_id), '0'];
      connection.query(sql, params, function(err,result,fields){
        if(err) throw err;
        console.log(result);

        var data=[]
        result.forEach(function(result){
          data.push({email: result.email});
        });
        response.json(data);
      });
   });

//3. 친구요청수락
   route.post('/request/accept',function(request, response) {
      var user_id = parseInt(request.body.user_id);
      var friend_id = parseInt(request.body.friend_id);
      var params = ['1' , user_id, friend_id];

      var sql = 'UPDATE friends SET status= ? WHERE friend1=? AND friend2=?;'

      connection.query(sql, params, function(err, result){
         if(err) throw err;
         console.log('finish');
       });
   });


//4. 친구리스트 '/list'  ok
route.get('/list',function(request, response) {
   var sql = 'SELECT F.status, U.email FROM users U, friends F  WHERE'
              +' CASE WHEN F.friend1 = ? THEN F.friend2 = U.user_id WHEN F.friend2= ? THEN F.friend1= U.user_id'
              +' END AND F.status= ?';
  var params = [parseInt(request.query.email), parseInt(request.query.email),'1'];
   connection.query(sql,params , function(err,result,fields){
     if(err) throw err;
     console.log(result);
     var data=[]
     result.forEach(function(result){
      // data.push({status: result.status});
       data.push({email: result.email});
     });
     response.json(data);
   });
});
   return route;
 };
