///////////logout
window.onbeforeunload = function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
           console.log("user is out");
        }
    };
    xhr.open("DELETE", "http://localhost:3000/logout", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log("user is almost out");
    xhr.send(JSON.stringify(loadStuff().userInfo));
    xhr.ontimeout = function(e){
        console.log("timout");
    };
}
window.onload = function(){
    if(localStorage.getItem('babble')){
        var babble = JSON.parse(loadStuff());   
        babble.currentMessage = "0";
        var toJson = JSON.stringify(babble);
        saveStuff(toJson);
         stop_modal();
         getMessages();
         console.log("hhh")
         getStatistics();
         console.log("hhh")
         register_1();
    }     
}



///////////addmessage
var form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    var babble = JSON.parse(loadStuff());
    var name_d = babble.userInfo.name;
    var data = { user:name_d, message:document.getElementById("mes").value};
        var myJson = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            
        }
    };
    var frm = document.getElementById('mes').value = '';
    xhr.open("POST", "http://localhost:3000/messages", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(myJson);  
});




///////////delete message
function deleteMessage(x){
    var id=x;
    var babble = JSON.parse(loadStuff());
    temp_s = JSON.stringify(babble);
   saveStuff(temp_s);
   remove(id);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            getMessages();
        }
    };
    xhr.timeout = 120000;
    xhr.open("delete", "http://localhost:3000/messages"+id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send();
    xhr.ontimeout = function(e){
        getMessages();
    };

}
function remove(x) {
    var elem = document.getElementById("li_"+x);
    return elem.parentNode.removeChild(elem);
    } 
//////////////////getMessages
function getMessages(){
        var last_id=0;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                var babble = JSON.parse(loadStuff());
                if(this.responseText != ""){
                    var messages_d=JSON.parse(this.responseText);
                    var id;
                    if((typeof messages_d) === "string")
                        messages_d = JSON.parse(messages_d);
                    if(Array.isArray(messages_d)) {
                        id = messages_d[messages_d.length-1].id;
                    }
                    else{
                        id = messages_d.id;
                    }    
                if(babble.currentMessage != id){    
                    babble.currentMessage = id;
                    var toJson = JSON.stringify(babble);
                    saveStuff(toJson);
                    create_messages_list(messages_d);
                }    
            }
            getMessages();
            }
        };
        xhr.timeout = 120000;
        var babble1 = JSON.parse(loadStuff());
        last_id = babble1.currentMessage;
        xhr.open("GET", "http://localhost:3000/messages"+ "?counter="+last_id , true);
        xhr.setRequestHeader('Content-Type', 'application/json');
         xhr.send();
        xhr.ontimeout = function(){
            getMessages();
        };
}
//////////////////////////////////
function getStatistics(){
     var xhr = new XMLHttpRequest();
     xhr.onreadystatechange = function(){
        console.log("1");
         if (this.readyState == 4 && this.status == 200) {
            console.log("2");
            if(this.responseText != ""){
                console.log("3");
                 var stat_d=JSON.parse(this.responseText);
                 var m_counter, u_counter;
                 m_counter = stat_d.messages;
                 u_counter = stat_d.users;
                 document.getElementsByClassName('user_c')[0].innerHTML = u_counter;
                 document.getElementsByClassName('message_c')[0].innerHTML = m_counter;
             }
             getStatistics();
         }
     };
     xhr.timeout = 120000;
     xhr.open("GET", "http://localhost:3000/stats", true);
     xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
     xhr.ontimeout = function(){
        getStatistics();
     };
}

///////////register_1
function register_1(){
    var name, email;
    stop_modal();
    var babble = JSON.parse(loadStuff());
    name = babble.userInfo.name;
    email = babble.userInfo.email;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
           getMessages();
        }
    };
    xhr.open("POST", "http://localhost:3000/register", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var user={"name":name,"email":email};
    xhr.send(JSON.stringify(user));
    xhr.ontimeout = function(e){
        console.log("timout");
    };
}
///////////register
    function register(x){
        var name, email;
        stop_modal();
        if(x==0){
            name = document.getElementById('reg_Name').value;            
            email = document.getElementById('reg_Email').value;
        }else if(x==1){
            name = '';
            email = '';
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                var temp_s = JSON.parse(xhr.responseText);
                var babble = {currentMessage:0, 
                    userInfo:{name:temp_s.name,
                                email:temp_s.email}};
                temp_s = JSON.stringify(babble);
               saveStuff(temp_s);
               getMessages();
               
            }
        };
        xhr.open("POST", "http://localhost:3000/register", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var user={"name":name,"email":email};
        xhr.send(JSON.stringify(user));
        xhr.ontimeout = function(e){
            console.log("timout");
        };
    }


/////////textarea
makeGrowable(document.querySelector('.js-growable'));
function makeGrowable(container) {
	var area = container.querySelector('textarea');
	var clone = container.querySelector('span');
	area.addEventListener('input', function(e) {
		clone.textContent = area.value;
	});
}
///////modal
function start_modal() {
    document.getElementById('myModal').style.display = "block";
}
function stop_modal() {
    document.getElementById('myModal').style.display = "none";
}



function saveStuff(local_info){
    var local1 = JSON.parse(local_info);
    var user_Info = (local1.userInfo) ;
    var name_ = user_Info.name;
    var email_ = user_Info.email;
    var current_temp = local1.currentMessage;
    var babble = {currentMessage:current_temp, 
                    userInfo:{name:name_+"",
                                email:email_+""}};
                                console.log('13');
    localStorage.setItem("babble" , JSON.stringify(babble));
}
function loadStuff(){
    return localStorage.getItem("babble");
}

function add_message_to_list(temp_message) {
    var t, y, b, temp_message_1;
    if((typeof temp_message) === "string")
        temp_message_1 = JSON.parse(temp_message);
    else
        temp_message_1 = temp_message;
   if(Array.isArray(temp_message_1)) {
         y = document.createElement("LI");
         y.setAttribute("id", "li_"+temp_message_1[0].id);
         t = document.createTextNode(temp_message_1[0].message.message);
         b = document.createElement("button");
         b.setAttribute("class", "bt_n");
         b.setAttribute("id", temp_message_1[0].id);
         b.setAttribute("onclick", "deleteMessage()");
    }
    else{
         y = document.createElement("LI");
         y.setAttribute("id", "li_"+temp_message_1.id);
         t = document.createTextNode(temp_message_1.message.message);
         b = document.createElement("button");
         b.setAttribute("class", "bt_n");
         b.setAttribute("id", temp_message_1.id);
         b.setAttribute("onclick", "deleteMessage("+temp_message_1.id+")");
    }
    var x = document.createTextNode("x");
    b.appendChild(x);
    y.appendChild(b);
    y.appendChild(t);
    document.getElementById("myOl").appendChild(y);
}

function create_messages_list(mesagges_) {
    if(Array.isArray(mesagges_)) {
        for(i=0; i<mesagges_.length; i++){
            add_message_to_list(mesagges_[i]);
        }
    }
    else{
        add_message_to_list(mesagges_);
    }
   
}