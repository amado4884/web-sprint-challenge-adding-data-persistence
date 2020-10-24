// ---------------------Model-------------------------
const knex = require("knex");
const knexFile = require("../knexfile");
const devMode = process.env.ENV_MODE || "development";
const db = knex(knexFile[devMode]);
const { Model: Tasks } = require("../tasks");
const { Model: Resources } = require("../resources");

const find = () => {
  return db("projects");
};

const findById = async (id) => {
  return db("projects").where({ id }).first();
};

const getTasks = async (id) => {
  try {
    const tasks = await Tasks.findByProject(id);
    return tasks.map((task) => {
      delete task.project_id;
      task.completed = task.completed == true ? true : false;
      return task;
    });
  } catch (err) {
    console.log("Could not getTasks for Project: ", err.message);
  }
  return Tasks.findByProject(id);
};

const addProject = async (project) => {
  try {
    const [id] = await db("projects").insert(project);
    return findById(id);
  } catch (err) {
    console.log("Could not add a new project", err.message);
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

Router.get("/:id", validateId, async (req, res) => {
  try {
    return res.status(200).json(req.project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/:id/resources", validateId, async (req, res) => {
  try {
    const resources = await Resources.findByProject(req.project.id);
    return res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/:id/tasks", validateId, async (req, res) => {
  try {
    const tasks = await getTasks(req.project.id);
    req.project.tasks = tasks;
    return res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.post("/", async (req, res) => {
  const { name, description, completed } = req.body;

  if (!name)
    return res
      .status(500)
      .json({ message: "Please add a name for this project" });

  try {
    const project = await addProject({
      name,
      description,
      completed: completed ? completed : false,
    });
    return res.status(200).json(project);
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
