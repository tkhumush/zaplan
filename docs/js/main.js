// pull pubKey
let pubKey = "";
try {
  pubKey = await window.nostr.getPublicKey();
} catch (e) {
  console.error("Failed to retrieve pubKey:", e);
}
let signedSecretEvent = "";
let profile = "";
// todo app data
const relayData = {
  todo: [],
  completed: []
};

const localData = {
  todo: [],
  completed: []
};
console.log(localData);


//Connect to nostr and pull events
const relay = "wss://relay.damus.io";
const socket = new WebSocket( relay );

socket.addEventListener('message', async function( message ) {
  const [ type, subId, event ] = JSON.parse( message.data );
  const { kind, content } = event || {}
  if (!event || event === true) return;
    console.log('message:', event);
  if (kind === 0) {
    //profile = JSON.parse(content);
    //console.log(profile)
    //profilePicture = profile.picture;
    //console.log(profilePicture);
    //var img = document.getElementById('pPicture')
    //img.src = profilePicture;
  }
  if (kind === 48636) {
    try {
      let decryptedContent = await window.nostr.nip04.decrypt(pubKey, content);
      localData.todo = [];
      localData.completed = [];
      const parsedContent = JSON.parse(decryptedContent);
      Object.assign(localData, parsedContent);
      clearLists();
      renderTodoList();
    } catch (e) {
      console.error("Failed to decrypt or parse content:", e);
    }
  }
});

socket.addEventListener('open', async function( e ) {
console.log( "connected to " + relay );

//Subscribe to a relay
const subId   = pubKey;
const filter  = {
  "authors" : [ pubKey ],
  "kinds"   : [48636],
  "limit"   : 1,
}
const subscription = [ "REQ", subId, filter ]
console.log('Subscription:', subscription);
socket.send(JSON.stringify( subscription ));
});


// Remove and complete icons in SVG format
const removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
const uncheckedSVG = '<img src="/css/zaplan_logo_unchecked.png" alt="Complete" width="22" height="30" />';
const checkedSVG = '<img src="/css/zaplan_logo.png" alt="Complete" width="22" height="30" />';

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', function() {
  const value = document.getElementById('item').value;
  if (value) {
    addItem(value);
  }
});

document.getElementById('item').addEventListener('keydown', function (e) {
  const value = this.value;
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value);
  }
});

function addItem(value) {
  // Check if the value is not empty
  if (value.trim() !== '') {
    //addItemToDOM(value);
    localData.todo.push(value);
    document.getElementById('item').value = '';

    //send updated to list to relay
    saveTodoList();
  }
}


function renderTodoList() {
  if (!localData.todo.length && !localData.completed.length) return;

  for (let i = 0; i < localData.todo.length; i++) {
    const value = localData.todo[i];
    addItemToDOM(value);
  }

  for (let j = 0; j < localData.completed.length; j++) {
    const value = localData.completed[j];
    addItemToDOM(value, true);
  }
}

function removeItem() {
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const id = parent.id;
  const value = item.innerText;

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
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const id = parent.id;
  const value = item.innerText;

  if (id === 'todo') {
    localData.todo.splice(localData.todo.indexOf(value), 1);
    localData.completed.push(value);
  } else {
    localData.completed.splice(localData.completed.indexOf(value), 1);
    localData.todo.push(value);
  }
  // Check if the item should be added to the completed list or to re-added to the todo list
  const target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);

  //send updated to do list to relay
  saveTodoList();
}

// Adds a new item to the todo list
function addItemToDOM(text, completed) {
  const list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

  const item = document.createElement('li');
  item.innerText = text;

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  const complete = document.createElement('button');
  complete.classList.add('complete');
  if (completed) {
    complete.innerHTML = checkedSVG;
  } else {
    complete.innerHTML = uncheckedSVG;
  };

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);
  list.insertBefore(item, list.childNodes[0]);
};

//encrypt, sign, and send to relay
async function saveTodoList() {
  try {
    const encryptedTodo = await window.nostr.nip04.encrypt(pubKey, JSON.stringify(localData));

    const event = {
      content: encryptedTodo,
      created_at: Math.floor(Date.now() / 1000),
      kind: 48636,
      tags: [['p', pubKey]],
      pubkey: pubKey,
    };

    const signedEvent = await signEvent(event);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(["EVENT", signedEvent]));
    } else {
      console.error("WebSocket is not open");
    }
  } catch (error) {
    console.error("Failed to save to-do list:", error);
  }
};

//Sign an event
async function signEvent(event) {
  const signed = await window.nostr.signEvent(event);
  console.log(signed);
  return signed;
}

function clearLists() {
  const todoList = document.getElementById('todo');

  const completedList = document.getElementById('completed');

  todoList.innerHTML  = '';
  completedList.innerHTML = '';
};
