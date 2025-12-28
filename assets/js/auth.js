// Check if user is already logged in on index.html
if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser) {
    const user = JSON.parse(currentUser)
    if (user.role === "admin") {
      window.location.href = "dashboard.html"
    } else {
      window.location.href = "user-dashboard.html"
    }
  }
}

// Handle login form
const loginForm = document.getElementById("loginForm")
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    console.log("[v0] Login attempt - Email:", email)
    console.log("[v0] Login attempt - Password:", password)

    const users = JSON.parse(localStorage.getItem("users")) || []
    console.log("[v0] Users in localStorage:", users)

    const user = users.find((u) => u.email === email && u.password === password)
    console.log("[v0] User found:", user)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      console.log("[v0] User logged in successfully, role:", user.role)

      if (user.role === "admin") {
        console.log("[v0] Redirecting to dashboard.html")
        window.location.href = "dashboard.html"
      } else {
        console.log("[v0] Redirecting to user-dashboard.html")
        window.location.href = "user-dashboard.html"
      }
    } else {
      console.log("[v0] Login failed - incorrect credentials")
      alert("Email ou mot de passe incorrect")
    }
  })
}

// Check authentication on protected pages
function checkAuth() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    window.location.href = "index.html"
    return null
  }
  return JSON.parse(currentUser)
}

// Display user email in top bar
function displayUserEmail() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (user) {
    const userEmailElement = document.getElementById("userEmail")
    if (userEmailElement) {
      userEmailElement.textContent = user.email
    }
  }
}

// Setup logout button
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser")
      window.location.href = "index.html"
    })
  }
}

// Restrict admin-only pages
function requireAdmin() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (!user) {
    window.location.href = "index.html"
    return
  }
  if (user.role !== "admin") {
    window.location.href = "user-dashboard.html"
  }
}

// Hide admin navigation links for regular users
function setupNavigation() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (user && user.role === "user") {
    const adminLinks = ["dashboardLink", "placesLink", "usersLink", "paymentsLink"]
    adminLinks.forEach((linkId) => {
      const link = document.getElementById(linkId)
      if (link) {
        link.style.display = "none"
      }
    })
  }
}