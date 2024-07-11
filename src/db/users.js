const { error } = require("node:console");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const uuid = require("uuid");

const dbPath = path.join(__dirname, "..", "..", "db", "users.json");

const findAll = () => {
  return fsp.readFile(dbPath, "utf8")
  .then((content) => {
    const users = JSON.parse(content);
    return users;
  })
  .catch((error) => {
    throw error
  })
};

const create = (data) => {
  const newUser = { id: uuid.v4(), ...data };
  return findAll()
  .then((users) => {
    users.push(newUser);
    return fsp.writeFile(dbPath, JSON.stringify(users, null, 2))
  })
  .then(() => newUser)
  .catch((error) => {
      throw error;
    })
};

const findById = (id) => {
  return findAll()
    .then((users) => {
      const user = users.find((user) => user.id === id);
      return user ? user : null;
    })
    .catch((error) => {
      throw error;
    });
};

const findByusername = (username) => {
  return findAll()
    .then((users) => {
      const user = users.find((user) => user.username === username);
      return user ? user : null;
    })
    .catch((error) => {
      throw error;
    });
};

const update = (id, newData) => {
  return findAll()
    .then((users) => {
      const existing = users.find((user) => user.id === id);
      const index = users.indexOf(existing);
      users.splice(index, 1, { ...existing, ...newData });
      return fsp.writeFile(dbPath, JSON.stringify(users, null, 2));
    })
    .then(() => users)
    .catch((error) => {
      throw error;
    });
};

const remove = (id) => {
  return findAll()
    .then((users) => {
      users = users.filter((user) => user.id !== id);
      return fsp.writeFile(dbPath, JSON.stringify(users, null, 2));
    })
    .then(() => true)
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  findAll,
  create,
  findById,
  findByusername,
  update,
  remove,
};
