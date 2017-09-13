
if(document.querySelector('.js-growable'))
makeGrowable(document.querySelector('.js-growable'));


function makeGrowable(container) {
    if (container.querySelector('textarea')){
        var area = container.querySelector('textarea');
	    var clone = container.querySelector('span');
	    area.addEventListener('input', function(e) {
		    clone.textContent = area.value;
        });
    }
	
}
console.log('hello from client');



//Babble.register(userInfo:Object)
//Babble.getMessages(counter:Number, callback:Function)
//Babble.postMessage(message:Object, callback:Function)
//Babble.deleteMessage(id:String, callback:Function)
//Babble.getStats(callback:Function)



var form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log(form.action);
    var data = '';
    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        if (element.name) {
            data += element.name + '=' + encodeURIComponent(element.value) + '&';
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    if (form.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.addEventListener('load', function (e) { 
        console.log(e.target.responseText); 
    });
    xhr.send(data);
});
