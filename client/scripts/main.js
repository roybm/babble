"use strict";

window.Babble = {};
window.Babble.register = register;
window.Babble.logout = logout;
window.Babble.getMessages = getMessages;
window.Babble.postMessage = postMessage;
window.Babble.deleteMessage = deleteMessage;
window.Babble.remove = remove;
window.Babble.sendMessage = sendMessage;
window.Babble.getStats = getStats;
///////////logout
window.onbeforeunload = function(){
    logout();
}; 

//////////login
window.onload = function () {
    var babble;
    if (localStorage.getItem('babble')) {
        getUserDetails(0);
    } else {
        babble = {
            "currentMessage": 0,
            "userInfo": {
                "name": "",
                "email": ""
            }
        };
        var toJson = JSON.stringify(babble);
        saveStuff(toJson);
        start_modal();
    }
};


////register////
function register(user_det) {
    var user_d = user_det;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            stop_modal();
            preGetMessages();//get the messages
            PreGetStats();  //lopo
            console.log("register complete");
        }
    };
    xhr.timeout = 120000;
    xhr.open("POST", "http://localhost:9000/register", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var babble = {
        "currentMessage": 0,
        "userInfo": {
            "name": user_d.name,
            "email": user_d.email
        }
    };
    var temp_s = JSON.stringify(babble);
    saveStuff(temp_s);
    var user = {
        "name": user_d.name,
        "email": user_d.email
    };
    xhr.send(JSON.stringify(user));
    xhr.ontimeout = function () {
        console.log("timoute");
    };
}

////logout////
function logout() {
    Error.apply("goodby!");
    if ((JSON.stringify(loadStuff())) != null) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("user is out");
                PreGetStats();  //lopo
            }
        };
        xhr.timeout = 120000;
        xhr.open("POST", "http://localhost:9000/logOut", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        console.log("user is almost out");
        var details = JSON.parse(loadStuff()).userInfo;
        xhr.send(JSON.stringify(details));
        xhr.ontimeout = function () {
            console.log("timoute");
        };
    }
}
////getMessages////
function getMessages(counter, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(2);
            callback(JSON.parse(this.responseText));
            var babble = JSON.parse(loadStuff());
            if ((this.responseText != "") && (this.responseText != "[]") && (this.responseText != '"[]"')) {
                var messages_d = JSON.parse(this.responseText);
                var id;
                if ((typeof messages_d) === "string")
                    messages_d = JSON.parse(messages_d);
                if (Array.isArray(messages_d)) {
                    if (messages_d.length > 0)
                        id = messages_d[messages_d.length - 1].id;
                } else {
                    id = messages_d.id;
                }
                if (babble.currentMessage != id) {
                    babble.currentMessage = id;
                    var toJson = JSON.stringify(babble);
                    saveStuff(toJson);
                    create_messages_list(messages_d);
                    console.log("get messages complete");
                }
                preGetMessages();
            }
        }
    };
    xhr.timeout = 120000;
    xhr.open("GET", "http://localhost:9000/messages" + "?counter=" + counter, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.ontimeout = function () {
        preGetMessages();
    };

}

function preGetMessages() {
    var last_id = 0;
    var babble1 = JSON.parse(loadStuff());
    if ((babble1 != "null") && (typeof babble1 != undefined)) {
        last_id = babble1.currentMessage;
        getMessages(last_id, function () {});
    }
}
////postMessages////
function postMessage(message, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
            console.log("add message complete");
            PreGetStats();
            preGetMessages();
        }
    };
    xhr.timeout = 120000;
    xhr.open("POST", "http://localhost:9000/messages", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(message));
    console.log("mes sent for adding");
    xhr.ontimeout = function () {
        console.log("timeout");
    };
}

function sendMessage() {
    var _message = document.getElementById("mes").value;
    var babble = JSON.parse(loadStuff());
    var name_d = babble.userInfo.name;
    var email_d = babble.userInfo.email;
    var data = {
        "user": name_d,
        "email": email_d,
        "message": _message,
        "timestamp": Date.now()
    };
    postMessage(data);
}
////deleteMessage////
function deleteMessage(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(this.responseText));
            console.log("delete message complete1");
            remove(id);
            PreGetStats();
            console.log("delete message complete2");
        }
    };
    xhr.timeout = 120000;
    xhr.open("DELETE", "http://localhost:9000/messages/" + id, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
    console.log("mes s to del");
    xhr.ontimeout = function () {
        console.log("timeout");
    };
}

function remove(x) {
    var elem = document.getElementById("li_" + x);
    if (elem != null) {
        var pare = elem.parentNode;
        if (pare != null) {
            return pare.removeChild(elem);
        }
    }
}
////getStats////
function getStats(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
            if (this.responseText != "") {
                var stat_d = JSON.parse(this.responseText);
                var m_counter, u_counter, m_elem, u_elem;
                m_counter = stat_d.messages;
                u_counter = stat_d.users;
                m_elem = document.getElementsByClassName('message_c')[0];
                u_elem = document.getElementsByClassName('user_c')[0];
                if (u_elem != null) {
                    u_elem.innerHTML = u_counter;
                }
                if (m_elem != null) {
                    m_elem.innerHTML = m_counter;
                }

                console.log("get stats complete");
            }
            PreGetStats();
        }
    };
    xhr.timeout = 120000;
    xhr.open("GET", "http://localhost:9000/stats", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.ontimeout = function () {
        PreGetStats();
    };
}

function PreGetStats() {
    getStats(function () {});
}




function getUserDetails(x) {
    var name, email, babble;
    if (x == 0) {
        babble = JSON.parse(loadStuff());
        babble.currentMessage = "0";
    } else {
        stop_modal();
        name = document.getElementById('reg_Name').value;
        email = document.getElementById('reg_Email').value;
        babble = JSON.parse(loadStuff());
        babble.userInfo.name = name;
        babble.userInfo.email = email;
    }
    var toJson = JSON.stringify(babble);
    saveStuff(toJson);
    PreGetStats();
    preGetMessages();
    register(babble.userInfo);
}



/////////textarea
makeGrowable(document.querySelector('.js-growable'));

function makeGrowable(container) {
    if (container) {
        var area = container.querySelector('textarea');
        var clone = container.querySelector('span');
        if (area) {
            area.addEventListener('input', function (e) {
                clone.textContent = area.value;
            });
        }
    }
}
///////modal
function start_modal() {
    var modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "block";
    }
}

function stop_modal() {
    var modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "none";
    }

}
////////////Localstorage
function saveStuff(local_info) {
    var local1 = JSON.parse(local_info);
    var user_Info = (local1.userInfo);
    var name_ = user_Info.name;
    var email_ = user_Info.email;
    var current_temp = local1.currentMessage;
    var babble = {
        "currentMessage": current_temp + "",
        "userInfo": {
            "name": name_ + "",
            "email": email_ + ""
        }
    };
    console.log('13');
    localStorage.setItem("babble", JSON.stringify(babble));
}



function loadStuff() {
    return localStorage.getItem("babble");
}
////////////create list of messages
function add_message_to_list(temp_message) {
    var ti, y, b, n, i, tx, temp_message_1, user_detai;
    user_detai = JSON.parse(loadStuff());
    if ((typeof temp_message) === "string")
        temp_message_1 = JSON.parse(temp_message);
    else
        temp_message_1 = temp_message;
    if (Array.isArray(temp_message_1)) {
        y = document.createElement("LI");
        y.setAttribute("id", "li_" + temp_message_1[0].id);
        y.setAttribute("class", "over_li");
        tx = document.createElement("p");
        tx.setAttribute("class", "textbox");
        tx.appendChild(document.createTextNode(temp_message_1[0].message));
        if (user_detai.userInfo.email == temp_message_1[0].email) {
            b = document.createElement("button");
            b.setAttribute("class", "bt_n");
            b.setAttribute("id", temp_message_1[0].id);
            b.setAttribute("onclick", "Babble.deleteMessage(" + temp_message_1.id[0] + ", function(){})");
        }
        n = document.createElement("CITE");
        n.appendChild(document.createTextNode(temp_message_1[0].name));
        n.setAttribute("class", "namebox");
        i = document.createElement("IMG");
        ti = document.createElement("TIME");
        ti.appendChild(document.createTextNode(create_readable_hour(temp_message_1[0].timestamp)));
        ti.setAttribute("class", "timebox");
    } else {
        y = document.createElement("LI");
        y.setAttribute("id", "li_" + temp_message_1.id);
        y.setAttribute("class", "over_li");
        tx = document.createElement("p");
        tx.setAttribute("class", "textbox");
        tx.appendChild(document.createTextNode(temp_message_1.message));
        if (user_detai.userInfo.email == temp_message_1.email) {
            b = document.createElement("button");
            b.setAttribute("class", "bt_n");
            b.setAttribute("id", temp_message_1.id);
            b.setAttribute("onclick", "Babble.deleteMessage(" + temp_message_1.id + ", function(){})");
        }
        n = document.createElement("CITE");
        n.appendChild(document.createTextNode(temp_message_1.name));
        n.setAttribute("class", "namebox");
        i = document.createElement("IMG");
        ti = document.createElement("TIME");
        ti.appendChild(document.createTextNode( create_readable_hour(temp_message_1.timestamp)));
        ti.setAttribute("class", "timebox");
    }
    var x = document.createTextNode("x");
    if(b){
        b.appendChild(x);
        y.appendChild(b);
    }
    y.appendChild(tx);
    y.appendChild(ti);
    y.appendChild(i);
    y.appendChild(n);
    document.getElementById("myOl").appendChild(y);
}

function create_messages_list(mesagges_) {
    if (Array.isArray(mesagges_)) {
        for (var i = 0; i < mesagges_.length; i++) {
            add_message_to_list(mesagges_[i]);
        }
    } else {
        add_message_to_list(mesagges_);
    }
}


function create_readable_hour(d){
    var timestamp = d,
    date = new Date(timestamp * 1000),
    datevalues = [
       date.getHours(),
       date.getMinutes(),
    ];
    
    // Will display time in 10:30:23 format
    var formattedTime = datevalues[0] + ':' + datevalues[1] ;
    return formattedTime;
}

