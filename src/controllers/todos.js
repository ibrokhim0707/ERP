const { todosDb, guidesDb, usersDb } = require("../db");

const createTodoPage = (req, res) => {
  Promise.all([usersDb.findAll(), guidesDb.findAll()]).then(([users, guides]) => {
    res.render("todos/create", { users, guides })
  })
}


const createTodo = (req, res) => {
  const { user_id, guide_id } = req.body;

  usersDb
    .findById(user_id)
    .then((user) => {
      if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/todos/list");
      }
      guidesDb.findById(guide_id);
    })
    .then(() => {
      if (!guide) {
        req.flash("error", "Guide not found");
        return res.redirect("/todos/list");
      }
      todosDb.create({ user_id, guide_id, complete: false });
    })
    .then(() => {
      req.flash("success", "Todo attached successfully");
      res.redirect("/todos/list");
    })
    .catch((error) => {
      console.error("Error creating todo:", error);
      req.flash("error", "An error occurred while creating todo");
      res.redirect("/todos/list");
    });
};

const listTodos = (req, res) => {
  todosDb
    .findAllByOfUser(req.session.user.id)
    .then((todos) => {
      const todoUserId = todos.map((todo) => todo.user_id);
      const guideId = todos.map((todo) => todo.guide_id);
      return Promise.all([usersDb.findById(todoUserId), guidesDb.findById(guideId), todos]);
    })
    .then(([users, guides, todos]) => {
      const usersMap = new Map(users.map((user) => [user.id, user]));
      const guidesMap = new Map(guides.map((guide) => [guide.id, guide]));

      todos.forEach((todo) => {
        todo.user = usersMap.get(todo.user_id);
        todo.guide = guidesMap.get(todo.guide_id);
      });

      res.render("todos/list", { todos });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
};

const showTodo = (req, res) => {
  const { id } = req.params;
  todosDb.findById(id)
    .then((todo) => {
      if (!todo) {
        req.flash("error", "Todo not found");
        return res.redirect("/todos/list");
      }

      if (todo.user_id !== req.user.id) {
        req.flash("error", "No permission");
        return res.redirect("/todos/list");
      }

      return usersDb
        .findById(todo.user_id)
        .then((user) => {
          todo.user = user;
          return guidesDb.findById(todo.guide_id);
        })
        .then((guide) => {
          todo.guide = guide;
          return todo;
        });
    })
    .then((todo) => {
      res.render("todos/show", { todo });
    })
    .catch((error) => {
      console.error("Error showing todo:", error);
      req.flash("error", "An error occurred while showing todo");
      res.redirect("/todos/list");
    });
};

const completeTodoId = (req, res) => {
  const { id } = req.params;

   todosDb.findById(id).then((todo) => {
     if (!todo) {
       req.flash("error", "Todo not found");
       return res.redirect("/todos/list");
     }
   
     if (todo.complete) {
       console.log("todo already completed");
       return res.status(400).send("todo already completed");
     }
   })
   
  if (todo.user_id !== req.user.id) {
    req.flash("error", "No permission");
    return res.redirect("/todos/list");
  }

  todosDb.update(id, { complete: true })
  .then(() => {
    req.flash("success", "the notification was successfully viewed");
    res.redirect(`/todos/list`);
  })
  .catch((error) => {
     console.error("Yangilashda xatolik:", error);
     req.flash("error", "Xatolik yuz berdi, todo yangilanmadi");
     res.redirect("/todos/list");
  })

};

const removeTodo = (req, res) => {
  const { id } = req.params;

  todosDb.findById(id)
  .then((todo) => {
    if (!todo) {
      req.flash("error", "Todo not found");
      return res.redirect("/todos/list");
    }
  })
  todosDb.remove(id)
  .then(() => {
    req.flash("success", "Todo delete successfully");
    res.redirect("/todos/list");
  })
  .catch((error) => {
     console.error("O'chirishda xatolik:", error);
     req.flash("error", "Xatolik yuz berdi, todo o'chirilmadi");
     res.redirect("/todos/list");
  })
};

module.exports = {
  createTodoPage,
  createTodo,
  listTodos,
  showTodo,
  completeTodoId,
  removeTodo,
};
