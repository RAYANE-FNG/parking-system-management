// Initialize data in localStorage if not exists
function initializeData() {
  // Users
  if (!localStorage.getItem("users")) {
    const users = [
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
    ]
    localStorage.setItem("users", JSON.stringify(users))
  }

  const places = []
  const floors = ["RDC", "1er", "2ème", "3ème", "4ème"]
  const types = ["standard", "electric", "handicap"]

  for (let i = 1; i <= 50; i++) {
    const floorIndex = Math.floor((i - 1) / 10)
    const floor = floors[floorIndex] || "5ème"
    const type = i % 10 === 0 ? "electric" : i % 15 === 0 ? "handicap" : "standard"
    const pricePerHour = type === "electric" ? 1.5 : type === "handicap" ? 1.0 : 1.2

    places.push({
      id: i.toString(),
      number: `P${i}`,
      type: type,
      floor: floor,
      pricePerHour: pricePerHour,
      status: "available",
    })
  }
  localStorage.setItem("places", JSON.stringify(places))

  // Reservations
  if (!localStorage.getItem("reservations")) {
    const reservations = []
    localStorage.setItem("reservations", JSON.stringify(reservations))
  }

  // Payments
  if (!localStorage.getItem("payments")) {
    const payments = []
    localStorage.setItem("payments", JSON.stringify(payments))
  }
}

// Get data from localStorage
function getData(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

// Save data to localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// Generate unique ID
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Initialize data on load
initializeData()
