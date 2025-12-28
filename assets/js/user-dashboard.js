// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Display user email
document.getElementById("userEmail").textContent = currentUser.email

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

// Global variables
let selectedPlaceId = null
let currentReservationData = null

// Declare getData, generateId, and saveData functions
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// Load and display user reservations
function loadReservations() {
  const reservations = getData("reservations").filter((r) => r.email === currentUser.email)
  const places = getData("places")
  const payments = getData("payments")

  const container = document.getElementById("reservationsList")

  if (reservations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Aucune réservation</h3>
        <p>Créez votre première réservation pour commencer</p>
      </div>
    `
    return
  }

  container.innerHTML = reservations
    .map((reservation) => {
      const place = places.find((p) => p.id === reservation.placeId)
      const payment = payments.find((p) => p.reservationId === reservation.id)

      return `
      <div class="reservation-card">
        <div class="reservation-header">
          <div class="place-badge">${place ? place.number : "N/A"}</div>
          <span class="badge badge-${reservation.status}">${reservation.status === "confirmed" ? "Confirmée" : "En attente"}</span>
        </div>
        <div class="reservation-details">
          <div class="detail-row">
            <span class="detail-label">Matricule:</span>
            <span>${reservation.matricule}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Arrivée:</span>
            <span>${new Date(reservation.arrivalTime).toLocaleString("fr-FR")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Sortie:</span>
            <span>${new Date(reservation.departureTime).toLocaleString("fr-FR")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span>${place ? place.type : "N/A"}</span>
          </div>
          ${
            payment
              ? `
          <div class="detail-row">
            <span class="detail-label">Paiement:</span>
            <span class="badge badge-${payment.status}">${payment.status === "paid" ? "Payé" : "En attente"} - ${payment.amount}€</span>
          </div>
          `
              : ""
          }
        </div>
      </div>
    `
    })
    .join("")
}

// Open reservation modal
document.getElementById("newReservationBtn").addEventListener("click", () => {
  selectedPlaceId = null
  document.getElementById("reservationForm").reset()
  document.getElementById("confirmReservationBtn").disabled = true
  document.getElementById("estimatedCost").textContent = "0.00"
  renderParkingGrid()
  openModal("placeSelectorModal")
})

// Render parking grid
function renderParkingGrid(filter = "all") {
  const places = getData("places")
  const reservations = getData("reservations")
  const grid = document.getElementById("parkingGrid")

  const occupiedPlaceIds = reservations.filter((r) => r.status === "confirmed").map((r) => r.placeId)

  let filteredPlaces = places

  if (filter === "available") {
    filteredPlaces = places.filter((p) => !occupiedPlaceIds.includes(p.id))
  } else if (filter !== "all") {
    filteredPlaces = places.filter((p) => p.type === filter)
  }

  grid.innerHTML = filteredPlaces
    .map((place) => {
      const isOccupied = occupiedPlaceIds.includes(place.id)
      const isSelected = selectedPlaceId === place.id
      const statusClass = isOccupied ? "place-occupied" : isSelected ? "place-selected" : "place-available"

      return `
      <div class="parking-place ${statusClass}" data-place-id="${place.id}" data-available="${!isOccupied}">
        <div class="place-number">${place.number}</div>
        <div class="place-type">${place.type === "electric" ? "⚡" : place.type === "handicap" ? "♿" : "🚗"}</div>
        <div class="place-price">${place.pricePerHour}€/h</div>
      </div>
    `
    })
    .join("")

  // Add click handlers
  document.querySelectorAll(".parking-place").forEach((placeEl) => {
    placeEl.addEventListener("click", () => {
      const placeId = placeEl.dataset.placeId
      const isAvailable = placeEl.dataset.available === "true"

      if (!isAvailable) {
        alert("Cette place est déjà occupée")
        return
      }

      selectedPlaceId = placeId
      renderParkingGrid(filter)
      document.getElementById("confirmReservationBtn").disabled = false
      calculateEstimatedCost()
    })
  })
}

// Filter tabs
document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"))
    tab.classList.add("active")
    renderParkingGrid(tab.dataset.filter)
  })
})

function calculateEstimatedCost() {
  const arrivalTime = document.getElementById("arrivalTime").value
  const departureTime = document.getElementById("departureTime").value

  if (!arrivalTime || !departureTime || !selectedPlaceId) {
    document.getElementById("estimatedCost").textContent = "0.00"
    return 0
  }

  const arrival = new Date(arrivalTime)
  const departure = new Date(departureTime)

  if (departure <= arrival) {
    document.getElementById("estimatedCost").textContent = "0.00"
    return 0
  }

  const hours = Math.ceil((departure - arrival) / (1000 * 60 * 60))

  const place = getData("places").find((p) => p.id === selectedPlaceId)
  const cost = hours * place.pricePerHour

  document.getElementById("estimatedCost").textContent = cost.toFixed(2)
  return cost
}

document.getElementById("arrivalTime").addEventListener("change", calculateEstimatedCost)
document.getElementById("departureTime").addEventListener("change", calculateEstimatedCost)

// Handle reservation form submit
document.getElementById("reservationForm").addEventListener("submit", (e) => {
  e.preventDefault()

  if (!selectedPlaceId) {
    alert("Veuillez sélectionner une place")
    return
  }

  const matricule = document.getElementById("matricule").value
  const arrivalTime = document.getElementById("arrivalTime").value
  const departureTime = document.getElementById("departureTime").value

  const arrival = new Date(arrivalTime)
  const departure = new Date(departureTime)

  if (departure <= arrival) {
    alert("L'heure de sortie doit être après l'heure d'arrivée")
    return
  }

  const cost = calculateEstimatedCost()
  const place = getData("places").find((p) => p.id === selectedPlaceId)

  // Store reservation data for payment
  currentReservationData = {
    id: generateId(),
    matricule,
    email: currentUser.email,
    arrivalTime,
    departureTime,
    placeId: selectedPlaceId,
    status: "pending",
  }

  // Show payment modal
  document.getElementById("summaryPlace").textContent = place.number
  document.getElementById("summaryMatricule").textContent = matricule
  document.getElementById("summaryArrival").textContent = new Date(arrivalTime).toLocaleString("fr-FR")
  document.getElementById("summaryDeparture").textContent = new Date(departureTime).toLocaleString("fr-FR")
  document.getElementById("summaryAmount").textContent = cost.toFixed(2) + " €"

  closeModal("placeSelectorModal")
  openModal("paymentModal")
})

// Handle payment method change
document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const cardDetails = document.getElementById("cardDetails")
    if (e.target.value === "card") {
      cardDetails.style.display = "block"
    } else {
      cardDetails.style.display = "none"
    }
  })
})

// Handle payment form submit
document.getElementById("paymentForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value

  if (paymentMethod === "card") {
    const cardNumber = document.getElementById("cardNumber").value
    const cardExpiry = document.getElementById("cardExpiry").value
    const cardCvv = document.getElementById("cardCvv").value

    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert("Veuillez remplir tous les champs de la carte")
      return
    }
  }

  // Save reservation
  const reservations = getData("reservations")
  reservations.push(currentReservationData)
  saveData("reservations", reservations)

  // Save payment
  const cost = Number.parseFloat(document.getElementById("summaryAmount").textContent.replace(" €", ""))
  const payment = {
    id: generateId(),
    reservationId: currentReservationData.id,
    amount: cost,
    method: paymentMethod,
    status: "paid",
    date: new Date().toISOString(),
  }

  const payments = getData("payments")
  payments.push(payment)
  saveData("payments", payments)

  // Update reservation status to confirmed
  currentReservationData.status = "confirmed"
  const updatedReservations = reservations.map((r) => (r.id === currentReservationData.id ? currentReservationData : r))
  saveData("reservations", updatedReservations)

  closeModal("paymentModal")
  alert("Réservation confirmée et paiement effectué avec succès!")
  loadReservations()
})

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
}

// Close modal on close button click
document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal")
    modal.classList.remove("active")
  })
})

document.querySelectorAll(".payment-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal("paymentModal")
  })
})

// Close modal on outside click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })
})

// Initial load
loadReservations()
