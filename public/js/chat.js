let form = document.getElementById('myForm');
let checkBtn = document.getElementById('check');
let email = document.getElementById('emailAddress');
let pass1 = document.getElementById('password');
let fields = document.querySelectorAll('.field');
let getToken;
let getIdUser;

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

//login User
function CreateUser(email, password) {
	this.email = email;
	this.password = password;
}

function getUser() {
	let email = form.email.value;
	let password =form.password.value;
	
	return new CreateUser(email, password);
}

function loginUser() {
	const urlLogin = 'https://geekhub-frontend-js-9.herokuapp.com/api/users/login';
	const headers = {
		'Content-Type': 'application/json',
	}

	let user = getUser(); 

	return fetch(urlLogin, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers,
	}).then(response => {
 		if(response.ok) {
 			let user = response.json();
 			return {
 				token: response.headers.get('x-auth-token'),
 				user:  user,
 			}
 		}
 		return response.json().then(err => {
 			let e = new Error('Your e-mail or password is incorrect');
 			e.data = err;
 			throw e;
 		})
 	})
}


btnLogin.onclick = async (event) => {
	event.preventDefault()
//get token
	getToken = await loginUser().then(data => {
		let wrapper = document.querySelector('.wrapper');
		let sectionHeader = document.querySelector('.sectionHeader');
		let showBlock = document.querySelector('#showBlock');

		setTimeout(() => {
			wrapper.style.display = 'none';
			sectionHeader.style.display = 'block';
			showBlock.style.display = 'none';
		}, 1000);

		console.log(data);
		alert('You email and password are correct')
		return data.token;
	}).catch(err => {
		console.log(err);
		formError.innerHTML = err;
	})
//get id
	getIdUser = await loginUser()
	.then(data => data.user)
	.then(user => user._id);

	let userData = userData.forEach((item) => {
		if(getIdUser == item._id) {
		  	let blockUserData = document.querySelector('.messenger');
		  		blockUserData.innerHTML = 
		  		`<div class="messenger__photo">
					<img src="img/avatar.png" alt="avatar">
				</div>
				<div class="messenger__name">
					${item.name}
				</div>
				<div class="messenger__position">
					${item.position}
				</div>
				<div class="messenger__info">
					${item.description}
				</div>
				<div class="messenger_interlocutor-info_email"><span>Email</span>
					${item.email}
				</div>
				<div class="messenger__phone"><span>Phone</span>
					${item.phone}
				</div>
				<div class="messenger__adress"><span>Adress</span>
					${item.address}
				</div>
				<div class="messenger__organization"><span>Organization</span>
					${item.organization}
				</div>`;
		}
	});
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