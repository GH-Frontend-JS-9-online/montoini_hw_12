let form = document.getElementById('myForm');
let checkBtn = document.getElementById('check');
let name = document.getElementById('userName');
let email = document.getElementById('emailAddress');
let pass1 = document.getElementById('password');
let fields = document.querySelectorAll('.field');

let generateError = function (text) {
	let error = document.createElement('div')
	error.className = 'error'
	error.style.color = 'red'
	error.innerHTML = text
	return error
}

let removeValidation = function () {
	let errors = form.querySelectorAll('.error')
	for (let i = 0; i < errors.length; i++) {
		errors[i].remove()
	}
}

let checkFields = function () {
	for (let i = 0; i < fields.length; i++) {
		if (!fields[i].value) {
			console.log('empty field', fields[i])
			let error = generateError('Empty field')
			form[i].parentElement.insertBefore(error, fields[i].nextSibling)
		}
	}
}

/*let chekPassword = function () {
	if (pass1.value !== pass2.value) {
		let error = generateError('Your password does not match')
		pass2.parentElement.insertBefore(error, pass2.nextSibling)
	}
}*/


//Sing up User
function CreateUser(name, email, password) {
	this.name = name;
	this.email = email;
	this.password = password;
}

function getUser() {
	let name =form.name.value;
	let email = form.email.value;
	let password =form.password.value;

	return new CreateUser(name, email, password);
}

function singupUser() {
	const urlSingup = 'https://geekhub-frontend-js-9.herokuapp.com/api/users/';
	const headers = {
		'Content-Type': 'application/json',
	}

	let user = getUser(); 

	return fetch(urlSingup, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers,
	}).then(response => {
 		if(response.ok) return response.json();
 		return response.json().then(error => {
 			let e = new Error('Something went wrong');
 			e.data = error;
 			throw e;
 		})
 	})
}

btnSingup.onclick = (event) => {
	event.preventDefault()
	removeValidation()
	checkFields()
	singupUser().then(data => {
		console.log(data);
		alert(`You have registered a new user:
			id: ${data._id}
			name: ${data.name}
			Email: ${data.email} 
			`);
		document.myForm.reset();
		setTimeout(() => {
 			document.location.href = 'chat.html';
 		}, 1000);
	})
	.catch(err => {
 		console.log(err);
 	})
}


//open/close form
showBlock.onclick = function show() {
	display = document.getElementById('window').style.display;
	if (display == 'none') {
		document.getElementById('window').style.display = 'block';
	}
}

showNone.onclick = function hidden() {
	display = document.getElementById('window').style.display;
	if (display == 'block') {
		document.getElementById('window').style.display = 'none';
	}
}