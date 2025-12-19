// Declare required variables and functions
function requireAdmin() {
  // Admin check logic here
}

function displayUserEmail() {
  // Display user email logic here
}

function setupLogout() {
  // Logout setup logic here
}

function getData(key) {
  // Data retrieval logic here
  return JSON.parse(localStorage.getItem(key)) || []
}

function generateId() {
  // ID generation logic here
  return Math.random().toString(36).substr(2, 9)
}

function saveData(key, data) {
  // Data saving logic here
  localStorage.setItem(key, JSON.stringify(data))
}

const modal = document.getElementById("modal")
const addBtn = document.getElementById("addBtn")
const modalCloseBtns = document.querySelectorAll(".modal-close")
const placeForm = document.getElementById("placeForm")
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")

const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
} else if (currentUser.role !== "admin") {
  window.location.href = "user-dashboard.html"
}

// Display user email
document.getElementById("userEmail").textContent = currentUser.email

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

let editingId = null

// Load places
function loadPlaces() {
  const places = getData("places")
  const reservations = getData("reservations")

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const occupiedPlaceIds = [...new Set(confirmedReservations.map((r) => r.placeId))]

  // Apply filters
  const search = searchInput.value.toLowerCase()
  const status = statusFilter.value

  const filteredPlaces = places.filter((p) => {
    const matchSearch =
      p.number.toLowerCase().includes(search) ||
      p.type.toLowerCase().includes(search) ||
      p.floor.toLowerCase().includes(search)

    const isOccupied = occupiedPlaceIds.includes(p.id)
    const realStatus = isOccupied ? "occupied" : "available"
    const matchStatus = !status || realStatus === status

    return matchSearch && matchStatus
  })

  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  filteredPlaces.forEach((place) => {
    const isOccupied = occupiedPlaceIds.includes(place.id)
    const realStatus = isOccupied ? "occupied" : "available"

    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${place.number}</td>
      <td>${place.type}</td>
      <td>${place.floor}</td>
      <td>${place.pricePerHour}€</td>
      <td><span class="badge badge-${realStatus}">${realStatus === "available" ? "Disponible" : "Occupée"}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editPlace('${place.id}')">Modifier</button>
        <button class="btn btn-sm btn-danger" onclick="deletePlace('${place.id}')">Supprimer</button>
      </td>
    `
    tbody.appendChild(tr)
  })
}

// Open modal for adding
addBtn.addEventListener("click", () => {
  editingId = null
  placeForm.reset()
  document.getElementById("modalTitle").textContent = "Nouvelle Place"
  modal.classList.add("active")
})

// Close modal
modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.remove("active")
  })
})

// Submit form
placeForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const places = getData("places")
  const place = {
    id: editingId || generateId(),
    number: document.getElementById("number").value,
    type: document.getElementById("type").value,
    floor: document.getElementById("floor").value,
    pricePerHour: Number.parseFloat(document.getElementById("pricePerHour").value),
    status: document.getElementById("status").value,
  }

  if (editingId) {
    const index = places.findIndex((p) => p.id === editingId)
    places[index] = place
  } else {
    places.push(place)
  }

  saveData("places", places)
  modal.classList.remove("active")
  loadPlaces()
})

// Edit place
function editPlace(id) {
  const places = getData("places")
  const place = places.find((p) => p.id === id)

  if (place) {
    editingId = id
    document.getElementById("modalTitle").textContent = "Modifier Place"
    document.getElementById("number").value = place.number
    document.getElementById("type").value = place.type
    document.getElementById("floor").value = place.floor
    document.getElementById("pricePerHour").value = place.pricePerHour
    document.getElementById("status").value = place.status

    modal.classList.add("active")
  }
}

// Delete place
function deletePlace(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette place ?")) {
    let places = getData("places")
    places = places.filter((p) => p.id !== id)
    saveData("places", places)
    loadPlaces()
  }
}

// Filters
searchInput.addEventListener("input", loadPlaces)
statusFilter.addEventListener("change", loadPlaces)

// Initial load
requireAdmin()
displayUserEmail()
setupLogout()
loadPlaces()
