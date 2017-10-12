var express = require('express');
var app = express();
var parser = require('body-parser');
var users=[];


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

app.get('/', function (req, res) {    
  res.send('Hello World!');
});

app.post('/messages', function (req, res) {
    var u_mes;
    var message = req.body;
    var i = messages.addMessage(message);
    var super_message = { id : i , message : message };
   for(j=0; j<asks.length; j++){
      u_mes = asks.pop();
      u_mes.json(super_message);
    }
    for(j=0; j<statsPolling.length; j++){
      u_mes = statsPolling.pop();
      u_mes.json({"users":users.length,"messages":messages.getMessages(0).length});
    }
    res.json(i);
});
 
app.delete('/messages/:id', function (req, res){
  var id = req.params.id;
  if ((typeof id === 'undefined') || (isNaN(id)) ){
    res.status(400);
    res.send('400: Bad Paramaters');
  }
  messages.deleteMessage(id);
  for(j=0; j<statsPolling.length; j++){
    u_mes = statsPolling.pop();
    u_mes.json({"users":users.length,"messages":messages.getMessages(0).length});
  }
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

////////////////////////////////////////////////////

var statsPolling=[];
app.get('/stats', function(req, res){
  statsPolling.push(res);
});
app.post('/register', function(req, res){
  users.push(req.body);
  console.log("heeeeyyyy");
  for(j=0; j<statsPolling.length; j++){
    u_mes = statsPolling.pop();
    u_mes.json({"users":users.length,"messages":messages.getMessages(0).length});
    console.log("users_array = " + users);
  }
  res.json(req.body);
});

app.delete('/logOut', function(req, res){
  users.delete(req.body);
  for(j=0; j<statsPolling.length; j++){
    u_mes = statsPolling.pop();
    u_mes.json({"users":users.length,"messages":messages.getMessages().length});
  }
});
///////////////////////////////////////////////////
var asks=[];

app.get('/messages', function(req, res){
  var counter = req.query.counter;
  console.log("counter = " + counter);
    if ((typeof counter === 'undefined') || (isNaN(counter)) ){
    res.status(400);
    res.send('400: Bad Paramaters');
  }
  if(needData(counter)){
    var temp = messages.getMessages(counter);
    res.json(JSON.stringify(temp));
  }
  else{
    asks.push(res);
  }
});

function needData(i){
  if(messages.getMessages(i) != "0")
  {
    return 1;
  }
  return 0;
  }



app.all('/',function(req, res){
  handle_405(res);
});
app.all('/messages',function(req, res){
  handle_405(res);
});
app.all('/messages/:id',function(req, res){
  handle_405(res);
});
app.all('/logOut',function(req, res){
  handle_405(res);
});
app.all('/register',function(req, res){
  handle_405(res);
});app.all('/stats',function(req, res){
  handle_405(res);
});
app.all('*', function(req, res){
  res.status(404);
  res.send('404: File Not Found');
});
function handle_405(res){
  res.status(405);
  res.send('405: bad for certain URL');
}
