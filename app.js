var express = require("express");
var app = express();
var server = app.listen(80, function(){
  console.log('Photo Free Express Server start');
});

app.get('/', function(req, res){
  res.send('Hello, This is first page');
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip + ' connected');
});
