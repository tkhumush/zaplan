// pull pubKey
let pubKey = await window.nostr.getPublicKey();
let signedSecretEvent = "";
console.log( pubKey );

let profile = document.getElementById("profile")
profile.innerText = pubKey;


// todo app data
var relayData = {
  todo: [],
  completed: []
};

var localData = {
  todo: [],
  completed: []
};
console.log(localData);


//Connect to nostr and pull events
var relay = "wss://relay.damus.io";
var socket = new WebSocket( relay );

socket.addEventListener('message', async function( message ) {
  var [ type, subId, event ] = JSON.parse( message.data );
  var { kind, content } = event || {}
  if (!event || event === true) return;
  console.log('message:', event);
  if (kind === 48636) {
      content = await window.nostr.nip04.decrypt(pubKey, content);
  }
console.log('content:', JSON.parse(content));
localData = JSON.parse(content);
console.log(localData);
renderTodoList();
});

socket.addEventListener('open', async function( e ) {
console.log( "connected to " + relay );

//Subscribe to a relay
var subId   = pubKey;
var filter  = { 
  "authors" : [ pubKey ],
  "kinds"   : [48636],
  "limit"   : 1,
} 
var subscription = [ "REQ", subId, filter ]
console.log('Subscription:', subscription);
socket.send(JSON.stringify( subscription ));
});


// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', function() {
  var value = document.getElementById('item').value;
  if (value) {
    addItem(value);
  }
});

document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value;
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value);
  }
});

function addItem (value) {
  //addItemToDOM(value);
  localData.todo.push(value);
  document.getElementById('item').value = '';

  //send updated to list to relay
  saveTodoList();
}

function renderTodoList() {
  if (!localData.todo.length && !localData.completed.length) return;

  for (var i = 0; i < localData.todo.length; i++) {
    var value = localData.todo[i];
    addItemToDOM(value);
  }

  for (var j = 0; j < localData.completed.length; j++) {
    var value = localData.completed[j];
    addItemToDOM(value, true);
  }
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;

  if (id === 'todo') {
    localData.todo.splice(localData.todo.indexOf(value), 1);
  } else {
    localData.completed.splice(localData.completed.indexOf(value), 1);
  }
  parent.removeChild(item);

  //send updated todo list to relay
  saveTodoList();
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;

  if (id === 'todo') {
    localData.todo.splice(localData.todo.indexOf(value), 1);
    localData.completed.push(value);
  } else {
    localData.completed.splice(localData.completed.indexOf(value), 1);
    localData.todo.push(value);
  }
  // Check if the item should be added to the completed list or to re-added to the todo list
  var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);

  //send updated to do list to relay
  saveTodoList();
}

// Adds a new item to the todo list
function addItemToDOM(text, completed) {
  var list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

  var item = document.createElement('li');
  item.innerText = text;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  var complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
};

//encrypt, sign, and send to relay
async function saveTodoList() {
  
  var encyrptedTodo = await window.nostr.nip04.encrypt(pubKey, JSON.stringify(localData));
  
  var event = {
    "content"	   : encyrptedTodo,
    "created_at" : Math.floor( Date.now() / 1000 ),
    "kind"   	   : 48636,
    "tags"   	   : [ [ 'p', pubKey ] ],
    "pubkey" 	   : pubKey,
  };
  signedSecretEvent = await window.nostr.signEvent(event);
  console.log(signedSecretEvent);
  socket.send(JSON.stringify([ "EVENT", signedSecretEvent]));
};

//Sign an event
async function signAnEvent(event) {
  signedEvent = await window.nostr.signEvent(event);
  console.log(signedEvent);
  return signedEvent;
;}

//Sign a Secret Event
async function signASecretEvent(secretEvent) {
  signedSecretEvent = await window.nostr.signEvent(secretEvent);
  console.log(signedSecretEvent);
  return signedSecretEvent;
};