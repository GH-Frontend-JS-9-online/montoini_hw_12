let form = document.getElementById('formWithValidator');
let checkBtn = document.getElementById('check');
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

//sendRequest
function loginUser(email, password) {
	this.email = email;
	this.password = password;
}

function getUser() {
	let email = form.email.value;
	let password =form.password.value;
	
	let user = new CreateUser(email, password);
	return user;
}

function sendRequest() {
	const urlRequest = 'http://localhost:3000/api/users/login';
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


//open/close form
btnLogin.onclick = function show() {
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