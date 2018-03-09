var swit = false;
function droper(client,but){
	var but = document.getElementById(but);
	var value = document.getElementById(client);

	if(swit===false){
		value.style.display= 'block';
		but.style.backgroundColor = 'red';
		but.innerHTML = 'Close';
		swit = true;
	}else{
		value.style.display= 'none';
		but.style.backgroundColor = 'green';
		but.innerHTML = 'View';
		swit = false;
	}
}

var swit1 = false;
function formGiver(client,but){
	var but = document.getElementById(but);
	var value = document.getElementById(client);

	if(swit1===false){
		value.style.display= 'block';
		but.style.backgroundColor = 'red';
		but.style.color = 'white';
		but.innerHTML = 'Close';
		swit1 = true;
	}else{
		value.style.display= 'none';
		but.style.backgroundColor = 'purple';
		but.style.color = 'gold';
		but.innerHTML = 'Add Recipe';
		swit1 = false;
	}
}

var swit2 = false;
function addItem(client,but){
	var but = document.getElementById(but);
	var value = document.getElementById(client);

	if(swit2===false){
		value.style.display= 'block';
		but.style.backgroundColor = 'red';
		but.style.color = 'white';
		but.innerHTML = 'Close';
		swit2 = true;
	}else{
		value.style.display= 'none';
		but.style.backgroundColor = 'purple';
		but.style.color = 'gold';
		but.innerHTML = 'Add More';
		swit2 = false;
	}
}

var swit3 = false;
function edit(client,but){
	var but = document.getElementById(but);
	var value = document.getElementById(client);

	if(swit3===false){
		value.style.display= 'block';
		but.style.backgroundColor = 'red';
		but.style.color = 'white';
		but.innerHTML = 'Close';
		swit3 = true;
	}else{
		value.style.display= 'none';
		but.style.backgroundColor = 'green';
		but.style.color = 'white';
		but.innerHTML = 'Edit';
		swit3 = false;
	}
}

/* Ajax request */
function adder(){
	console.log('it enters this function');
	$(document).ready(function(){
		console.log('Entring ajax');
		/* Add item in the admin region */
		$('.addItem1').click(function(e){
			console.log('taking link class');
			id = $(this).data('id');
			$.ajax({
				url: '/admin/addItem',
				type: 'GET',
				success: function(){
					alert('Success in getting page!!!');
					console.log('Success!!!');
				},
				error: function(){
					console.log('Hello there is an error here..');
				}
			});
			window.location = '/admin/addItem';
		});
	});
}