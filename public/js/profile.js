let username = document.getElementById("username");
let email = document.getElementById("email");
let todos = document.getElementsByClassName("todos")[0];
let todoTitle = document.getElementById("todoTitle");
let todoDesc = document.getElementById("todoDesc");
// let  todoTag = document.getElementById('todoTag');
let todosts = document.getElementById("todorb");
let inprogresssts = document.getElementById("inprogressrb");
let titlewarning = document.getElementById("titlewarning");
let descwarning = document.getElementById("descwarning");
let addTodoModal = new bootstrap.Modal(
  document.getElementById("exampleModal"),
  {
    keyboard: false,
  }
);

function getToken() {
  var token = "token" + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(token) == 0) {
      return c.substring(token.length, c.length);
    }
  }
  return "";
}

function createCard(todo) {
  let card = document.createElement("div");
  card.className = "card shadow cursor-pointer  m-4 bg-transparent rounded-3";

  let cardBody = document.createElement("div");
  cardBody.className = "card-body todo rounded-3";

  let title = document.createElement("div");
  title.innerText = todo.title;
  title.className = "card-title todoTitle fs-4";

  let desc = document.createElement("div");
  desc.innerText = todo.body;
  desc.className = "card-color";

  let date = document.createElement("div");
  const d = new Date(todo.updatedAt);
  date.innerText = d.toDateString();
  date.className = "card-color date fs-6";

  let status = document.createElement("div");
  let stsClass;
  if (todo.status == "todo") {
    stsClass = "todosts";
    status.innerText = "To-Do";
  } else if (todo.status == "inprogress") {
    stsClass = "inprogress";
    status.innerText = "In-progress";
  } else if (todo.status == "done") {
    stsClass = "done";
    status.innerText = "Done";
  }
  status.className = "card-color " + stsClass;

  
  let edit = document.createElement("div");
  edit.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
  edit.className = 'm-2 fs-5';

  let del = document.createElement("div");
  del.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  del.className = 'm-2 fs-5';

  let mbtns = document.createElement('div');
  mbtns.className = 'mbtns';
  mbtns.appendChild(edit);
  mbtns.appendChild(del);

  let footer = document.createElement("div");
  footer.className = "todo-footer";
  footer.appendChild(status);
  footer.appendChild(mbtns);

  cardBody.appendChild(title);
  cardBody.appendChild(desc);
  cardBody.appendChild(date);
  cardBody.appendChild(footer);
  card.appendChild(cardBody);
  todos.prepend(card);
}

async function getTodos() {
  const response = await fetch("http://localhost:3000/api/user/profile", {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  console.log(result["todos"]);
  result["todos"].forEach((todo) => {
    createCard(todo);
  });
}

async function addTodo() {
  var status;
  if (
    todoTitle.value === "" ||
    todoTitle.value.length > 20 ||
    todoTitle.value.length < 10
  ) {
    titlewarning.style.display = "block";
    return false;
  } else {
    titlewarning.style.display = "none";
  }
  if (
    todoDesc.value === "" ||
    todoDesc.value.length > 500 ||
    todoTitle.value.length < 10
  ) {
    descwarning.style.display = "block";
    return false;
  } else {
    descwarning.style.display = "none";
  }
  if (inprogresssts.checked) status = inprogresssts.value;
  else if (todosts.checked) status = todosts.value;
  const response = await fetch("http://localhost:3000/api/todo", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
    body: JSON.stringify({
      title: todoTitle.value,
      body: todoDesc.value,
      status: status,
    }),
  });
  const result = await response.json();
  console.log(result);
  addTodoModal.hide();
  todoTitle.value = todoDesc.value = "";
  createCard(result);
}

async function deleteTodo() {}

async function editTodo() {}

async function getProfile() {
  const response = await fetch("http://localhost:3000/api/user/profile", {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json", Authorization: getToken() },
  });
  const result = await response.json();
  username.innerText = result["user"]["username"];
  email.innerText = result["user"]["email"];
  console.log(result);
  getTodos();
}

async function editProfile() {}

async function logout() {
  window.location = "./login.html";
}