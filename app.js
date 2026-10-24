const express = require('express');

const app = express();

app.use(express.json());

// Initial todo data
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// READ: Get all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// BONUS: Get active todos (not completed)
// Keep this route before /todos/:id.
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(
    (todo) => todo.completed === false
  );

  res.status(200).json(activeTodos);
});

// READ: Get one todo by ID
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found',
    });
  }

  res.status(200).json(todo);
});

// CREATE: Add a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation: task is required
  if (
    typeof task !== 'string' ||
    task.trim() === ''
  ) {
    return res.status(400).json({
      message: 'The task field is required and must be a non-empty string',
    });
  }

  const newId =
    todos.length > 0
      ? Math.max(...todos.map((todo) => todo.id)) + 1
      : 1;

  const newTodo = {
    id: newId,
    task: task.trim(),
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// UPDATE: Partially update a todo
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found',
    });
  }

  const { task, completed } = req.body;

  // Validate any supplied task
  if (
    task !== undefined &&
    (typeof task !== 'string' || task.trim() === '')
  ) {
    return res.status(400).json({
      message: 'Task must be a non-empty string',
    });
  }

  // Validate any supplied completion status
  if (
    completed !== undefined &&
    typeof completed !== 'boolean'
  ) {
    return res.status(400).json({
      message: 'Completed must be true or false',
    });
  }

  if (task !== undefined) {
    todo.task = task.trim();
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.status(200).json(todo);
});

// DELETE: Remove a todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const initialLength = todos.length;

  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({
      message: 'Todo not found',
    });
  }

  res.status(204).send();
});

// READ: Get completed todos
app.get('/todos/completed', (req, res) => {
  const completedTodos = todos.filter(
    (todo) => todo.completed === true
  );

  res.status(200).json(completedTodos);
});

// Handle unexpected server errors
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: 'Internal server error',
  });
});

// Start the server
const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});