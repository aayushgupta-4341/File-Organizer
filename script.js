const workspace = document.getElementById("workspace");
const pathText = document.getElementById("path");

let fileCount = 1;
let folderCount = 1;

// folder structure
let currentFolder = null;
const root = { name: "Home", items: [] };

// render UI
function render(folder) {
  workspace.innerHTML = "";
  pathText.innerText = folder.name;

  folder.items.forEach(item => {
    if (item.type === "folder") {
      const div = document.createElement("div");
      div.className = "folder";

      div.innerHTML = `
        <h4 contenteditable="true">${item.name}</h4>
        <button onclick="deleteItem('${item.name}')">❌</button>
      `;

      div.ondblclick = () => {
        currentFolder = item;
        render(item);
      };

      div.ondragover = e => e.preventDefault();

      div.ondrop = e => {
        const draggedName = e.dataTransfer.getData("text");
        moveFile(draggedName, item);
      };

      workspace.appendChild(div);
    }

    if (item.type === "file") {
      const div = document.createElement("div");
      div.className = "file";
      div.draggable = true;

      div.innerHTML = `
        <span contenteditable="true">${item.name}</span>
        <button onclick="deleteItem('${item.name}')">❌</button>
      `;

      div.ondragstart = e => {
        e.dataTransfer.setData("text", item.name);
      };

      workspace.appendChild(div);
    }
  });
}

// create folder
function createFolder() {
  const folder = {
    type: "folder",
    name: "Folder " + folderCount++,
    items: []
  };

  (currentFolder || root).items.push(folder);
  render(currentFolder || root);
}

// create file
function createFile() {
  const file = {
    type: "file",
    name: "File " + fileCount++
  };

  (currentFolder || root).items.push(file);
  render(currentFolder || root);
}

// delete
function deleteItem(name) {
  let folder = currentFolder || root;
  folder.items = folder.items.filter(item => item.name !== name);
  render(folder);
}

// move file
function moveFile(name, targetFolder) {
  let folder = currentFolder || root;

  let file = folder.items.find(item => item.name === name);
  folder.items = folder.items.filter(item => item.name !== name);

  targetFolder.items.push(file);
  render(folder);
}

// go back
function goBack() {
  currentFolder = null;
  render(root);
}

// start
render(root);