// ===============================
// INITIALISATION SÉCURISÉE
// ===============================

function initIfNotExists(key, defaultValue) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaultValue))
  }
}

// ===============================
// USERS (UNE SEULE FOIS)
// ===============================
initIfNotExists("users", [
  {
    id: "1",
    name: "Admin User",
    email: "admin@parking.com",
    password: "admin123",
    phone: "0612345678",
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    email: "user@parking.com",
    password: "user123",
    phone: "0623456789",
    role: "user",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@parking.com",
    password: "user123",
    phone: "0634567890",
    role: "user",
  },
])

// ===============================
// PLACES (⚠️ NE JAMAIS ÉCRASER)
// ===============================
if (!localStorage.getItem("places")) {
  const places = []
  const floors = ["RDC", "1er", "2ème", "3ème", "4ème"]

  for (let i = 1; i <= 50; i++) {
    const floorIndex = Math.floor((i - 1) / 10)
    const floor = floors[floorIndex] || "5ème"

    places.push({
      id: i.toString(),
      number: `P${i}`,
      type: "standard",
      floor: floor,
      pricePerHour: 1.2,
      status: "available",
    })
  }

  localStorage.setItem("places", JSON.stringify(places))
}

// ===============================
// AUTRES DONNÉES
// ===============================
initIfNotExists("categories", [])
initIfNotExists("reservations", [])
initIfNotExists("payments", [])

// ===============================
// HELPERS GLOBAUX
// ===============================
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}