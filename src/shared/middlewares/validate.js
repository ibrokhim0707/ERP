const express = require("express");

function validate(schema) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  return function (req, res, next) {
    const { error, value } = schema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);

      res.redirect(req.session.returnTo || "/guides/list");

      return;
    }

    req.body = value;

    next();
  };
}

module.exports = validate;
