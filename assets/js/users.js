// Declare required variables and functions
function requireAdmin() {
  // Implementation for requireAdmin
}

function displayUserEmail() {
  // Implementation for displayUserEmail
}

function setupLogout() {
  // Implementation for setupLogout
}

function getData(key) {
  // Implementation for getData
  return JSON.parse(localStorage.getItem(key)) || []
}

function generateId() {
  // Implementation for generateId
  return Math.random().toString(36).substr(2, 9)
}

function saveData(key, data) {
  // Implementation for saveData
  localStorage.setItem(key, JSON.stringify(data))
}

const modal = document.getElementById("modal")
const addBtn = document.getElementById("addBtn")
const modalCloseBtns = document.querySelectorAll(".modal-close")
const userForm = document.getElementById("userForm")
const searchInput = document.getElementById("searchInput")
const roleFilter = document.getElementById("roleFilter")

let editingId = null

// Load users
function loadUsers() {
  let users = getData("users")

  // Apply filters
  const search = searchInput.value.toLowerCase()
  const role = roleFilter.value

  users = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
    const matchRole = !role || u.role === role
    return matchSearch && matchRole
  })

  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  users.forEach((user) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><span class="badge ${user.role === "admin" ? "badge-confirmed" : "badge-pending"}">${user.role}</span></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editUser('${user.id}')">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Supprimer</button>
            </td>
        `
    tbody.appendChild(tr)
  })
}

// Open modal for adding
addBtn.addEventListener("click", () => {
  editingId = null
  userForm.reset()
  document.getElementById("modalTitle").textContent = "Nouvel Utilisateur"
  document.getElementById("password").required = true
  modal.classList.add("active")
})

// Close modal
modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.remove("active")
  })
})

// Submit form
userForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const users = getData("users")
  const user = {
    id: editingId || generateId(),
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    role: document.getElementById("role").value,
  }

  const password = document.getElementById("password").value
  if (password) {
    user.password = password
  } else if (editingId) {
    const existingUser = users.find((u) => u.id === editingId)
    user.password = existingUser.password
  }

  if (editingId) {
    const index = users.findIndex((u) => u.id === editingId)
    users[index] = user
  } else {
    users.push(user)
  }

  saveData("users", users)
  modal.classList.remove("active")
  loadUsers()
})

// Edit user
function editUser(id) {
  const users = getData("users")
  const user = users.find((u) => u.id === id)

  if (user) {
    editingId = id
    document.getElementById("modalTitle").textContent = "Modifier Utilisateur"
    document.getElementById("name").value = user.name
    document.getElementById("email").value = user.email
    document.getElementById("phone").value = user.phone
    document.getElementById("role").value = user.role
    document.getElementById("password").required = false
    document.getElementById("password").value = ""

    modal.classList.add("active")
  }
}

// Delete user
function deleteUser(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    let users = getData("users")
    users = users.filter((u) => u.id !== id)
    saveData("users", users)
    loadUsers()
  }
}

// Filters
searchInput.addEventListener("input", loadUsers)
roleFilter.addEventListener("change", loadUsers)

// Initial load
requireAdmin()
displayUserEmail()
setupLogout()

loadUsers()
