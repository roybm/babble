///////////addmessage
var form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log(form.action);
    var data = { user:document.getElementById("id-name").value , message:document.getElementById("mes").value};
        var myJson = JSON.stringify(data);
             console.log(myJson);
    var xhr = new XMLHttpRequest();
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
    xhr.timeout = 2000;
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
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
               var messages_d=JSON.parse(this.responseText);
               for(var i=0; i<messages_d.length; i++){
                document.getElementsByClassName("messages").innerHTML = messages_d;
               }
            getMessages();
            }
        };
        xhr.timeout = 2000;
        xhr.open("GET", "http://localhost:3000/mes"+"counter=1", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        //var message=domjsgetMessage();
        var user={"mes":message};
        xhr.send(JSON.stringify(user));
        xhr.ontimeout = function(e){
            getMessages();
        };

}




///////////register
    function register(){
      var Form_r = document.getElementsByClassName("login");
        var name = Form_r.children[1].innerHTML;
        var email = Form_r.children[5].innerHTML;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                console.log('success now put the data in the local storage');
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

window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = "none";
    }
}