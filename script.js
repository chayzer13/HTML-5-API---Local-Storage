const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#d0f0ce";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.backgroundColor = "#e8f5e9";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#e8f5e9";
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", () => {
  handleFiles(fileInput.files);
});

function handleFiles(files) {
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        id: Date.now() + Math.random(),  
        name: file.name,
        type: file.type,
        size: file.size,
        content: reader.result
      };
      saveFile(fileData);
      displayFiles();
    };
    reader.readAsDataURL(file);
  });
}

function saveFile(file) {
  const storedFiles = JSON.parse(localStorage.getItem("files")) || [];
  storedFiles.push(file);
  localStorage.setItem("files", JSON.stringify(storedFiles));
}

function deleteFile(id) {
  let storedFiles = JSON.parse(localStorage.getItem("files")) || [];
  storedFiles = storedFiles.filter(file => file.id !== id);
  localStorage.setItem("files", JSON.stringify(storedFiles));
  displayFiles();
}

function downloadFile(id) {
  const storedFiles = JSON.parse(localStorage.getItem("files")) || [];
  const file = storedFiles.find(file => file.id === id);
  
  if (file) {
    const link = document.createElement("a");
    link.href = file.content;
    link.download = file.name;
    link.click();
  }
}

function displayFiles() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";
  const files = JSON.parse(localStorage.getItem("files")) || [];

  files.forEach((file) => {
    const fileItem = document.createElement("div");
    fileItem.classList.add("file-item");

    fileItem.innerHTML = `
      <span>Имя: ${file.name}</span>
      <span>Тип: ${file.type}</span>
      <span>Размер: ${(file.size / 1024).toFixed(2)} KB</span>
      ${file.type.startsWith("image/") ? `<img src="${file.content}" width="50" alt="Image preview">` : ""}
      <button class="download-btn" onclick="downloadFile(${file.id})">Скачать</button>
      <button class="delete-btn" onclick="deleteFile(${file.id})">Удалить</button>
    `;
    fileList.appendChild(fileItem);
  });
}

function filterFiles() {
  const sizeFilter = document.getElementById("sizeFilter").value;
  const typeFilter = document.getElementById("typeFilter").value.toLowerCase();

  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";
  const files = JSON.parse(localStorage.getItem("files")) || [];

  const filteredFiles = files.filter((file) => {
    const sizeMatch = sizeFilter ? file.size / 1024 <= sizeFilter : true;
    const typeMatch = typeFilter ? file.type.toLowerCase().includes(typeFilter) : true;
    return sizeMatch && typeMatch;
  });

  filteredFiles.forEach((file) => {
    const fileItem = document.createElement("div");
    fileItem.classList.add("file-item");

    fileItem.innerHTML = `
      <span>Имя: ${file.name}</span>
      <span>Тип: ${file.type}</span>
      <span>Размер: ${(file.size / 1024).toFixed(2)} KB</span>
      ${file.type.startsWith("image/") ? `<img src="${file.content}" width="50" alt="Image preview">` : ""}
      <button class="download-btn" onclick="downloadFile(${file.id})">Скачать</button>
      <button class="delete-btn" onclick="deleteFile(${file.id})">Удалить</button>
    `;
    fileList.appendChild(fileItem);
  });
}

document.addEventListener("DOMContentLoaded", displayFiles);

const fileTypeFilter = document.getElementById('fileTypeFilter');

fileTypeFilter.addEventListener('change', filterFiles);

function filterFiles() {
  const selectedType = fileTypeFilter.value;

  document.querySelectorAll('.file-item').forEach((fileItem) => {
    const fileType = fileItem.dataset.type; 

    if (selectedType === '' || fileType === selectedType) {
      fileItem.style.display = ''; 
    } else {
    }
  });
}
