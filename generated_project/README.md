# SimpleToDoApp

A lightweight, **vanilla JavaScript** to‑do list that runs entirely in the browser. It lets you add, edit, delete, toggle completion, filter tasks, and keeps your list persisted across sessions using `localStorage`. The UI is responsive and works on both desktop and mobile devices.

---

## Technologies Used

- **HTML5** – Semantic markup for the structure of the app.
- **CSS3** – Simple styling and responsive layout (see `styles.css`).
- **Vanilla JavaScript (ES6)** – Core logic, DOM manipulation, and data persistence (`script.js`).

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/simple-todo-app.git
   cd simple-todo-app
   ```
2. **Open the app**
   - Open `index.html` directly in a web browser (no server required).
   - The application will load and automatically use the browser’s `localStorage` to keep your tasks.

---

## Features

| Feature | Description |
|---------|-------------|
| **Add** | Type a task into the input field and press **Add** or `Enter` to create a new item. |
| **Edit** | Click the **Edit** button next to a task, modify the text, then press `Enter` to save or `Esc` to cancel. |
| **Delete** | Remove a task instantly with the **Delete** button. |
| **Toggle** | Check or uncheck the checkbox to mark a task as completed or active. |
| **Filter** | Switch between **All**, **Active**, and **Completed** tasks using the filter buttons. |
| **Persistence** | All tasks are stored in `localStorage` under the key `todoTasks`, so they survive page reloads and browser restarts. |
| **Responsive Design** | The layout adapts to different screen sizes, making it usable on mobile phones and tablets. |

---

## Development

### Project Structure
```
/simple-todo-app
│
├─ index.html        # Main HTML page – loads the UI and script
├─ styles.css        # CSS styles (not shown here) – handles layout and responsiveness
├─ script.js         # Core JavaScript – task manager, UI rendering, event handling
└─ README.md         # Documentation (this file)
```

- **`script.js`** contains a self‑executing module that encapsulates the **TaskManager** object (CRUD operations, filtering, and persistence) and the UI rendering logic. It exposes `window.TaskManager` and `window.renderTasks` for potential external testing.
- The **TaskManager** functions (`addTask`, `editTask`, `deleteTask`, `toggleTask`, `setFilter`, `getFilteredTasks`, etc.) are pure and can be unit‑tested independently of the DOM.
- UI updates are performed by `renderTasks()`, which rebuilds the task list based on the current filter.
- Event listeners are attached after the `DOMContentLoaded` event to ensure the DOM elements exist.

### Extending the App
- **Styling** – Modify `styles.css` to change colors, fonts, or add animations.
- **Additional Persistence** – Swap `localStorage` for IndexedDB or a backend API.
- **Testing** – Import `script.js` as a module in a test runner and use the exposed `TaskManager` for unit tests.

---

## Screenshot

![App Screenshot](screenshot.png)

*Replace `screenshot.png` with an actual screenshot of the running application.*
