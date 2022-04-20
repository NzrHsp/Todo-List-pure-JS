const input = document.querySelector(".add__input");
const add = document.querySelector(".add");
const todosContainer = document.querySelector(".todos");

class Todo {
  id = (Date.now() + "").slice(-5);
  constructor(data) {
    this.data = data;
  }
}

class App {
  #inputValues = [];
  constructor() {
    this._getLocalStorage();
    add.addEventListener("submit", this._addTodo.bind(this));
    todosContainer.addEventListener("click", this._editTodo.bind(this));
    todosContainer.addEventListener(
      "contextmenu",
      this._fadeOutEffect.bind(this)
    );
  }

  _addTodo(e) {
    e.preventDefault();
    const content = input.value;
    if (!content) return;

    const todo = new Todo(content);

    // adding values of input to save in local storage
    this.#inputValues.push(todo);

    // render todo
    this._renderMarkup(todo);

    input.value = "";

    this._setLocaleStorage();
  }

  _setLocaleStorage() {
    // set values to local Storage
    localStorage.setItem("todos", JSON.stringify([...this.#inputValues]));
  }

  _renderMarkup(todo) {
    const markup = `
    <div class="todo">
              <input type="text" value="${todo.data}" data-id="${todo.id}" class="todo__data" readonly />
              <button class="btn">Edit</button>
            </div>
    `;
    todosContainer.insertAdjacentHTML("afterbegin", markup);
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("todos"));
    if (!data) return;
    data.forEach((el) => this._renderMarkup(el));
    this.#inputValues = data;
  }

  _editTodo(e) {
    const todo = e.target;
    if (todo.classList[0] != "btn") return;
    let sibling = todo.previousElementSibling;
    if (todo.textContent.toLowerCase() == "edit") {
      sibling.style.color = "#c2255c";
      sibling.removeAttribute("readonly");
      todo.textContent = "Save";

      // set text cursor to the end
      sibling.setSelectionRange(-1, -1);
      sibling.focus();
    } else if (todo.textContent.toLowerCase() == "save") {
      sibling.style.color = "#000";
      sibling.setAttribute("readonly", "readonly");
      todo.textContent = "Edit";

      // edit element from local storage and from array
      this.#inputValues.forEach((el) => {
        if (el.id == sibling.dataset.id) {
          el.data = sibling.value;
        }
      });
      this._setLocaleStorage();
    }
  }

  _fadeOutEffect(e) {
    e.preventDefault();
    var fadeTarget = e.target.closest(".todo");
    var fadeEffect = setInterval(() => {
      if (!fadeTarget.style.opacity) {
        fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
        fadeTarget.style.opacity -= 0.2;
      } else {
        clearInterval(fadeEffect);
        fadeTarget.parentNode.removeChild(fadeTarget);
        // delete element from local storage and from array
        this.#inputValues = this.#inputValues.filter(
          (el) => el.id !== fadeTarget.firstElementChild.dataset.id
        );
        this._setLocaleStorage();
      }
    }, 50);
  }

  clear() {
    localStorage.removeItem("todos");
  }
}

const app = new App();
