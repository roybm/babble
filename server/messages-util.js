"use strict";
var messages = [];
var det = []; 
var current_id = 0;

function addMessage(_message) {
    
    current_id++;
    var id = current_id;
    var message =_message.message;
    var name = _message.user;
    var email = _message.email;
    var timestamp =  _message.timestamp;
    messages.push({"message": message});
    det.push({"id":id, "name":name, "email":email});
    return id;
}

function getMessages(counter) {
    var ans;
    if (det.length == 0){
        return "0";
    }
    if ((det[0].id > counter)) {
        ans = messages.slice(0, (messages.length));
        return ans;
    }
    var index = messages.length - 1;
    if (det[index].id <= counter){
        return "0";
    }
    while (index >= 0) {
        if (det[index].id <= counter) {
            if(messages.length > (index + 1)){
                ans = messages.slice(index + 1, (messages.length));
                return ans;
            }
            else{
                console.log("getMessages - major problem");
            }
        }
        index--;
    }
    console.log("getMessages - major problem");
}
function getIds(counter) {
    var ans;
    if (det.length == 0){
        return "0";
    }
    if ((det[0].id > counter)) {
        ans = det.slice(0, (messages.length));
        return ans;
    }
    var index = messages.length - 1;
    if (det[index].id <= counter){
        return "0";
    }
    while (index >= 0) {
        if (det[index].id <= counter) {
            if(messages.length > (index + 1)){
                ans = deleteMessage.slice(index + 1, (messages.length));
                return ans;
            }
            else{
                console.log("getIds - major problem");
            }
        }
        index--;
    }
    console.log("getIds - major problem");
}

function deleteMessage(id) {
    for (var i = 0; i < messages.length; i++) {
        if (det[i].id == id) {
            messages.splice(i, 1);
            det.splice(i,1);
            return 1;
        }
    }
    return 0;
}
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
module.exports.deleteMessage = deleteMessage;
module.exports.getIds = getIds;