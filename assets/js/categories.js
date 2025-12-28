let categories = JSON.parse(localStorage.getItem("categories")) || [];
let editIndex = null;

const form = document.getElementById("categoryForm");
const nameInput = document.getElementById("name");
const list = document.getElementById("categoryList");

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function displayCategories() {
    list.innerHTML = "";
  
    categories.forEach((cat, index) => {
      list.innerHTML += `
        <tr>
          <td>
            <span class="badge badge-available">${cat}</span>
          </td>
          <td>
            <button class="btn btn-sm btn-edit" onclick="editCategory(${index})">
              Modifier
            </button>
            <button class="btn btn-sm btn-delete" onclick="deleteCategory(${index})">
              Supprimer
            </button>
          </td>
        </tr>
      `;
    });
  }

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (editIndex === null) {
    categories.push(nameInput.value);
  } else {
    categories[editIndex] = nameInput.value;
    editIndex = null;
  }

  nameInput.value = "";
  saveCategories();
  displayCategories();
});

function editCategory(index) {
  nameInput.value = categories[index];
  editIndex = index;
}

function deleteCategory(index) {
  if (confirm("Supprimer cette catégorie ?")) {
    categories.splice(index, 1);
    saveCategories();
    displayCategories();
  }
}

displayCategories();