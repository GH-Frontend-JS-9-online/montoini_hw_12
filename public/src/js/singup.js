let form = document.getElementById('formWithValidator');
let checkBtn = document.getElementById('check');
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
	checkFields()
})*/


//sendRequest

function CreateUser(email, password, confirmPassword) {
	this.email = email;
	this.password = password;
	this.confirmPassword = confirmPassword;
}

function singUp() {
	let email = form.email.value;
	let password =form.password.value;
	let confirmPassword =form.confirmPassword.value;

	let user = new CreateUser(email, password, confirmPassword);
	return user;
}

function sendLogin() {
	const urlLogin = 'http://localhost:3000/api/users/login';
	const headers = {
		'Content-Type': 'application/json',
	}

	let user = singUp(); 

	return fetch(urlLogin, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers
	}).then(response => {
		return response.json();
	});
}

check.onclick = () => {
	sendLogin().then(data => {
		console.log(data);
	})
	.catch(err => console.log(err))
}