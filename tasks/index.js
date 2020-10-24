// ---------------------Model-------------------------
const knex = require("knex");
const knexFile = require("../knexfile");
const devMode = process.env.ENV_MODE || "development";
const db = knex(knexFile[devMode]);

const find = async () => {
  try {
    return await db
      .select(
        "tasks.*",
        { project_name: "projects.name" },
        { project_description: "projects.description" }
      )
      .from({ tasks: "tasks" })
      .innerJoin("projects", "tasks.project_id", "projects.id");
  } catch (err) {
    console.log("Could not find (tasks): ", err.message);
  }
};

const findById = async (id) => {
  try {
    return await db("tasks").where({ id }).first();
  } catch (err) {
    console.log("Could not findById (tasks): ", err.message);
  }
};

const findByProject = (id) => {
  return db("tasks").where({ project_id: id });
};

const addTask = async (task) => {
  try {
    const [id] = await db("tasks").insert(task);
    return findById(id);
  } catch (err) {
    console.log("Could not add a new task", err.message);
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

Router.get("/:id", validateId, (req, res) => {
  return res.status(200).json(req.task);
});

Router.post("/", async (req, res) => {
  const { description, notes, completed, project_id } = req.body;

  if (!description || !project_id)
    return res.status(500).json({
      message: "Please add a description and project_id for this task",
    });

  try {
    const task = await addTask({
      notes,
      description,
      project_id,
      completed: completed ? completed : false,
    });
    return res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  Router,
  Model: {
    find,
    findById,
    findByProject,
  },
};
