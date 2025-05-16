import { TodoType } from "./types";
import { serialize } from "./utils";
import {
  todoForm,
  todoLists,
  todosLeftCount,
  allTodos,
  clearButton,
  completedTodos,
  activeTodo,
  input,
} from "./UIElements";

let todos: TodoType[] = [];

let todosData = window.localStorage.getItem("todos");

if (todosData) {
  // Deserialize the todosData JSON string to a TypeScript/JavaScript Object and store to todos variable
  todos = JSON.parse(todosData);
}

// Add a Todo
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Check and validate that the input has value
  if (!input.value.length) return;

  todos.unshift({
    id: todos.length + 1,
    title: input.value,
    completed: false,
  });

  // Serialize the todos data to JSON string and save in 'todos' localStorage .
  serialize(todos);
  // window.localStorage.setItem("todos", JSON.stringify(todos));

  input.value = "";

  renderTodos();
});

// Toggle Complete or Incomplete Todo
todoLists.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // DOM Traversal
  let clickedItem = target.closest(".checkbox-wrapper") as HTMLElement;

  if (clickedItem) {
    let todoId = Number(clickedItem.id);
    let foundedTodo = todos.find((todo) => todo.id == todoId);

    if (foundedTodo) {
      foundedTodo.completed = !foundedTodo.completed;
      renderTodos();
      serialize(todos);
    }
  }
});

// Filter By All Todos
allTodos.addEventListener("click", () => {
  allTodos.classList.toggle("active");
  activeTodo.classList.remove("active");
  completedTodos.classList.remove("active");
  renderTodos();
});

// Filter By Active Todos
activeTodo.addEventListener("click", () => {
  activeTodo.classList.toggle("active");
  allTodos.classList.remove("active");
  completedTodos.classList.remove("active");
  renderTodos("incompleted");
});

// Filter By Completed Todos
completedTodos.addEventListener("click", () => {
  const originalTodo = todos;
  todos = todos.filter((todo) => todo.completed);
  activeTodo.classList.remove("active");
  allTodos.classList.remove("active");
  completedTodos.classList.toggle("active");
  renderTodos();
  todos = originalTodo;
});

// Clear All Completed Todos
clearButton.addEventListener("click", () => {
  todos = todos.filter(function (todo) {
    return !todo.completed;
  });

  serialize(todos);
  renderTodos();
});

// Display Todos on the UI
function renderTodos(status?: string) {
  let todosUI = "";
  let todosToRender = [...todos];
  console.log({ status });
  if (status == "completed") {
    todosToRender = todos.filter(function (todo) {
      return todo.completed;
    });
  }

  if (status == "incompleted") {
    todosToRender = todos.filter(function (todo) {
      return !todo.completed;
    });
  }
  console.log({ todosToRender });
  for (let todo of todosToRender) {
    todosUI =
      todosUI +
      `<div class="todo-list-item ${todo.completed ? "completed" : ""}">
                  <div id=${todo.id} class="checkbox-wrapper ${
        todo.completed ? "checked" : ""
      }">
                  ${
                    todo.completed
                      ? `<img
                      src="/images/icon-check.svg"
                      alt="Checkbox Icon"
                      class="checkbox"
                    />`
                      : ""
                  }
                    <input type="checkbox" class="custom-checkbox" />
                  </div>
                  <p>${todo.title}</p>
                </div>`;
  }
  if (todosToRender.length == 0) {
    todosUI = `<div class='empty'>This area is empty!</div>`;
  }
  todoLists.innerHTML = todosUI;
  // console.log(todos.complated)
  console.log({ todos });
  // todosLeftCount.textContent = todos.filter((todo) => !todo.completed).length
  let activeTodosCount = 0;
  for (let todo of todos) {
    if (todo.completed == false) {
      activeTodosCount++;
    }
  }
  todosLeftCount.textContent = String(activeTodosCount);
}

renderTodos();
