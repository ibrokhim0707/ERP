const express = require("express");
const { createTodoPage, createTodo, listTodos, showTodo, completeTodoId, removeTodo } = require("../controllers/todos");
const isLoggedIn = require("../shared/middlewares/is-logged-in");
const hasRole = require("../shared/middlewares/has-role");
const validate = require("../shared/middlewares/validate");
const { createTodosSchema } = require("../schemas/todos");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.page = "todos";
  next();
});

router.get("/todos/create", isLoggedIn, hasRole(["admin"]), createTodoPage);
// TODO validation
router.post("/todos/create", isLoggedIn, hasRole(["admin"]), validate(createTodosSchema), createTodo);
router.get("/todos/list", isLoggedIn, listTodos);
router.get("/todos/:id", isLoggedIn, showTodo);
router.post("/todos/:id/complete", isLoggedIn,completeTodoId);
router.post("/todos/:id/delete", isLoggedIn, hasRole(["admin"]), removeTodo);

module.exports = router;
