let mainFrame = document.getElementById("main-frame");
mainFrame.classList =
  "flex flex-col items-centeritems-center m-5 w-120 p-5 gap-5 text-2xl";
let input = document.getElementById("task");
let textarea = document.getElementById("task-desc");
textarea.classList =
  "w-100 h-50 italic border-3 border-teal-800 focus:border-teal-400 rounded-2xl shadow-lg outline p-4 outline-teal/5";
input.classList =
  "w-90 h-13 italic border-3 border-teal-800 focus:border-teal-400 rounded-2xl shadow-lg outline p-4 outline-teal/5";

let list = document.getElementById("list");
let btn = document.getElementById("btn");
btn.classList =
  "bg-teal-500 hover:bg-teal-900 hover:text-white hover:shadow-xl rounded-lg w-25 h-13 items-center shadow-lg outline outline-black/10 ";
let tracker = 1;
let data = JSON.parse(localStorage.getItem("myTask")) || [];
let distinct = data.length > 0 ? data[data.length - 1].id + 1 : 1;
let inputId = 10;

function onload() {
  data.forEach((item) => {
    renderTask(item.task, item.desc, item.id, item.time || "");
  });
}

function handleAddTask() {
  let val = input.value.trim();
  let detail = textarea.value.trim();

  if (val !== "" && detail !== "") {
    const now = new Date();
    const timestamp =
      now.toLocaleDateString() +
      " " +
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let newTask = { task: val, desc: detail, id: distinct, time: timestamp };
    data.push(newTask);
    localStorage.setItem("myTask", JSON.stringify(data));

    renderTask(newTask.task, newTask.desc, newTask.id, newTask.time);
    distinct++;
    input.value = "";
    textarea.value = "";
    input.focus();
  } else {
    Swal.fire({
      title: "Warning!",
      text: "You left Fields Empty!",
      icon: "warning",
      iconColor: "teal",
      confirmButtonColor: "teal",
    });
  }
}

textarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    handleAddTask();
  }
});
btn.addEventListener("click", handleAddTask);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    textarea.focus();
  }
});

function renderTask(task, desc, id, time) {
  let li = document.createElement("li");
  li.classList =
    "flex flex-row gap-4 justify-around border-b-2 h-auto break-words relative top-1 break-words text-xl w-170 items-center rounded-xl bg-gray-100  p-3 shadow-lg outline outline-black/5 ";
  let title = document.createElement("div");
  let functionbtns = document.createElement("span");
  functionbtns.classList = "flex gap-3 relative bottom-15";

  let donebtn = document.createElement("button");
  donebtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#104c48" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-check-big-icon lucide-square-check-big"><path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"/><path d="m9 11 3 3L22 4"/></svg>`;
  donebtn.classList =
    "bg-teal-400 rounded-lg h-15 items-center shadow-lg outline outline-black/10";

  let delBtn = document.createElement("button");
  delBtn.classList =
    "bg-teal-600 rounded-lg h-15 items-center shadow-lg outline outline-black/10";

  title.classList = "pl-4 text-2xl w-120 flex flex-col ";

  title.innerHTML = `
    <h3>Task</h3>
    <a id="tasks" class="same border-1 m-2 boredr-gray-300 rounded-xl p-3"> ${task}</a>
    <h3>Description</h3>
    <a id="descs" class="same m-2 h-auto break-words border-1 boredr-gray-300 rounded-xl p-3"> ${desc}</a>
    ${time ? `<span class="text-sm text-gray-500 mt-1 italic pl-2">${time}</span>` : ""}
  `;

  delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#104c48" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shredder-icon lucide-shredder"><path d="M4 13V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 22v-5"/><path d="M14 19v-2"/><path d="M18 20v-3"/><path d="M2 13h20"/><path d="M6 20v-3"/></svg>`;
  title.id = "title";

  functionbtns.append(donebtn, delBtn);
  li.append(title, functionbtns);
  list.appendChild(li);

  //-------------Done Function------------
  donebtn.addEventListener("click", () => {
    li.classList.toggle("bg-gray-400");
  });

  //------------Delete Function-------------
  delBtn.addEventListener("click", () => {
    data = data.filter((item) => item.id !== id);
    localStorage.setItem("myTask", JSON.stringify(data));
    list.removeChild(li);
  });

  //------------------Edit Function------------------
  let same = title.getElementsByClassName("same");
  Object.values(same).forEach((value) => {
    value.addEventListener("click", (e) => {
      editTask(e.target);
    });
  });

  function editTask(targetValue) {
    let editbox = document.getElementById("edits");
    const editInput = document.createElement("textarea");
    editInput.classList =
      "w-100 h-50 italic border-3 border-teal-800 focus:border-teal-400 rounded-2xl shadow-lg outline p-4 outline-teal/5";

    editInput.setAttribute("id", inputId++);
    editInput.value = targetValue.innerText;
    editbox.appendChild(editInput);
    textarea.style.display = "none";
    editInput.focus();

    editInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        let newVal = editInput.value.trim();
        if (newVal !== "") {
          targetValue.innerText = newVal;
          let item = data.find((obj) => {
            return obj.id === id;
          });
          if (targetValue.id === "tasks") {
            item.task = newVal;
          } else {
            item.desc = newVal;
          }
          localStorage.setItem("myTask", JSON.stringify(data));
        }
        if (editbox.contains(editInput)) {
          editbox.removeChild(editInput);
          textarea.style.display = "flex";
        }
      }
    });

    editInput.addEventListener("blur", () => {
      if (editbox.contains(editInput)) editbox.removeChild(editInput);
      textarea.style.display = "flex";
    });
  }
}

onload();
