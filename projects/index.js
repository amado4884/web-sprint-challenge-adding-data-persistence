// ---------------------Model-------------------------
const knex = require("knex");
const knexFile = require("../knexfile");
const devMode = process.env.ENV_MODE || "development";
const db = knex(knexFile[devMode])("projects");

const find = async () => {
  try {
    return await db;
  } catch (err) {
    console.log("Could not find (projects): ", err.message);
  }
};

const findById = async (id) => {
  try {
    return await db.where({ id }).first();
  } catch (err) {
    console.log("Could not findById (projects): ", err.message);
  }
};

// ---------------------Route-------------------------
const express = require("express");
const Router = express.Router();

const validateId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid Project ID" });
  try {
    const project = await findById(id);
    if (!project)
      return res.status(400).json({ message: "No project found with that ID" });
    req.project = project;
    next();
  } catch (err) {
    console.log("Could not validate the project id: ", err);
    return res.status(500).json({ message: err.message });
  }
};

Router.get("/", async (req, res) => {
  try {
    const projects = await find();
    return res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  Router,
  Model: {
    find,
    findById,
  },
};
