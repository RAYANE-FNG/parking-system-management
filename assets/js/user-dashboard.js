// ===== AUTH =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) window.location.href = "index.html"

document.getElementById("userEmail").textContent = currentUser.email
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

// ===== HELPERS =====
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

// ===== GLOBALS =====
let selectedPlaceId = null
let currentReservationData = null
let currentFilter = "all"

// ===== LOAD CATEGORY TABS (🔥 IMPORTANT) =====
function loadCategoryTabs() {
  const container = document.getElementById("categoryTabs")
  const categories = getData("categories")

  container.innerHTML = `
    <button type="button" class="filter-tab active" data-filter="all">Toutes</button>
    <button type="button" class="filter-tab" data-filter="available">Disponibles</button>
  `

  categories.forEach(cat => {
    container.innerHTML += `
      <button type="button" class="filter-tab" data-filter="${cat}">
        ${cat}
      </button>
    `
  })

  // Events
  container.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      container.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"))
      tab.classList.add("active")
      currentFilter = tab.dataset.filter
      renderParkingGrid(currentFilter)
    })
  })
}

// ===== RENDER GRID =====
function renderParkingGrid(filter = "all") {
  const places = getData("places")
  const reservations = getData("reservations")
  const grid = document.getElementById("parkingGrid")

  const occupiedIds = reservations
    .filter(r => r.status === "confirmed")
    .map(r => r.placeId)

  let filtered = places

  if (filter === "available") {
    filtered = places.filter(p => !occupiedIds.includes(p.id))
  } else if (filter !== "all") {
    filtered = places.filter(p => p.type === filter)
  }

  grid.innerHTML = filtered.map(place => {
    const isOccupied = occupiedIds.includes(place.id)
    const isSelected = selectedPlaceId === place.id
    const cls = isOccupied ? "place-occupied" : isSelected ? "place-selected" : "place-available"

    return `
      <div class="parking-place ${cls}" data-id="${place.id}" data-available="${!isOccupied}">
        <div class="place-number">${place.number}</div>
        <div class="place-type">${place.type}</div>
        <div class="place-price">${place.pricePerHour}€/h</div>
      </div>
    `
  }).join("")

  document.querySelectorAll(".parking-place").forEach(el => {
    el.addEventListener("click", () => {
      if (el.dataset.available !== "true") return
      selectedPlaceId = el.dataset.id
      renderParkingGrid(filter)
      document.getElementById("confirmReservationBtn").disabled = false
      calculateEstimatedCost()
    })
  })
}

// ===== COST =====
function calculateEstimatedCost() {
  const a = arrivalTime.value
  const d = departureTime.value
  if (!a || !d || !selectedPlaceId) return

  const hours = Math.ceil((new Date(d) - new Date(a)) / 36e5)
  const place = getData("places").find(p => p.id === selectedPlaceId)
  estimatedCost.textContent = (hours * place.pricePerHour).toFixed(2)
}

// ===== EVENTS =====
document.getElementById("newReservationBtn").addEventListener("click", () => {
  selectedPlaceId = null
  reservationForm.reset()
  estimatedCost.textContent = "0.00"
  document.getElementById("confirmReservationBtn").disabled = true
  loadCategoryTabs()
  renderParkingGrid()
  openModal("placeSelectorModal")
})

arrivalTime.addEventListener("change", calculateEstimatedCost)
departureTime.addEventListener("change", calculateEstimatedCost)

// ===== RESERVATION =====
reservationForm.addEventListener("submit", e => {
  e.preventDefault()

  const cost = Number(estimatedCost.textContent)
  currentReservationData = {
    id: generateId(),
    matricule: matricule.value,
    email: currentUser.email,
    arrivalTime: arrivalTime.value,
    departureTime: departureTime.value,
    placeId: selectedPlaceId,
    status: "confirmed"
  }

  const reservations = getData("reservations")
  reservations.push(currentReservationData)
  saveData("reservations", reservations)

  alert("Réservation confirmée ✅")
  closeModal("placeSelectorModal")
  loadReservations()
})

// ===== RESERVATIONS LIST =====
function loadReservations() {
  const list = document.getElementById("reservationsList")
  const reservations = getData("reservations").filter(r => r.email === currentUser.email)
  const places = getData("places")

  if (!reservations.length) {
    list.innerHTML = `<div class="empty-state"><h3>Aucune réservation</h3></div>`
    return
  }

  list.innerHTML = reservations.map(r => {
    const place = places.find(p => p.id === r.placeId)
    return `
      <div class="reservation-card">
        <div class="reservation-header">
          <div class="place-badge">${place.number}</div>
          <span class="badge badge-confirmed">Confirmée</span>
        </div>
        <div class="reservation-details">
          <div class="detail-row"><span>Type:</span><span>${place.type}</span></div>
        </div>
      </div>
    `
  }).join("")
}

// ===== MODALS =====
function openModal(id) {
  document.getElementById(id).classList.add("active")
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active")
}

document.querySelectorAll(".modal-close").forEach(btn =>
  btn.addEventListener("click", () => btn.closest(".modal").classList.remove("active"))
)

// ===== INIT =====
loadReservations()