const express = require("express");
const {
  createUserPage,
  createUser,
  listUsers,
  showUser,
  editUserPage,
  editUser,
  removeUser,
  usersDashboard,
} = require("../controllers/users");
const isLoggedIn = require("../shared/middlewares/is-logged-in");
const hasRole = require("../shared/middlewares/has-role");
const validate = require("../shared/middlewares/validate");
const { createUsersSchema, editUserSchema } = require("../schemas/users");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.page = "users";
  next();
});

router.get("/dashboard", isLoggedIn, usersDashboard);
router.get("/users/create", isLoggedIn, hasRole(["admin"]), createUserPage);
// TODO validation
router.post("/users/create", isLoggedIn, hasRole(["admin"]), validate(createUsersSchema), createUser);
router.get("/users/list", isLoggedIn, hasRole(["admin"]), listUsers);
router.get("/users/:id", isLoggedIn, hasRole(["admin"]), showUser);
router.get("/users/:id/edit", isLoggedIn, hasRole(["admin"]), editUserPage);
// TODO validation
router.post("/users/:id/edit", isLoggedIn, hasRole(["admin"]), validate(editUserSchema), editUser);
router.post("/users/:id/delete", isLoggedIn, hasRole(["admin"]), removeUser);

module.exports = router;
