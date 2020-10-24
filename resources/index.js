// ---------------------Model-------------------------
const knex = require("knex");
const knexFile = require("../knexfile");
const devMode = process.env.ENV_MODE || "development";
const db = knex(knexFile[devMode])("resources");

const find = async () => {
  try {
    return await db;
  } catch (err) {
    console.log("Could not find (resources): ", err.message);
  }
};

const findById = async (id) => {
  try {
    return await db.where({ id }).first();
  } catch (err) {
    console.log("Could not findById (resources): ", err.message);
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

module.exports = {
  Router,
  Model: {
    find,
    findById,
  },
};
