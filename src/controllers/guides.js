const { guidesDb, usersDb, todosDb } = require("../db");

const createGuidePage = (req, res) => {
  req.session.returnTo = "/guides/create";

  res.render("guides/create");
};

const createGuide = (req, res) => {
  const { title, content, notify } = req.body;
  guidesDb
    .create({ title, content })
    .then((newGuide) => {
      req.flash("success", "Notification is successful");
      if (notify) {
        usersDb.findAll().then((users) => {
          const newTodos = users.map((user) => ({
            user_id: user.id,
            guide_id: newGuide.id,
            completed: false,
          }));
          return todosDb.createBulk(newTodos).then(() => {
            req.flash("success", "Notifications have been sent to all");
            res.redirect("/guides/list");
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error creating guide:", error);
      req.flash("error", "Error creating guide");
      res.redirect("/guides/list");
    });
};

const listGuides = (req, res) => {
  guidesDb
    .findAll()
    .then((guides) => {
      res.render("guides/list", { guides });
    })
    .catch((error) => {
      console.error("error", "Error listing guides:", error);
      res.redirect("/guides/list");
    });
};

const showGuide = (req, res) => {
  const { id } = req.params;

  guidesDb
    .findById(id)
    .then((guide) => {
      if (!guide) {
        req.flash("error", "show guides not found");
        return res.redirect("/guides/list");
      }
      res.render("guides/show", { guide });
    })
    .catch((error) => {
      console.error("Error showing guide:", error);
      req.flash("error", "Error showing guide");
      res.redirect("/guides/list");
    });
};

const editGuidePage = (req, res) => {
  const { id } = req.params;

  guidesDb
    .findById(id)
    .then((guides) => {
      if (!guides) {
        req.flash("warning", "Not found guide");
        return res.redirect("/guides/list");
      }
      req.session.returnTo = `/guides/${id}/edit`;

      res.render("guides/edit", { guides });
    })
    .catch((error) => {
      console.error("Error editing guide page:", error);
      req.flash("error", "Error editing guide page");
      res.redirect("/guides/list");
    });
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

const editGuide = (req, res) => {
  const { id } = req.params;
  const { title, content, notify } = req.body;

  guidesDb
    .findById(id)
    .then((guide) => {
      if (!guide) {
        req.flash("error", "Not found guide");
        return res.redirect("/guides/list");
      }
    })
    .then(() => {
      guidesDb.update(id, { title, content });
      if (notify) {
        usersDb.findAll().then((users) => {
          const newTodos = users.map((user) => ({
            user_id: user.id,
            guide_id: guide.id,
            completed: false,
          }));
          todosDb.createBulk(newTodos).then(() => {
            req.flash("success", "Notification edited successfully");
            req.flash("success", "Notifications have been sent to all");
            res.redirect("/guides/list");
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error editing guide:", error);
      // req.flash("error", "Error editing guide");
      res.redirect("/guides/list");
    });
};

const removeGuide = (req, res) => {
  const { id } = req.params;
  guidesDb
    .findById(id)
    .then((guide) => {
      if (!guide) {
        req.flash("error", "Delete guide not found");
        return res.redirect("/guides/list");
      }
      return guidesDb.remove(id);
    })
    .then(() => {
      return todosDb.removeAllOfGuide(id);
    })
    .then(() => {
      req.flash("success", "Notification successfully deleted");
      res.redirect("/guides/list");
    })
    .catch((error) => {
      console.error("Error removing guide:", error);
      req.flash("error", "Error removing guide");
      res.redirect("/guides/list");
    });
};

module.exports = {
  createGuidePage,
  createGuide,
  listGuides,
  showGuide,
  editGuidePage,
  editGuide,
  removeGuide,
};
