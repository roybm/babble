"use strict";
var express = require('express');
var app = express();
var parser = require('body-parser');
var users = [];


app.use(parser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.options("/*", function (req, res, next) {
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
  console.log("add message");
  var i = messages.addMessage(message);
  var super_message = {
    id: i,
    message: message
  };
  for (var j = 0; j < asks.length; j++) {
    u_mes = asks.pop();
    u_mes.json(super_message);
  }
  for (j = 0; j < statsPolling.length; j++) {
    u_mes = statsPolling.pop();
    if (messages.getMessages(0) == "0")
      u_mes.json({
        "users": users.length,
        "messages": 0
      });
    else
      u_mes.json({
        "users": users.length,
        "messages": messages.getMessages(0).length
      });
  }
  res.json();
});

app.delete('/messages/:id', function (req, res) {
  console.log("delete message");
  var id = req.params.id;
  var u_mes, j;
  if ((typeof id === 'undefined') || (isNaN(id))) {
    res.status(400);
    res.send('400: Bad Paramaters');
  }
  if (messages.deleteMessage(id)) {
    for (j = 0; j < statsPolling.length; j++) {
      u_mes = statsPolling.pop();
      if (messages.getMessages(0) == "0") {
        u_mes.json({
          "users": users.length,
          "messages": 0
        });
      } else {
        u_mes.json({
          "users": users.length,
          "messages": messages.getMessages(0).length
        });
      }
      console.log("users_array = " + users);
    }
    res.send();
  } else {
    console.log("message not found");
  }
});
app.listen(9000, function () {
  console.log('server listening on port 9000!');
});
////////////////////////////////////////////////////

var statsPolling = [];
app.get('/stats', function (req, res) {
  console.log("get stats");
  statsPolling.push(res);
});
app.post('/register', function (req, res) {
  console.log("register");
  var u_mes;
  if (prevent_doubles(req.body)) {
    users.push(req.body);
    res.json(req.body);
  }
  for (var j = 0; j < statsPolling.length; j++) {
    u_mes = statsPolling.pop();
    if (messages.getMessages(0) == "0")
      u_mes.json({
        "users": users.length,
        "messages": 0
      });
    else
      u_mes.json({
        "users": users.length,
        "messages": messages.getMessages(0).length
      });
    console.log("users_array = " + users);
  }
});

app.delete('/logOut', function (req, res) {
  console.log("logout");
  var u_mes;
  delete_u(req.body);
  for (var j = 0; j < statsPolling.length; j++) {
    u_mes = statsPolling.pop();
    if (messages.getMessages(0) == "0")
      u_mes.json({
        "users": users.length,
        "messages": 0
      });
    else
      u_mes.json({
        "users": users.length,
        "messages": messages.getMessages(0).length
      });
    console.log("users_array = " + users);
  }
});

function delete_u(data) {
  for (var i = 0; i < users.length; i++) {
    if ((data.name == users[i].name) && (data.email == users[i].email))
      users.splice(i, 1);
  }
}

function prevent_doubles(data) {
  for (var i = 0; i < users.length; i++) {
    if ((data.name == users[i].name) && (data.email == users[i].email))
      return 0;
  }
  return 1;
}
///////////////////////////////////////////////////
var asks = [];

app.get('/messages', function (req, res) {
  var counter = req.query.counter;
  console.log("get mes " + counter);
  if ((typeof counter === 'undefined') || (isNaN(counter))) {
    res.status(400);
    res.send('400: Bad Paramaters');
  }
  if (needData(counter)) {
    var temp_ids = messages.getIds(counter);
    var temp = messages.getMessages(counter);
    var super_message;
    var super_array=[];
    for (var i = 0; i < messages.length; i++){
      super_message = {
        "id": temp_ids[i],
        "message": messages[i]
      };
      super_array.push(super_message);
    }
    res.json(JSON.stringify(super_array));
  } else {
    asks.push(res);
  }
});

function needData(i) {
  if (messages.getMessages(i) != "0") {
    return 1;
  }
  return 0;
}



app.all('/', function (req, res) {
  handle_405(res);
});
app.all('/messages', function (req, res) {
  handle_405(res);
});
app.all('/messages/:id', function (req, res) {
  handle_405(res);
});
app.all('/logOut', function (req, res) {
  handle_405(res);
});
app.all('/register', function (req, res) {
  handle_405(res);
});
app.all('/stats', function (req, res) {
  handle_405(res);
});
app.all('*', function (req, res) {
  res.status(404);
  res.send('404: File Not Found');
});

function handle_405(res) {
  res.status(405);
  res.send('405: bad for certain URL');
}