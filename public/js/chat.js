let form = document.getElementById('myForm');
let checkBtn = document.getElementById('check');
let email = document.getElementById('emailAddress');
let pass1 = document.getElementById('password');
let fields = document.querySelectorAll('.field');
let getToken;
let getIdUser;
let recipientIdUser;
let idNewThread;
let arrayUsersGlobal;

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

//Open/close form
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


//Login User
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
 		if (response.ok) {
            let user = response.json();
 			return {
 				token: response.headers.get('x-auth-token'),
 				user: user,
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
	//Get token
	getToken = await loginUser().then(data => {
		let wrapper = document.querySelector('.wrapper');
		let sectionHeader = document.querySelector('.sectionHeader');

		setTimeout(() => {
			wrapper.style.display = 'none';
			sectionHeader.style.display = 'block';
		}, 1000);

		console.log(data);
		alert('You email and password are correct');
		return data.token;
	}).catch(err => {
		console.log(err);
		formError.innerHTML = err;
	})
	//Get id
	getIdUser = await loginUser()
	.then(data => data.user)
	.then(user => user._id);

	let arrayUsers = await getAllUsers();

	arrayUsers.forEach((item) => {
		if (getIdUser == item._id) {
		  	let blockMessenger = document.querySelector('.messenger');
		  	blockMessenger.innerHTML = `<div class="messenger__photo">
								<img src="img/avatar-1.png" alt="">
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
							<div class="messenger__email"><span>Email</span>
								${item.email}
							</div>
							<div class="messenger__phone"><span>Phone</span>
								${item.phone}
							</div>
							<div class="messenger__adress"><span>Adress</span>
								${item.address}
							</div>
							<div class="messenger__organization">
								<span>Organization</span>
								${item.organization}
							</div>`;	
			getAllUsers().then(data => {
			let table = document.querySelector('.showupMenu__table');
			arrayUsersGlobal = data;
			console.log(`Users array created`);
			console.log(data);

				for(let item of data) {
					let tr = document.createElement('tr');
					tr.dataset.id = item._id;
					tr.innerHTML = `<td>${item.name}</td><td>${item.email}</td>`;
					table.append(tr);
				}
			})						
		}
	});
	await refreshAside();	
}

async function refreshAside() {
	let ul = document.querySelector('.messenger__contacts > ul');
	let arrayAllThreads = await retrieveAllThreads();
	console.log('Get an array of cabinet');
	console.log(arrayAllThreads);
	let ulAside = document.querySelector('.aside');

	if(ulAside.children.length == 0) {
		arrayAllThreads.forEach((item) => {
			let name;
			item.users.forEach(item => {
				if(item.me == false) name = item.name;
			});

			if(item.length != 0) {
				if(item.last_message == "No messages yet") {
					let li = document.createElement('li');
					li.thread = item._id;
					li.dataset.idThread = item._id;
					li.className = "messenger__contacts_item";
					li.insertAdjacentHTML('beforeend', `<div class="messenger__contacts_item_user">
															<div class="messenger__contacts_item_inner">
																<div class="messenger__contacts_item_photo">
																	<img src="img/avatar.png" alt="">
																</div>
																<div class="messenger__contacts_item_name">
																	${name}
																</div>
															</div>
															<div class="messenger__contacts_item_date">
																Today. 5:32 PM
															</div>
														</div>
														<div class="messenger__contacts_item_last-letter">
															No messages yet.
														</div>`);
					console.dir(li);
					ulAside.append(li);
				} else {
					let li = document.createElement('li');
					li.thread = item._id;
					li.dataset.idThread = item._id;
					li.className = "messenger__contacts_item";
					li.insertAdjacentHTML('beforeend', `<div class="messenger__contacts_item_user">
															<div class="messenger__contacts_item_inner">
																<div class="messenger__contacts_item_photo">
																	<img src="img/avatar.png" alt="">
																</div>
																<div class="messenger__contacts_item_name">
																	${name}
																</div>
															</div>
															<div class="messenger__contacts_item_date">
																Today. 5:32 PM
															</div>
														</div>
														<div class="messenger__contacts_item_last-letter">
															${item.last_message.body}
														</div>`);
					console.dir(li);
					ulAside.append(li);
				}
			}
		});
	} else if (ulAside.children.length != 0) {
		arrayAllThreads.forEach((item) => {
			let name;
			item.users.forEach(item => {
				if(item.me == false) name = item.name;
			});
			let result = true;
				for(let i of ulAside.children) {
					if (i.dataset.idThread == item._id) {
						result = false;
						break;
					}
				}
			if (result) {
				if (item.last_message == "No messages yet") {
					let li = document.createElement('li');
					li.thread = item._id;
					li.dataset.idThread = item._id;
					li.className = "messenger__contacts_item";
					li.insertAdjacentHTML('beforeend', `<div class="messenger__contacts_item_user">
															<div class="messenger__contacts_item_inner">
																<div class="messenger__contacts_item_photo">
																	<img src="img/avatar.png" alt="">
																</div>
																<div class="messenger__ontacts_item_name">
																	${name}
																</div>
															</div>
															<div class="messenger__contacts_item_date">
																Today. 5:32 PM
															</div>
														</div>
														<div class="messenger__contacts_item_last-letter">
															No messages yet.
														</div>`);
					console.dir(li);
					ulAside.append(li);
				} else {
					let li = document.createElement('li');
					li.thread = item._id;
					li.dataset.idThread = item._id;
					li.className = "messenger__contacts_item";
					li.insertAdjacentHTML('beforeend', `<div class="messenger__contacts_item_user">
															<div class="messenger__contacts_item_inner">
																<div class="messenger__contacts_item_photo">
																	<img src="img/avatar.png" alt="">
																</div>
																<div class="messenger__contacts_item_name">
																	${name}
																</div>
															</div>
															<div class="messenger__contacts_item_date">
																Today. 5:32 PM
															</div>
														</div>
														<div class="messenger__contacts_item_last-letter">
															${item.last_message.body}
														</div>`);
					console.dir(li);
					ulAside.append(li);
				}
			}		
		});
	}
}


function getAllUsers() {
	const urlAllUsers = 'https://geekhub-frontend-js-9.herokuapp.com/api/users/all';
	const headers = {
		Authorization: getToken,
	}

	return fetch(urlAllUsers, {
		method: 'GET',
		headers: headers,
	}).then(response => response.json())
}


function sendMessage(idThread, message) {
	const urlSendMessage = 'https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages';

	const headers = {
		Authorization: getToken,
		'Content-Type': 'application/json',
	}

	let user = {
		'thread': {
			'_id': idThread, // id from threads
		},
		'message': {
			'body': message,
		}
	}

	return fetch(urlSendMessage, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers,
	}).then(response => response.json());
}


async function getMessage(event) {
	let textArea = document.querySelector('.messenger__textarea');
	let messageChat = document.querySelector('.messenger__inner');
	
	if(event.key == "Enter") {

		if (!idNewThread) {
			alert('Select user!');
			let chooseUser = document.querySelector('.showupMenu');
			chooseUser.style.display = 'flex';

		} else {
			await sendMessage(idNewThread, textArea.innerText);
			let arrAllThreads = await retrieveAllThreads().then(data => data);
			arrAllThreads.forEach((item) => {
  					
  				if(item._id == idNewThread) {
  						
  					if(item.last_message.user == getIdUser) {
  						let sendBlock = document.createElement('div');
  						sendBlock.className = 'messenger__send';
  						sendBlock.innerHTML = `<div class="messenger__send_mess">
  													<div class="messenger__send_text">
  														${item.last_message.body}
  													</div>
  												</div>
  												<div class="messenger__send_date">
  													${item.last_message.created_at}
  												</div>`;
  						messageChat.append(sendBlock);
  					} else {
  						let recipientBlock = document.createElement('div');
  						recipientBlock.className = 'messenger__recipient';
  						recipientBlock.innerHTML = `<div class="messenger__recipient_mess">
  														<div class="messenger__recipient_text">
  															${item.last_message.body}
  														</div>
  													</div>
  													<div class="messenger__recipient_date">
  														${item.last_message.created_at}
  													</div>`;
  						messageChat.append(recipientBlock);
  					}
  				}
			});
		}	
		textArea.innerText = "";
	}
}
document.addEventListener('keydown', getMessage);

function retrieveAllThreads() {
	const urlAllThreads = 'https://geekhub-frontend-js-9.herokuapp.com/api/threads?sort=desc';
	const headers = {
		Authorization: getToken,
	}

	return fetch(urlAllThreads, {
		method: 'GET',
		headers: headers,
	}).then(response => response.json())
}

function retrieveAllThreadMessage() {
	const url = `https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages/${id}?sort=desc`;
	const headers = {
		Authorization: getToken,
	}

	return fetch(url, {
		method: 'GET',
		headers: headers,
	}).then(response => response.json())
}

function createThread(userId) {
	const urlThread = 'https://geekhub-frontend-js-9.herokuapp.com/api/threads';
	const headers = {
		Authorization: getToken,
		'Content-Type': 'application/json',
	}
	let user = {
		'user': {
			'_id': userId,
		}
	}
	return fetch(urlThread, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers,
	}).then(response => response.json())
}

sendLetter.onclick = () => {
	createThread().then(data => console.log(data));
}


function getIdForCabinet(event) {
	let nameUser = document.querySelector('.recipient');
	nameUser.innerHTML = event.path[1].children[0].innerText;

	recipientIdUser = event.path[1].dataset.id;
}
tableUsers.addEventListener('click', getIdForCabinet);


async function createChat() {
	idNewThread = await createThread(recipientIdUser)
	.then(data => data._id);
	console.log(idNewThread);
	let chooseUser = document.querySelector('.showupMenu');
	chooseUser.style.display = 'none';

	let arrMessages = await retrieveAllThreadMessage(idNewThread).then(data => data.messages);
	console.log(arrMessages);

	let messageChat = document.querySelector('.messenger__inner');
	if(arrMessages.length == 0) {
		messageChat.innerHTML = '<div class="textInfo">Write anything!</div>';
	}
}
createNewChat.addEventListener('click', createChat);


let btnGetUsers = document.querySelector('.btn__coversation');
btnGetUsers.onclick = () => {
	let showupMenu = document.querySelector('.showupMenu');
	showupMenu.style.display = 'flex';
}

closeMenu.onclick = () => {
	let showupMenu = document.querySelector('.showupMenu');
	showupMenu.style.display = 'none';
}
