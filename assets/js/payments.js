// Declare necessary functions and variables
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
const paymentForm = document.getElementById("paymentForm")
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")

let editingId = null

// Load payments
function loadPayments() {
  let payments = getData("payments")
  const reservations = getData("reservations")

  const search = searchInput.value.toLowerCase()
  const status = statusFilter.value

  payments = payments.filter((p) => {
    const reservation = reservations.find((r) => r.id === p.reservationId)
    const matchSearch = reservation
      ? reservation.matricule.toLowerCase().includes(search) || reservation.email.toLowerCase().includes(search)
      : false
    const matchStatus = !status || p.status === status
    return matchSearch && matchStatus
  })

  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  payments.forEach((payment) => {
    const reservation = reservations.find((r) => r.id === payment.reservationId)
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${reservation ? reservation.matricule : "N/A"}</td>
      <td>${payment.amount.toFixed(2)}€</td>
      <td>${payment.method}</td>
      <td><span class="badge badge-${payment.status}">${payment.status === "paid" ? "Payé" : "En attente"}</span></td>
      <td>${new Date(payment.date).toLocaleString("fr-FR")}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editPayment('${payment.id}')">Modifier</button>
        <button class="btn btn-sm btn-danger" onclick="deletePayment('${payment.id}')">Supprimer</button>
      </td>
    `
    tbody.appendChild(tr)
  })
}

// Load reservations for select
function loadReservationsSelect() {
  const reservations = getData("reservations")
  const select = document.getElementById("reservationId")
  select.innerHTML = '<option value="">Sélectionner une réservation</option>'

  reservations.forEach((reservation) => {
    const option = document.createElement("option")
    option.value = reservation.id
    option.textContent = `${reservation.matricule} - ${reservation.email}`
    select.appendChild(option)
  })
}

// Open modal for adding
addBtn.addEventListener("click", () => {
  editingId = null
  paymentForm.reset()
  document.getElementById("modalTitle").textContent = "Nouveau Paiement"
  loadReservationsSelect()
  modal.classList.add("active")
})

// Close modal
modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.remove("active")
  })
})

// Submit form
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const payments = getData("payments")
  const payment = {
    id: editingId || generateId(),
    reservationId: document.getElementById("reservationId").value,
    amount: Number.parseFloat(document.getElementById("amount").value),
    method: document.getElementById("method").value,
    status: document.getElementById("status").value,
    date: document.getElementById("date").value,
  }

  if (editingId) {
    const index = payments.findIndex((p) => p.id === editingId)
    payments[index] = payment
  } else {
    payments.push(payment)
  }

  saveData("payments", payments)
  modal.classList.remove("active")
  loadPayments()
})

// Edit payment
function editPayment(id) {
  const payments = getData("payments")
  const payment = payments.find((p) => p.id === id)

  if (payment) {
    editingId = id
    document.getElementById("modalTitle").textContent = "Modifier Paiement"
    document.getElementById("reservationId").value = payment.reservationId
    document.getElementById("amount").value = payment.amount
    document.getElementById("method").value = payment.method
    document.getElementById("status").value = payment.status
    document.getElementById("date").value = payment.date

    loadReservationsSelect()
    modal.classList.add("active")
  }
}

// Delete payment
function deletePayment(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
    let payments = getData("payments")
    payments = payments.filter((p) => p.id !== id)
    saveData("payments", payments)
    loadPayments()
  }
}

// Filters
searchInput.addEventListener("input", loadPayments)
statusFilter.addEventListener("change", loadPayments)

// Initial load
requireAdmin()
displayUserEmail()
setupLogout()
loadPayments()