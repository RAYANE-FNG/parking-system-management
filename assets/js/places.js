// ====== SECURITY ======
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
} else if (currentUser.role !== "admin") {
  window.location.href = "user-dashboard.html"
}

// ====== USER INFO ======
document.getElementById("userEmail").textContent = currentUser.email
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

// ====== HELPERS ======
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

// ====== DOM ======
const modal = document.getElementById("modal")
const addBtn = document.getElementById("addBtn")
const modalCloseBtns = document.querySelectorAll(".modal-close")
const placeForm = document.getElementById("placeForm")
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")
const typeSelect = document.getElementById("type")

let editingId = null

// ====== LOAD CATEGORIES ======
function loadCategories(selectedValue = "") {
  const categories = getData("categories")
  typeSelect.innerHTML = `<option value="">-- Choisir une catégorie --</option>`

  categories.forEach(cat => {
    const option = document.createElement("option")
    option.value = cat
    option.textContent = cat
    if (cat === selectedValue) option.selected = true
    typeSelect.appendChild(option)
  })
}

// ====== LOAD PLACES ======
function loadPlaces() {
  const places = getData("places")
  const reservations = getData("reservations")

  const occupiedIds = reservations
    .filter(r => r.status === "confirmed")
    .map(r => r.placeId)

  const search = searchInput.value.toLowerCase()
  const status = statusFilter.value

  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  places
    .filter(p => {
      const matchSearch =
        p.number.toLowerCase().includes(search) ||
        p.type.toLowerCase().includes(search) ||
        p.floor.toLowerCase().includes(search)

      const realStatus = occupiedIds.includes(p.id) ? "occupied" : "available"
      return matchSearch && (!status || realStatus === status)
    })
    .forEach(place => {
      const realStatus = occupiedIds.includes(place.id) ? "occupied" : "available"

      tbody.innerHTML += `
        <tr>
          <td>${place.number}</td>
          <td>${place.type}</td>
          <td>${place.floor}</td>
          <td>${place.pricePerHour} €</td>
          <td>
            <span class="badge badge-${realStatus}">
              ${realStatus === "available" ? "Disponible" : "Occupée"}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-edit" onclick="editPlace('${place.id}')">Modifier</button>
            <button class="btn btn-sm btn-delete" onclick="deletePlace('${place.id}')">Supprimer</button>
          </td>
        </tr>
      `
    })
}

// ====== ADD PLACE ======
addBtn.addEventListener("click", () => {
  editingId = null
  placeForm.reset()
  loadCategories()
  document.getElementById("modalTitle").textContent = "Nouvelle Place"
  modal.classList.add("active")
})

// ====== EDIT PLACE ======
function editPlace(id) {
  const places = getData("places")
  const place = places.find(p => p.id === id)
  if (!place) return

  editingId = id
  document.getElementById("modalTitle").textContent = "Modifier Place"
  document.getElementById("number").value = place.number
  document.getElementById("floor").value = place.floor
  document.getElementById("pricePerHour").value = place.pricePerHour
  document.getElementById("status").value = place.status
  loadCategories(place.type)

  modal.classList.add("active")
}

// ====== DELETE ======
function deletePlace(id) {
  if (!confirm("Supprimer cette place ?")) return
  let places = getData("places")
  places = places.filter(p => p.id !== id)
  saveData("places", places)
  loadPlaces()
}

// ====== FORM SUBMIT ======
placeForm.addEventListener("submit", e => {
  e.preventDefault()

  const places = getData("places")
  const place = {
    id: editingId || generateId(),
    number: number.value,
    type: typeSelect.value,
    floor: floor.value,
    pricePerHour: parseFloat(pricePerHour.value),
    status: status.value
  }

  if (editingId) {
    const index = places.findIndex(p => p.id === editingId)
    places[index] = place
  } else {
    places.push(place)
  }

  saveData("places", places)
  modal.classList.remove("active")
  loadPlaces()
})

// ====== CLOSE MODAL ======
modalCloseBtns.forEach(btn =>
  btn.addEventListener("click", () => modal.classList.remove("active"))
)

// ====== FILTERS ======
searchInput.addEventListener("input", loadPlaces)
statusFilter.addEventListener("change", loadPlaces)

// ====== INIT ======
loadCategories()
loadPlaces()