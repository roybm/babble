"use strict";
var messages = [];
var det = []; 
var current_id = 0;

function addMessage(_message) {
    
    
    var id = current_id++;
    var message =_message;
    var name = _message.name;
    var email = _message.email;
    messages.push(message);
    det.push({"id":id, "name":name, "email":email});
    console.log(messages);
    console.log(det);
    return id;
}

function getMessages(counter) {
    var ans;
    console.log("counter = " + counter);
    console.log("current_id = " + current_id);
    if (counter > current_id) {
        return "-1";
    }
    if (current_id == counter){
        return "0";
    }
    var length = messages.length - 1;
    if (length == 0) {
        ans = messages.slice(length, (messages.length));
        return ans;
    }
    while (length >= 0) {
        if (det[length] <= counter) {
            ans = messages.slice(length + 1, (messages.length));
            if(messages.length - (length + 1) == 1 ){
                return ans;
            }
        }
        length--;
    }
    if (counter == 0) {
        ans = messages.slice(0, (messages.length));
        return ans;
    }
    
}
function getIds(counter) {
    var ans;
    if (counter > current_id) {
        return "-1";
    }
    if (current_id == counter){
        return "0";
    }
    var length = messages.length - 1;
    if (length == 0) {
        ans = det.slice(length, (messages.length));
        return ans;
    }
    while (length >= 0) {
        if (det[length] <= counter) {
            ans = det.slice(length + 1, (messages.length));
            if(messages.length - (length + 1) == 1 ){
                return ans;
            }
        }
        length--;
    }
    if (counter == 0) {
        ans = det.slice(0, (messages.length));
        return ans;
    }
    
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