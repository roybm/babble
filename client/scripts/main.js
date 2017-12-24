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
        i.setAttribute("src", get_gravatar(temp_message_1[0].email, 50));
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
        i.setAttribute("src", get_gravatar(temp_message_1.email, 50))
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

function get_gravatar(email, size) {

    // MD5 (Message-Digest Algorithm) by WebToolkit
    // 

    var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

    var size = size || 80;

    return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
}