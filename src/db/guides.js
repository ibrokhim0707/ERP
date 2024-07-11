const { error } = require("node:console");
const fsp = require("node:fs/promises");
const path = require("node:path");
const uuid = require("uuid");

const dbPath = path.join(__dirname, "..", "..", "db", "guides.json");

const findAll = () => {
  return fsp.readFile(dbPath, "utf8")
  .then((content) => {
    const guides = JSON.parse(content);
    return guides;
  })
  .catch((error) => {
    throw error
  })
};

const create = (data) => {
  const newGuide = { id: uuid.v4(), ...data };
  return findAll()
  .then((guides) => {
    guides.push(newGuide);
    return fsp.writeFile(dbPath, JSON.stringify(guides, null, 2))
  })
  .then(() => newGuide)
  .catch((error) => {
    throw error
  })
};

const findById = (id) => {
  return findAll()
    .then((guides) => {
      const guide = guides.find((guide) => guide.id === id);
      return guide ? guide : null;
    })
    .catch((error) => {
      throw error;
    });
};

const findByusername = (username) => {
  return findAll()
    .then((guides) => {
      const guide = guides.find((guide) => guide.username === username);
      return guide ? guide : null;
    })
    .catch((error) => {
      throw error;
    });
};

const update = (id, newData) => {
  return findAll()
    .then((guides) => {
      const existing = guides.find((guide) => guide.id === id);
      const index = guides.indexOf(existing);
      guides.splice(index, 1, { ...existing, ...newData });
      return fsp.writeFile(dbPath, JSON.stringify(guides, null, 2)).then(() => guides);
        })
    .catch((error) => {
      throw error;
    });
};

const remove = (id) => {
  return findAll()
    .then((guides) => {
      guides = guides.filter((guide) => guide.id !== id);
      return fsp.writeFile(dbPath, JSON.stringify(guides, null, 2));
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
