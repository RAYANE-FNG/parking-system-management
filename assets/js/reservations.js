// Declare necessary variables and functions
let currentUser = null
let editingId = null

// Initialize these variables or functions as needed
function checkAuth() {
  // Placeholder for authentication check
  return JSON.parse(localStorage.getItem("currentUser"))
}

function setupLogout() {
  // Placeholder for logout setup
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser")
    window.location.href = "index.html"
  })
}

function setupNavigation() {
  // Placeholder for navigation setup
  currentUser = checkAuth()
  if (currentUser.role !== "admin") {
    document.getElementById("dashboardLink").style.display = "none"
    document.getElementById("placesLink").style.display = "none"
    document.getElementById("usersLink").style.display = "none"
    document.getElementById("paymentsLink").style.display = "none"
  }
}

function getData(key) {
  // Placeholder for getting data
  return JSON.parse(localStorage.getItem(key)) || []
}

function generateId() {
  // Placeholder for generating ID
  return Math.random().toString(36).substr(2, 9)
}

function saveData(key, data) {
  // Placeholder for saving data
  localStorage.setItem(key, JSON.stringify(data))
}

// Check authentication
currentUser = checkAuth()
if (!currentUser) {
  window.location.href = "index.html"
}

// Display user email in the UI
document.getElementById("userEmail").textContent = currentUser.email

setupLogout()
setupNavigation()

const modal = document.getElementById("modal")
const addBtn = document.getElementById("addBtn")
const modalCloseBtns = document.querySelectorAll(".modal-close")
const reservationForm = document.getElementById("reservationForm")
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")

// Load reservations
function loadReservations() {
  let reservations = getData("reservations")
  const places = getData("places")

  if (currentUser.role !== "admin") {
    reservations = reservations.filter((r) => r.email === currentUser.email)
  }

  const search = searchInput.value.toLowerCase()
  const status = statusFilter.value

  reservations = reservations.filter((r) => {
    const matchSearch = r.matricule.toLowerCase().includes(search) || r.email.toLowerCase().includes(search)
    const matchStatus = !status || r.status === status
    return matchSearch && matchStatus
  })

  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  reservations.forEach((reservation) => {
    const place = places.find((p) => p.id === reservation.placeId)
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${reservation.matricule}</td>
      <td>${reservation.email}</td>
      <td>${new Date(reservation.arrivalTime).toLocaleString("fr-FR")}</td>
      <td>${new Date(reservation.departureTime).toLocaleString("fr-FR")}</td>
      <td>${place ? place.number : "N/A"}</td>
      <td><span class="badge badge-${reservation.status}">${reservation.status === "pending" ? "En attente" : "Confirmée"}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editReservation('${reservation.id}')">Modifier</button>
        <button class="btn btn-sm btn-danger" onclick="deleteReservation('${reservation.id}')">Supprimer</button>
      </td>
    `
    tbody.appendChild(tr)
  })
}

// Load places for select
function loadPlacesSelect() {
  const places = getData("places")
  const reservations = getData("reservations")
  const select = document.getElementById("placeId")
  select.innerHTML = '<option value="">Sélectionner une place</option>'

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const occupiedPlaceIds = [...new Set(confirmedReservations.map((r) => r.placeId))]

  places.forEach((place) => {
    const option = document.createElement("option")
    option.value = place.id
    option.textContent = `${place.number} - ${place.type} (${place.floor}) - ${place.pricePerHour}€/h`

    if (occupiedPlaceIds.includes(place.id)) {
      option.disabled = true
      option.textContent += " - Occupée"
    }
    select.appendChild(option)
  })
}

// Open modal for adding
addBtn.addEventListener("click", () => {
  editingId = null
  reservationForm.reset()
  document.getElementById("modalTitle").textContent = "Nouvelle Réservation"

  if (currentUser.role !== "admin") {
    document.getElementById("email").value = currentUser.email
    document.getElementById("email").readOnly = true
  } else {
    document.getElementById("email").readOnly = false
  }

  loadPlacesSelect()
  modal.classList.add("active")
})

// Close modal
modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.remove("active")
  })
})

// Submit form
reservationForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const reservations = getData("reservations")
  const reservation = {
    id: editingId || generateId(),
    matricule: document.getElementById("matricule").value,
    email: document.getElementById("email").value,
    arrivalTime: document.getElementById("arrivalTime").value,
    departureTime: document.getElementById("departureTime").value,
    placeId: document.getElementById("placeId").value,
    status: document.getElementById("status").value,
  }

  if (editingId) {
    const index = reservations.findIndex((r) => r.id === editingId)
    reservations[index] = reservation
  } else {
    reservations.push(reservation)
  }

  saveData("reservations", reservations)
  modal.classList.remove("active")
  loadReservations()
})

// Edit reservation
function editReservation(id) {
  const reservations = getData("reservations")
  const reservation = reservations.find((r) => r.id === id)

  if (reservation) {
    editingId = id
    document.getElementById("modalTitle").textContent = "Modifier Réservation"
    document.getElementById("matricule").value = reservation.matricule
    document.getElementById("email").value = reservation.email
    document.getElementById("arrivalTime").value = reservation.arrivalTime
    document.getElementById("departureTime").value = reservation.departureTime
    document.getElementById("placeId").value = reservation.placeId
    document.getElementById("status").value = reservation.status

    loadPlacesSelect()
    modal.classList.add("active")
  }
}

// Delete reservation
function deleteReservation(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
    let reservations = getData("reservations")
    reservations = reservations.filter((r) => r.id !== id)
    saveData("reservations", reservations)
    loadReservations()
  }
}

// Filters
searchInput.addEventListener("input", loadReservations)
statusFilter.addEventListener("change", loadReservations)

// Initial load
loadReservations()