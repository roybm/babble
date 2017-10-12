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
function deleteMessage(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            getMessages();
        }
    };
    xhr.timeout = 120000;
    xhr.open("delete", "http://localhost:3000/messages"+":id", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    /*//var message=domjsgetMessage();
    var id={"mes":message};
    xhr.send(JSON.stringify(user));*/
    xhr.ontimeout = function(e){
        getMessages();
    };

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
                babble.currentMessage = id;
                var toJson = JSON.stringify(babble);
                saveStuff(toJson);
                create_messages_list(messages_d);
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




///////////register
    function register(x){
        var name, email;
        stop_modal();
        if(x==0){
            name = document.getElementById('reg_Name').value;            
            email = document.getElementById('reg_Email').value;
        }else if(x==1){
            name = 'Anonymous';
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
///////////logout
//window.onbeforeunload = logout;
function logout(){
        var user_temp = loadStuff();
        console.log(JSON.stringify(user_temp));
        localStorage.clear();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
           console.log("user is out");
        }
    };
    xhr.open("POST", "http://localhost:3000/logout", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log("user is almost out");
    xhr.send(JSON.stringify(user_temp));
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

// When the user clicks the button, open the modal 
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
    var t,y,temp_message_1;
    if((typeof temp_message) === "string")
        temp_message_1 = JSON.parse(temp_message);
    else
        temp_message_1 = temp_message;
   if(Array.isArray(temp_message_1)) {
         y = document.createElement("LI");
         t = document.createTextNode(temp_message_1[0].message.message);
    }
    else{
         y = document.createElement("LI");
         t = document.createTextNode(temp_message_1.message.message);
    }
    y.appendChild(t);
    document.getElementById("myOl").appendChild(y);
}

function create_messages_list(mesagges_) {
    //var mesagges_t = JSON.parse(mesagges_);
    if(Array.isArray(mesagges_)) {
        for(i=0; i<mesagges_.length; i++){
            add_message_to_list(mesagges_[i]);
        }
    }
    else{
        add_message_to_list(mesagges_);
    }
   
}