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

// Function to get data from localStorage
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}

// Load KPIs
function loadKPIs() {
  const users = getData("users")
  const reservations = getData("reservations")
  const places = getData("places")
  const payments = getData("payments")

  document.getElementById("totalUsers").textContent = users.length
  document.getElementById("totalReservations").textContent = reservations.length

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const occupiedPlaceIds = confirmedReservations.map((r) => r.placeId)
  const availablePlaces = places.filter((p) => !occupiedPlaceIds.includes(p.id)).length
  document.getElementById("availablePlaces").textContent = availablePlaces

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  document.getElementById("totalRevenue").textContent = totalRevenue.toFixed(2) + "€"
}

// Load reservations chart
let reservationsChart = null
let placesChart = null
let paymentsChart = null

function loadReservationsChart() {
  const reservations = getData("reservations")

  const dateMap = {}
  reservations.forEach((r) => {
    const date = r.arrivalTime.split("T")[0]
    dateMap[date] = (dateMap[date] || 0) + 1
  })

  const dates = Object.keys(dateMap).sort().slice(-7)
  const counts = dates.map((d) => dateMap[d])

  const ctx = document.getElementById("reservationsChart")

  if (reservationsChart) {
    reservationsChart.destroy()
  }

  reservationsChart = new window.Chart(ctx, {
    type: "bar",
    data: {
      labels: dates.map((d) => new Date(d).toLocaleDateString("fr-FR")),
      datasets: [
        {
          label: "Réservations",
          data: counts,
          backgroundColor: "#2563eb",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Load places chart
function loadPlacesChart() {
  const places = getData("places")
  const reservations = getData("reservations")

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const occupiedPlaceIds = [...new Set(confirmedReservations.map((r) => r.placeId))]
  const occupied = occupiedPlaceIds.length
  const available = places.length - occupied

  const ctx = document.getElementById("placesChart")

  if (placesChart) {
    placesChart.destroy()
  }

  placesChart = new window.Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Occupées", "Libres"],
      datasets: [
        {
          data: [occupied, available],
          backgroundColor: ["#ef4444", "#10b981"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

// Load payments chart
function loadPaymentsChart() {
  const payments = getData("payments")

  const dateMap = {}
  payments.forEach((p) => {
    const date = p.date.split("T")[0]
    dateMap[date] = (dateMap[date] || 0) + p.amount
  })

  const dates = Object.keys(dateMap).sort().slice(-7)
  const amounts = dates.map((d) => dateMap[d])

  const ctx = document.getElementById("paymentsChart")

  if (paymentsChart) {
    paymentsChart.destroy()
  }

  paymentsChart = new window.Chart(ctx, {
    type: "line",
    data: {
      labels: dates.map((d) => new Date(d).toLocaleDateString("fr-FR")),
      datasets: [
        {
          label: "Montant (€)",
          data: amounts,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}

document.addEventListener("DOMContentLoaded", () => {
  loadKPIs()
  loadReservationsChart()
  loadPlacesChart()
  loadPaymentsChart()
})
