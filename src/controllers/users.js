const express = require("express");
const bcrypt = require("bcryptjs");
const { usersDb, todosDb } = require("../db");

const createUserPage = (req, res) => {
  req.session.returTo = "/users/create";

  res.render("users/create");
};

const createUser = (req, res) => {
  const { firstname, lastName, age, role, username, password } = req.body;

  bcrypt
    .hash(password, 8)
    .then((hashedPassword) => {
      return usersDb.findByusername(username)
      .then((existing) => {
        if (existing) {
          req.flash('error', 'Username is used')
        } else {
          return usersDb.create({
            firstname,
            lastName,
            age,
            role,
            username,
            password: hashedPassword,
          });
        }
      });
    })
    .then(() => {
      req.flash("success", "User muvaffaqiyatli qo'shildi");
      res.redirect("/users/list");
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      req.flash("error", "User yaratishda xatolik");
      res.redirect("/users/list");
    });
};

const listUsers = (req, res) => {
  usersDb.findAll()
    .then((users) => {
      res.render("users/list", { users });
    })
    .catch((error) => {
      console.error("Error listing users:", error);
      req.flash("error", "Foydalanuvchilarni ro'yxatga olishda xatolik");
      res.redirect("/users/list");
    });
};

const showUser = (req, res) => {
  const { id } = req.params;

  usersDb.findById(id)
    .then((user) => {
      if (!user) {
        req.flash("warning", "Foydalanuvchi topilmadi");
        return res.redirect("/users/list");
      }
      res.render("users/show", { user });
    })
    .catch((error) => {
      console.error("Error showing user:", error);
      req.flash("error", "Foydalanuvchini ko'rsatishda xatolik");
      res.redirect("/users/list");
    });
};

const editUserPage = (req, res) => {
  const { id } = req.params;

  usersDb
    .findById(id)
    .then((user) => {
      if (!user) {
        req.flash("warning", "Foydalanuvchi topilmadi");
        return res.redirect("/users/list");
      }
      req.session.returnTo = `/users/${id}/edit`;

      res.render("users/edit", { user });
    })
    .catch((error) => {
      console.error("Error editing user:", error);
      req.flash("error", "Foydalanuvchini tahrirlashda xatolik");
      res.redirect("/users/list");
    });
};

const editUser = (req, res) => {
  const { id } = req.params;
  const { firstname, lastName, age, role, username } = req.body;

  usersDb
    .findById(id)
    .then((user) => {
      if (!user) {
        req.flash("error", "Foydalanuvchi topilmadi");
        return res.redirect("/users/list");
      }
      return usersDb.update(id, { firstname, lastName, age, role, username });
    })
    .then(() => {
      req.flash("success", "Foydalanuvchi muvaffaqiyatli tahrirlandi");
      res.redirect("/users/list");
    })
    .catch((error) => {
      console.error("Error editing user:", error);
      req.flash("error", "Foydalanuvchini tahrirlashda xatolik");
      res.redirect("/users/list");
    });
};

const removeUser = (req, res) => {
  const { id } = req.params;

  usersDb
    .findById(id)
    .then((user) => {
      if (!user) {
        req.flash("error", "Foydalanuvchi topilmadi");
        return res.redirect("/users/list");
      }
      return usersDb.remove(id);
    })
    .then(() => {
      return todosDb.removeAllOfUser(id);
    })
    .then(() => {
      req.flash("success", "Foydalanuvchi muvaffaqiyatli o'chirildi");
      res.redirect("/users/list");
    })
    .catch((error) => {
      console.error("Error removing user:", error);
      req.flash("error", "Foydalanuvchini o'chirishda xatolik");
      res.redirect("/users/list");
    });
};

const usersDashboard = (req, res) => {
  usersDb
    .findAll()
    .then((users) => {
      res.locals.page = null;
      res.render("users/dashboard", { users });
    })
    .catch((error) => {
      req.flash("error", "Foydalanuvchilarni olishda xatolik");
      res.redirect("/users/list");
    });
};

module.exports = {
  createUserPage,
  createUser,
  listUsers,
  showUser,
  editUserPage,
  editUser,
  removeUser,
  usersDashboard,
};
