// ---------------------Model-------------------------
const knex = require("knex");
const knexFile = require("../knexfile");
const devMode = process.env.ENV_MODE || "development";
const db = knex(knexFile[devMode]);

const find = async () => {
  try {
    return await db("resources");
  } catch (err) {
    console.log("Could not find (resources): ", err.message);
  }
};

const findById = async (id) => {
  try {
    return await db("resources").where({ id }).first();
  } catch (err) {
    console.log("Could not findById (resources): ", err.message);
  }
};

const findByProject = async (project_id) => {
  try {
    const resourceIds = await db("resource_project")
      .select("resource_id")
      .where({ project_id });
    return await db("resources").whereIn(
      "id",
      resourceIds.map((resource) => resource.resource_id)
    );
  } catch (err) {
    console.log("Could not find resources by project id");
  }
};

const findProjects = async (resource_id) => {
  try {
    const projectIds = await db("resource_project")
      .select("project_id")
      .where({ resource_id });
    return await db("projects").whereIn(
      "id",
      projectIds.map((project) => project.project_id)
    );
  } catch (err) {}
};

const addResource = async (resource) => {
  try {
    const [id] = await db("resources").insert(resource);
    return findById(id);
  } catch (err) {
    console.log("Could not add a new resource", err.message);
  }
};

// ---------------------Route-------------------------
const express = require("express");
const Router = express.Router();

const validateId = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Invalid Resource ID" });
  try {
    const resource = await findById(id);
    if (!resource)
      return res
        .status(400)
        .json({ message: "No resource found with that ID" });
    req.resource = resource;
    next();
  } catch (err) {
    console.log("Could not validate the resource id: ", err);
    return res.status(500).json({ message: err.message });
  }
};

Router.get("/", async (req, res) => {
  try {
    const resources = await find();
    return res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/:id", validateId, (req, res) => {
  return res.status(200).json(req.resource);
});

Router.get("/:id/projects", validateId, async (req, res) => {
  try {
    const projects = await findProjects(req.resource.id);
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(200).json(req.resource);
  }
});

Router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name)
    return res
      .status(500)
      .json({ message: "Please add a name for this resource" });

  try {
    const resource = await addResource({ name, description });
    return res.status(200).json(resource);
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
