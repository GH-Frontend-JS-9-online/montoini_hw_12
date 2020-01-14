let form = document.getElementById('formWithValidator');
let checkBtn = document.getElementById('check');
let name = document.getElementById('nameUser');
let email = document.getElementById('emailAddress');
let pass1 = document.getElementById('password');
let pass2 = document.getElementById('confirmPassword');
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
}

form.addEventListener('submit', function(event) {
	event.preventDefault()
	removeValidation()
})
*/


//sendRequest
function loginUser(email, password, name) {
	this.name = name;
	this.email = email;
	this.password = password;
}

function getUser() {
	let name = form.name.value;
	let email = form.email.value;
	let password =form.password.value;
	
	let user = new CreateUser(name, email, password);
	return user;
}

function sendRequest() {
	const urlRequest = 'http://localhost:3000/api/users';
	const headers = {
		'Content-Type': 'application/json',
	}

	let user = getUser(); 

	return fetch(urlRequest, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers
	}).then(response => {
		return response.json();
	});
}

check.onclick = () => {
	sendRequest().then(data => {
		console.log(data);
	})
	.catch(err => console.log(err))
}


function show(window) {
	let display = document.getElementById('window').style.display;
	if (display == 'none') {
		document.getElementById('window').style.display = 'block';
	} else {
		document.getElementById('window').style.display = 'none';
	}
}