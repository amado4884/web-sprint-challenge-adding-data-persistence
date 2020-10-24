const express = require("express");
const server = express();
const { Router: ProjectsRouter } = require("./projects");
const { Router: TasksRouter } = require("./tasks");
const { Router: ResourcesRouter } = require("./resources");

server.use(express.json());
server.use("/api/projects", ProjectsRouter);
server.use("/api/tasks", TasksRouter);
server.use("/api/resources", ResourcesRouter);

module.exports = server;
