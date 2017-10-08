var messages = [];
var current_id = 0;
function addMessage(_message){
    current_id++;
    var super_message = { id : current_id , message : _message };
    messages.push(super_message);
    console.log(messages);
    return super_message.id;
} 
function getMessages(counter){
    if(current_id == counter)
        return 0;
     var length = messages.length-1;
     while(length >= 0){
         if(messages[length].id < counter)
           return slice(length+1, messages.length);
     }

}
function deleteMessage(id){
    for(i = 0; i<messages.length; i++){
        if(messages[i].id == id)
        messages.splice(i , 1);
    }
}
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
module.exports.deleteMessage = deleteMessage;

