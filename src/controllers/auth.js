const express = require("express");
const bcrypt = require("bcryptjs");
const { usersDb } = require("../db");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

const loginPage = (req, res) => {
  console.log(req.flash("error")[0]);

  req.session.returnTo = "/login";

  res.render("auth/login", {
    layout: "layouts/auth",
  });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

const login = (req, res) => {
  const { username, password } = req.body;
console.log(req.body)
  usersDb
    .findByusername(username)
    .then((existing) => {
      if (!existing) {
        req.flash("error", "Login yoki parol xato");
        return res.redirect("/login");
      }

      bcrypt.compare(password, existing.password).then((match) => {
        if (!match) {
          req.flash("error", "Login yoki parol xato");
          return res.redirect("/login");
        }

        req.flash("success", "");
        req.session.user = existing
        res.redirect("/dashboard");
      });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      req.flash("error", "Login yoki parol xato");
      res.redirect("/login");
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

const logout = (req, res) => {
  req.session.destroy();

  res.redirect("/login");
};

module.exports = {
  loginPage,
  login,
  logout,
};
