const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button"),
  deleteAllBtn = document.querySelector(".delete-all-btn"),
  dateInput = popupBox.querySelector("input[type='date']");

// Array of month names
const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// Retrieve notes from localStorage or initialize an empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Flags and ID for note updates
let isUpdate = false, updateId;

// Open the popup box to add a new note
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Task";
  addBtn.innerText = "Add Task";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

// Close the popup box and reset fields
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = dateInput.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// Display existing notes from localStorage
function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  let completedCount = 0;
  let uncompletedCount = 0;// Count completed and uncompleted notes
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                        <input type="checkbox" id="task-${id}" ${note.completed ? "checked" : ""}>
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                            <span class="priority">Priority: ${note.priority}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}', '${note.priority}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
                    addBox.insertAdjacentHTML("afterend", liTag);
    let checkbox = document.getElementById(`task-${id}`);
    checkbox.addEventListener("change", e => {
      notes[id].completed = e.target.checked;
      localStorage.setItem("notes", JSON.stringify(notes));
      showNotes();

    });
    if (note.completed) {
      completedCount++;
    } else {
      uncompletedCount++;
    }
  });
  document.getElementById("completed-count").innerText = completedCount;
  document.getElementById("uncompleted-count").innerText = uncompletedCount;
}
showNotes();

// Show menu options for each note
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Delete a specific note
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Delete all notes
function deleteAllNotes() {
    let confirmDel = confirm("Are you sure you want to delete all Tasks?");
    if (!confirmDel) return;
  
    notes.length = 0; // Clear the notes array
    localStorage.setItem("notes", JSON.stringify(notes)); // Update localStorage
    showNotes(); // Refresh the displayed notes
  }
  
  // Add event listener for delete all button
  deleteAllBtn.addEventListener("click", deleteAllNotes);

// Update a specific note
function updateNote(noteId, title, filterDesc, priority) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  popupBox.classList.add("show");
  titleTag.value = title;
  descTag.value = description;
  dateInput.value = notes[updateId].date; // Set date in the input
  document.getElementById("Priority").value = priority; // Set priority in dropdown
  popupTitle.innerText = "Update a Task";
  addBtn.innerText = "Update Task";
}
// Function to format the date from yyyy-mm-dd to Month Day, Year
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = months[date.getMonth()]; // Get month name from the months array
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Add or update a note on button click
addBtn.addEventListener("click", e => {
  e.preventDefault();
  
  let title = titleTag.value.trim(),
      description = descTag.value.trim(),
      priority = document.getElementById("Priority").value, // Get selected priority
      date = dateInput.value; // Get selected date
  
  // Check if both fields are empty
  if (!title && !description) {
    alert("Please enter a note title or description.");
    return; // Exit the function early
  }
  if (!priority) {
    alert("Please select a priority.");
    return; // Exit the function early
  }
  if (!date) {
    alert("Please select a date.");
    return; // Exit the function early
  }
  // Format the date to Month Day, Year
  const formattedDate = formatDate(date);


  let noteInfo = { title, description, priority, date ,date: formattedDate};
  
  if (!isUpdate) {
    noteInfo.completed = false; // Set completed status for new notes
    notes.push(noteInfo);
  } else {
    isUpdate = false;
    noteInfo.completed = notes[updateId].completed; // Retain completed status for updated notes
    notes[updateId] = noteInfo;
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
  
  // Close the popup after adding/updating
  closeIcon.click();
});