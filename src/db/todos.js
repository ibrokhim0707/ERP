const { error } = require("node:console");
const fsp = require("node:fs/promises");
const path = require("node:path");
const uuid = require("uuid");

const dbPath = path.join(__dirname, "..", "..", "db", "todos.json");

const findAll = () => {
  return fsp.readFile(dbPath, 'utf8').then((todos) => {
    const parsed = JSON.parse(todos)
    .then(() => parsed)
  })
};

const findAllByOfUser = (user_id) => {
  return fsp.readFile(dbPath, "utf8")
    .then((content) => {   
      const todos = JSON.parse(content);
      return todos.filter(todo => todo.user_id === user_id);
  })
  .catch((error) => {
    throw error
  })
};

const create = (data) => {
  const newTodo = { id: uuid.v4(), ...data };
  return findAll()
  .then((todos) => {
    todos.push(newTodo)
    return fsp.writeFile(dbPath, JSON.stringify(todos, null, 2))
  })
  .then(() => newTodo)
  .catch((error) => {
    throw error
  })

};

const createBulk = (data) => {
  return findAll()
    .then((todos) => {
      const newTodos = data.map((todo) => ({ id: uuid.v4(), ...todo }));
      todos.push(...newTodos)
      return fsp.writeFile(dbPath, JSON.stringify(todos, null, 2))
    })
    .then(() => true)
    .catch((error) => {
      throw error
    })

};

const findById = (id) => {
  return findAll()
  .then((todos) => {
    const todo = todos.find((todo) => todo.id === id);
    return todo ? todo : null
  })
  .catch((error) => {
    throw error
  })
};

const findByusername = (username) => {
  return findAll()
    .then((todos) => {
      const todo = todos.find((todo) => todo.username === username);
      return todo ? todo : null;
    })
    .catch((error) => {
      throw error;
    });
};

const update = (id, newData) => {
  return findAll()
  .then((todos) => {
    const existing = todos.find((todo) => todo.id === id);
    const index = todos.indexOf(existing);
  
    todos.splice(index, 1, { ...existing, ...newData });
    return fsp.writeFile(dbPath, JSON.stringify(todos, null, 2))
  })
  .then(() => true)
  .catch((error) => {
    throw error
  })
};

const remove = (id) => {
  return findAll()
  .then((todos) => {
    let result  = todos.filter((todo) => todo.id !== id);
    const data  = JSON.stringify(result, null, 2);
    return fsp.writeFile(dbPath, data, 'utf8')
  })
  .then(() => true)
  .catch((error) => {
    throw error
  })

};

const removeAllOfUser = (user_id) => {
  return findAll().then((todos) => {
    let result = todos.filter((todo) => todo.user_id !== user_id);
    const data = JSON.stringify(result, null, 2);
    return fsp.writeFile(dbPath, data, "utf8")
  })
  .then(() => true)
  .catch((error) => {
    throw error
  })
};

const removeAllOfGuide = (guide_id) => {
  return findAll().then((todos) => {
    let result = todos.filter((todo) => todo.guide_id !== guide_id);
    const data = JSON.stringify(result, null, 2);
    return fsp.writeFile(dbPath, data, "utf8")
  })
  .then(() => true)
  .catch((error) => {
    throw error
  })
};

module.exports = {
  findAll,
  findAllByOfUser,
  create,
  createBulk,
  findById,
  findByusername,
  update,
  remove,
  removeAllOfUser,
  removeAllOfGuide,
};
