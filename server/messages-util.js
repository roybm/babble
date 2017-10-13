"use strict";
var messages = [];
var current_id = 0;

function addMessage(_message) {
    current_id++;
    var super_message = {
        id: current_id,
        message: _message
    };
    messages.push(super_message);
    console.log(messages);
    return super_message.id;
}

function getMessages(counter) {
    var ans;
    if (counter > current_id) {
        return "-1";
    }
    if (current_id == counter)
        return "0";
    var length = messages.length - 1;
    while (length > 0) {
        if (messages[length].id <= counter) {
            ans = messages.slice(length + 1, (messages.length));
            return ans;

        }
        length--;
    }
    if (counter == 0) {
        ans = messages.slice(0, (messages.length));
        return ans;
    }

}

function deleteMessage(id) {
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].id == id) {
            messages.splice(i, 1);
            return 1;
        }
    }
    return 0;
}
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
module.exports.deleteMessage = deleteMessage;