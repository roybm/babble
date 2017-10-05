var express = require('express');
var app = express();
var parser = require('body-parser');



app.use(parser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.status(204).send();
});
var messages = require('./messages-util');

app.get('/', function (req, res) {        //messages?counter=XX 		(like /poll in the article)
  res.send('Hello World!');
});

app.post('/messages', function (req, res) {
  console.log("post request");
    var message = req.body;
    var i = messages.addMessage(message);
    
    res.json(i);
});
 
app.delete('/messages/:id', function (req, res){
  var id = req.params.id;
  messages.deleteMessage(id);
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

///////////////////////////////////////////////////
var users=[];
var statsPolling=[];
app.post('/register', function(req, res){
  users.push(req.body);
  while(statsPolling.length > 0){
   statsPolling.pop.json({users:numof users, messages: num of messages})
  }
});

app.delete('/logOut', function(req, res){
  users.delet(req.body);
  while(statsPolling.length > 0){
    statsPolling.pop.json({users:numof users, messages: num of messages})
  }
});

app.get('/')
