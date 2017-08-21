
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
