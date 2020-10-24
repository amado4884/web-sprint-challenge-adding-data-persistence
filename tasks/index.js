// ---------------------Model-------------------------
const knex = require("knex");
const knexFile = require("../knexfile");
const devMode = process.env.ENV_MODE || "development";
const db = knex(knexFile[devMode])("tasks");

const find = async () => {
  try {
    return await db;
  } catch (err) {
    console.log("Could not find (tasks): ", err.message);
  }
};

const findById = async (id) => {
  try {
    return await db.where({ id }).first();
  } catch (err) {
    console.log("Could not findById (tasks): ", err.message);
  }
};

// ---------------------Route-------------------------
const express = require("express");
const Router = express.Router();

const validateId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid Task ID" });
  try {
    const task = await findById(id);
    if (!task)
      return res.status(400).json({ message: "No task found with that ID" });
    req.task = task;
    next();
  } catch (err) {
    console.log("Could not validate the task id: ", err);
    return res.status(500).json({ message: err.message });
  }
};

Router.get("/", async (req, res) => {
  try {
    const tasks = await find();
    return res.status(200).json(tasks);
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
