"use strict";
var messages = [];
var ids = []; 
var current_id = 0;

function addMessage(_message) {
    
    
    var id = current_id++;
    var message =_message;
    
    messages.push(message);
    ids.push(id);
    console.log(messages);
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
        if (ids[length] <= counter) {
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
        ans = ids.slice(length, (messages.length));
        return ans;
    }
    while (length >= 0) {
        if (ids[length] <= counter) {
            ans = ids.slice(length + 1, (messages.length));
            if(messages.length - (length + 1) == 1 ){
                return ans;
            }
        }
        length--;
    }
    if (counter == 0) {
        ans = ids.slice(0, (messages.length));
        return ans;
    }
    
}

function deleteMessage(id) {
    for (var i = 0; i < messages.length; i++) {
        if (ids[i] == id) {
            messages.splice(i, 1);
            ids.splice(i,1);
            return 1;
        }
    }
    return 0;
}
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
module.exports.deleteMessage = deleteMessage;
module.exports.getIds = getIds;