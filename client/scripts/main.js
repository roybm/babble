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

makeGrowable(document.querySelector('.js-growable'));
function makeGrowable(container) {
	var area = container.querySelector('textarea');
	var clone = container.querySelector('span');
	area.addEventListener('input', function(e) {
		clone.textContent = area.value;
	});
}

function start_modal(){
    document.getElementById('id01').style.display='block';
}