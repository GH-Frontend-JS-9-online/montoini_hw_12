let checkBtn = document.getElementById('check');
let email = document.getElementById('emailAddress');
let pass1 = document.getElementById('password');

//sendRequest
function sendLogin() {
	const urlLogin = 'http://localhost:3000/api/users/login';
	const headers = {
		'Content-Type': 'application/json',
	}

	//let user = singUp(); 
	let user = {
		"email": "alex@geekhub.ck.ua",
		"password": "geekhubck"
	};	

	return fetch(urlLogin, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers
	}).then(response => response.json());
}

function startThread() {
	const urlThreads = 'http://localhost:3000/api/threads';
	const headers = {
		Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTEzMGJmZTliNjEwYTgzNjNiNGIzMTkiLCJpYXQiOjE1NzgzMDY1NTh9.gIycRiVQPWS6K8eWiVW9LRhhbIjjnOR7Pig7GKYDLAM',
		'Content-Type': 'application/json',
	}

	let user = {
		"user": {
			"_id": "5e13095244e24582b460517c"
		}
	};	
	return fetch(urlThreads, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers
	}).then(response => response.json());
}

function getThreads() {
	const urlGet = 'http://localhost:3000/api/threads';	
	const headers = {
		Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTEzMDk1MjQ0ZTI0NTgyYjQ2MDUxN2MiLCJpYXQiOjE1NzgzMDk3MjN9.pTHETno3kAcGiVtMD9RLd7QK4RT_6kIquJuWaHgb65A',
	}

	return fetch(urlGet, {
		method: 'GET',
		headers: headers
	}).then(response => response.json());
}	


function sendMessage() {
	const urlSend = 'http://localhost:3000/api/threads/messages';
	const headers = {
		Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTEzMDk1MjQ0ZTI0NTgyYjQ2MDUxN2MiLCJpYXQiOjE1NzgzMTc4MzB9.lPdma3hIjTLkAFQ_JF1EfJIM3opeBsvEvNYYDDY5Oko',
		'Content-Type': 'application/json',
	}
	let user = {
		"thread": {
			"_id": "5e13343a5badff9ccfb36767"
		},
		"message": {
			"body": "Hello there! Can you say hello to me?"
		}
	};	
	return fetch(urlSend, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers
	}).then(response => response.json());
}


function getThreadMessages(token) {
	const urlGetMessages = 'http://localhost:3000/api/threads/5e13343a5badff9ccfb36767';
	console.log(`get token ${token}`);
	const headers = {
		Authorization: token,
	}

	return fetch(urlGetMessages, {
		method: 'GET',
		headers: headers
	}).then(response => response.json());
}

/*
console.log(`this is token ${tokenGlobal}`)
sendMessage.onclick = async function() {
	await sendMessage(tokenGlobal).then(data => console.log(data));
}*/


