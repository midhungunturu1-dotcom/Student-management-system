const storageKey = "student-dashboard-students";
const themeKey = "student-dashboard-theme";

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("rollNumber");
const gradeInput = document.getElementById("grade");
const departmentInput = document.getElementById("department");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phoneNumber");
const alertBox = document.getElementById("formAlert");
const updateButton = document.getElementById("updateBtn");
const deleteButton = document.getElementById("deleteBtn");
const themeToggle = document.getElementById("themeToggle");
const tableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const visibleStudents = document.getElementById("visibleStudents");
const statusBadge = document.getElementById("statusBadge");
const tableSummary = document.getElementById("tableSummary");

let students = [];
let editingRollNumber = null;
let theme = localStorage.getItem(themeKey) || "light";

function initializeApp() {
  bindEvents();
  applyTheme(theme);
  loadStudents();
}

function bindEvents() {
  form.addEventListener("submit", handleStudentSubmit);
  updateButton.addEventListener("click", () => {
    if (editingRollNumber === null) {
      showAlert("Select a student to update first.", "error");
      return;
    }
    form.requestSubmit();
  });
  deleteButton.addEventListener("click", handleDeleteSelected);
  document.getElementById("resetBtn").addEventListener("click", () => resetForm(true));
  document.getElementById("searchBtn").addEventListener("click", renderStudents);
  document.getElementById("displayAllBtn").addEventListener("click", () => {
    document.getElementById("searchRoll").value = "";
    document.getElementById("searchName").value = "";
    document.getElementById("gradeFilter").value = "";
    document.getElementById("departmentFilter").value = "";
    renderStudents();
  });
  document.getElementById("saveBtn").addEventListener("click", saveStudentsToBrowser);
  document.getElementById("loadBtn").addEventListener("click", loadStudents);
  document.getElementById("exportBtn").addEventListener("click", exportStudentsToCsv);
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", handleImport);
  document.getElementById("printBtn").addEventListener("click", printStudentList);
  themeToggle.addEventListener("click", toggleTheme);
  document.getElementById("gradeFilter").addEventListener("change", renderStudents);
  document.getElementById("departmentFilter").addEventListener("change", renderStudents);
}

function applyTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  themeToggle.textContent = mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeKey, theme);
  applyTheme(theme);
  showAlert(`Switched to ${theme} mode.`, "success");
}

function loadStudents() {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      students = JSON.parse(stored);
      if (!Array.isArray(students)) {
        students = [];
      }
    } catch (error) {
      students = [];
    }
  } else {
    students = [
      { name: "Ava Patel", rollNumber: 101, grade: "A", department: "Computer Science", email: "ava@example.com", phoneNumber: "9876543210" },
      { name: "Noah Chen", rollNumber: 102, grade: "A+", department: "Information Technology", email: "noah@example.com", phoneNumber: "9123456789" }
    ];
    persistStudents();
  }

  renderStudents();
  updateStats();
  showAlert("Student records loaded successfully.", "success");
}

function persistStudents() {
  localStorage.setItem(storageKey, JSON.stringify(students));
}

function saveStudentsToBrowser() {
  persistStudents();
  showAlert("Records saved to browser storage.", "success");
}

function getFilteredStudents() {
  const searchRoll = document.getElementById("searchRoll").value.trim();
  const searchName = document.getElementById("searchName").value.trim();
  const gradeFilter = document.getElementById("gradeFilter").value;
  const departmentFilter = document.getElementById("departmentFilter").value;

  return students
    .filter((student) => {
      const matchesRoll = searchRoll ? String(student.rollNumber).includes(searchRoll) : true;
      const matchesName = searchName ? student.name.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
      const matchesDepartment = departmentFilter ? student.department === departmentFilter : true;
      return matchesRoll && matchesName && matchesGrade && matchesDepartment;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderStudents() {
  const visible = getFilteredStudents();
  if (!visible.length) {
    tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No students match the current filters.</td></tr>';
    tableSummary.textContent = "Showing 0 records";
    visibleStudents.textContent = "0";
    return;
  }

  tableBody.innerHTML = visible
    .map((student) => `
      <tr>
        <td>${student.name}</td>
        <td>${student.rollNumber}</td>
        <td>${student.grade}</td>
        <td>${student.department}</td>
        <td>${student.email}</td>
        <td>${student.phoneNumber}</td>
        <td>
          <button class="icon-btn edit" data-roll="${student.rollNumber}" type="button">✏️</button>
          <button class="icon-btn delete" data-roll="${student.rollNumber}" type="button">🗑️</button>
        </td>
      </tr>
    `)
    .join("");

  tableSummary.textContent = `Showing ${visible.length} of ${students.length} students`;
  visibleStudents.textContent = visible.length;

  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", () => editStudent(button.dataset.roll));
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", () => deleteStudent(button.dataset.roll));
  });
}

function updateStats() {
  totalStudents.textContent = students.length;
  visibleStudents.textContent = getFilteredStudents().length;
  statusBadge.textContent = students.length ? "Ready" : "Empty";
}

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
}

function populateForm(student) {
  nameInput.value = student.name;
  rollInput.value = student.rollNumber;
  gradeInput.value = student.grade;
  departmentInput.value = student.department;
  emailInput.value = student.email;
  phoneInput.value = student.phoneNumber;
  editingRollNumber = student.rollNumber;
  updateButton.disabled = false;
  deleteButton.disabled = false;
}

function resetForm(shouldNotify = false) {
  form.reset();
  editingRollNumber = null;
  updateButton.disabled = true;
  deleteButton.disabled = true;
  if (shouldNotify) {
    showAlert("Form cleared. You can add a new student.", "success");
  }
}

function validateStudent(student) {
  const errors = [];

  if (!student.name.trim()) {
    errors.push("Student name cannot be empty.");
  }

  if (!/^[0-9]+$/.test(String(student.rollNumber))) {
    errors.push("Roll number must be numeric.");
  }

  if (student.rollNumber <= 0) {
    errors.push("Roll number must be greater than zero.");
  }

  const duplicate = students.find((record) => record.rollNumber === student.rollNumber && record.rollNumber !== editingRollNumber);
  if (duplicate) {
    errors.push("Roll number must be unique.");
  }

  if (!student.grade.trim()) {
    errors.push("Grade is required.");
  }

  if (!student.department.trim()) {
    errors.push("Department is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!/^\d{10}$/.test(student.phoneNumber)) {
    errors.push("Phone number must contain exactly 10 digits.");
  }

  return errors;
}

function handleStudentSubmit(event) {
  event.preventDefault();

  const student = {
    name: nameInput.value.trim(),
    rollNumber: Number(rollInput.value.trim()),
    grade: gradeInput.value.trim(),
    department: departmentInput.value.trim(),
    email: emailInput.value.trim(),
    phoneNumber: phoneInput.value.trim()
  };

  const errors = validateStudent(student);
  if (errors.length) {
    showAlert(errors[0], "error");
    return;
  }

  if (editingRollNumber !== null) {
    const index = students.findIndex((record) => record.rollNumber === editingRollNumber);
    if (index >= 0) {
      students[index] = { ...students[index], ...student };
      showAlert("Student updated successfully.", "success");
    }
  } else {
    students.push(student);
    showAlert("Student added successfully.", "success");
  }

  persistStudents();
  renderStudents();
  updateStats();
  resetForm(false);
}

function editStudent(rollNumber) {
  const selected = students.find((student) => student.rollNumber === Number(rollNumber));
  if (selected) {
    populateForm(selected);
    showAlert(`Editing ${selected.name}.`, "success");
  }
}

function handleDeleteSelected() {
  if (editingRollNumber === null) {
    showAlert("Select a student before deleting.", "error");
    return;
  }
  deleteStudent(editingRollNumber);
}

function deleteStudent(rollNumber) {
  const student = students.find((record) => record.rollNumber === Number(rollNumber));
  if (!student) {
    showAlert("That student does not exist.", "error");
    return;
  }

  const confirmed = confirm(`Delete ${student.name} from the list?`);
  if (!confirmed) {
    return;
  }

  students = students.filter((record) => record.rollNumber !== Number(rollNumber));
  persistStudents();
  renderStudents();
  updateStats();
  resetForm(false);
  showAlert("Student deleted successfully.", "success");
}

function exportStudentsToCsv() {
  if (!students.length) {
    showAlert("There is no data to export.", "error");
    return;
  }

  const header = ["name", "rollNumber", "grade", "department", "email", "phoneNumber"];
  const rows = students.map((student) => [student.name, student.rollNumber, student.grade, student.department, student.email, student.phoneNumber]);
  const csv = [header, ...rows].map((entry) => entry.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "students.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showAlert("Student data exported to CSV.", "success");
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/).filter(Boolean);
    const imported = [];

    lines.slice(1).forEach((line) => {
      const [name, rollNumber, grade, department, email, phoneNumber] = line.split(",");
      if (name && rollNumber) {
        imported.push({ name, rollNumber: Number(rollNumber), grade, department, email, phoneNumber });
      }
    });

    if (!imported.length) {
      showAlert("No valid student rows were found in the file.", "error");
      return;
    }

    students = imported;
    persistStudents();
    renderStudents();
    updateStats();
    resetForm(false);
    showAlert(`${imported.length} students imported successfully.`, "success");
  };

  reader.readAsText(file);
  event.target.value = "";
}

function printStudentList() {
  window.print();
}

initializeApp();
