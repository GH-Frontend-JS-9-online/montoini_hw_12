let form = document.getElementById('myForm');
let checkBtn = document.getElementById('check');
let email = document.getElementById('emailAddress');
let pass1 = document.getElementById('password');
let fields = document.querySelectorAll('.field');
let getIdUser;
let getToken;
let idNewThread;
let arrayUsersGlobal;
let recipientIdUser;

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
	event.preventDefault();
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
		  	let blockMessenger = document.querySelector('.messenger__block');
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
			console.log(`Users array created`);
			console.log(data);
			arrayUsersGlobal = data;
				for(let item of data) {
					let tr = document.createElement('tr');
					tr.dataset.id = item._id;
					tr.innerHTML = `<td>${item.name}</td><td>${item.email}</td>`;
					table.append(tr);
				}
			})						
		}
	});	
}


async function refreshAside() {
	let ul = document.querySelector('.messenger__contacts-block > ul');
	let arrayAllThreads = await retrieveAllThreads();
	console.log('Get an array of cabinet');
	let ulAside = document.querySelector('.aside');

	if(ulAside.children.length == 0) {
		arrayAllThreads.forEach((item) => {
			let li = document.createElement('li');
			li.dataset.idThread = item._id;
			li.className = "messenger__contacts_item";
			li.insertAdjacentHTML('beforeend', `<div class="messenger__contacts_item_user">
													<div class="messenger__contacts_item_inner">
														<div class="messenger__contacts_item_photo">
															<img src="img/avatar-1.png" alt="">
														</div>
														<div class="messenger__contacts_item_name">
															${item.users[1].name}
														</div>
													</div>
													<div class="messenger__contacts_item_date">
														${item.created_at}
													</div>
												</div>`);
			ulAside.append(li);
		});
	} else if (ulAside.children.length != 0) {
		
		arrayAllThreads.forEach((item) => {
			item.remove();
			let li = document.createElement('li');
			li.dataset.idThread = item._id;
			li.className = "messenger__contacts_item";
			li.insertAdjacentHTML('beforeend', `<div class="messenger__contacts_item_user">
													<div class="messenger__contacts_item_inner">
														<div class="messenger__contacts_item_photo">
															<img src="img/avatar-1.png" alt="">
														</div>
														<div class="messenger__contacts_item_name">
															${item.users[1].name}
														</div>
													</div>
													<div class="messenger__contacts_item_date">
														${item.created_at}
													</div>
												</div>`);
			ulAside.append(li);	
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


function retrieveAllThreads() {
	const urlAllThreads = 'https://geekhub-frontend-js-9.herokuapp.com/api/threads?sort=desc';
	const headers = {
		Authorization: getToken,
	}

	return fetch(urlAllThreads, {
		method: 'GET',
		headers: headers,
	}).then(response => response.json());
}


function sendMessage(idThread, message) {
	const urlSendMessage = 'https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages';

	const headers = {
		Authorization: getToken,
		"Content-Type": "application/json",
	}

	let data = {
		"thread": {
			"_id": idThread, // id from threads
		},
		"message": {
			"body": message,
		}
	}

	return fetch(urlSendMessage, {
		method: 'POST',
		body: JSON.stringify(data),
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
  					if(item.last_message == getIdUser) {
  						let sendBlock = document.createElement('div');
  						sendBlock.className = 'messenger__send';
  						sendBlock.innerHTML = `<div class="messenger__send_mess">
  													<div class="messenger__send_avatar">
														<img src="img/avatar-1.png" alt="">
													</div>
  													<div class="messenger__send_text">
  														${item.message.body}
  													</div>
  												</div>
  												<div class="messenger__send_date">
  													${item.created_at}
  												</div>`;
  						messageChat.append(sendBlock);
  					} else {
  						let recipientBlock = document.createElement('div');
  						recipientBlock.className = 'messenger__recipient';
  						recipientBlock.innerHTML = `<div class="messenger__recipient_mess">
  														<div class="messenger__recipient_avatar">
															<img src="img/avatar-1.png" alt="">
														</div>
  														<div class="messenger__recipient_text">
  															${item.message.body}
  														</div>
  													</div>
  													<div class="messenger__recipient_date">
  														${item.created_at}
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


function createThread(userId) {
	const getThread = 'https://geekhub-frontend-js-9.herokuapp.com/api/threads';
	const headers = {
		Authorization: getToken,
		'Content-Type': 'application/json',
	}
	let user = {
		'user': {
			'_id': userId,
		}
	}
	return fetch(getThread, {
		method: 'POST',
		body: JSON.stringify(user),
		headers: headers,
	}).then(response => response.json())
}
sendLetter.onclick = () => {
	createThread().then(data => console.log(data));
}


// is functioning
function getIdForCabinet(event) {
	let nameUser = document.querySelector('.recipient');
	nameUser.innerHTML = event.path[1].children[0].innerText;

	recipientIdUser = event.path[1].dataset.id;
}
tableUsers.addEventListener('click', getIdForCabinet);


// is functioning
async function createChat() {
	idNewThread = await createThread(recipientIdUser)
	.then(data => data._id);
	console.log(idNewThread);
	let chooseUser = document.querySelector('.showupMenu');
	chooseUser.style.display = 'none';

	let arrMessages = await retrieveAllThreadMessage(idNewThread).then(data => data);
	console.log(arrMessages);

	let messageChat = document.querySelector('.messenger__inner');
	if(arrMessages.length == 0) {
		messageChat.innerHTML = '<div class="textInfo">Write anything!</div>';
	}

	await refreshAside();
}
createNewChat.addEventListener('click', createChat);


function retrieveAllThreadMessage(id) {
	const url = `https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages/${id}?sort=desc`;
	const headers = {
		Authorization: getToken,
	}

	return fetch(url, {
		method: 'GET',
		headers: headers,
	}).then(response => response.json());
}


async function getIdThread(event) {
	if(event.target.dataset.idThread) {
		let messageChat = document.querySelector('.messenger__inner');
		messageChat.innerHTML = "";
		console.log('klick');
		let arrMessages = await retrieveAllThreadMessage(event.target.dataset.idThread).then(data => data);
		console.log(arrMessages);
		idNewThread = event.target.dataset.idThread;
		console.log(idNewThread);
		if(arrMessages.length == 0) {
			alert('is ampty');
			messageChat.innerHTML = '<div class="textInfo">Write anything!</div>';
		}

		arrMessages.forEach((item) => {
			if(item.user == getIdUser) {
				let sendBlock = document.createElement('div');
  					sendBlock.className = 'messenger__send';
  					sendBlock.innerHTML = `<div class="messenger__send_mess">
  												<div class="messenger__send_avatar">
													<img src="img/avatar-1.png" alt="">
												</div>
												<div class="messenger__send_text">
													${item.body}
												</div>
											</div>
											<div class="messenger__send_date">
												${item.created_at}
											/div>`;
				messageChat.prepend(sendBlock);
			} else {
				let recipientBlock = document.createElement('div');
  					recipientBlock.className = 'messenger__recipient';
  					recipientBlock.innerHTML = `<div class="messenger__recipient_mess">
  													<div class="messenger__recipient_avatar">
														<img src="img/avatar-1.png" alt="">
													</div>
													<div class="messenger__recipient_text">
														${item.body}
													</div>
												</div>
												<div class="messenger__recipient_date">
													${item.created_at}
												</div>`;
				messageChat.prepend(recipientBlock);
			}
		});		
	}
}
arrayAside.addEventListener('click', getIdThread);


let btnGetUsers = document.querySelector('.btn__coversation');
btnGetUsers.onclick = () => {
	let showupMenu = document.querySelector('.showupMenu');
	showupMenu.style.display = 'flex';
}

closeMenu.onclick = () => {
	let showupMenu = document.querySelector('.showupMenu');
	showupMenu.style.display = 'none';
}
