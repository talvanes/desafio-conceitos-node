const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepoId(request, response, next) {
  // Take the Repo ID
  const {id} = request.params;

  // Check UUID
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repo ID.' })
  }

  return next();
}

function validateRepoIndex(request, response, next) {
  // Take the Repo ID
  const {id} = request.params;

  // Check Repo Index
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repo not found.' });
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  // list all repos
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // request body params
  const {title, url, techs} = request.body;

  // create a new repo
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);

  // 201 Created
  return response.status(201).json(repo);
});

app.put("/repositories/:id", validateRepoId, validateRepoIndex, (request, response) => {
  // only update this resource
  const {id} = request.params;
  const {title, url, techs} = request.body;
  
  // update repo
  const index = repositories.findIndex(repo => repo.id === id);
  const repo = Object.assign(repositories[index], {title, url, techs});
  repositories[index] = repo;

  // 200 OK
  return response.json(repo);
});

app.delete("/repositories/:id", validateRepoId, validateRepoIndex, (request, response) => {
  // only delete this resoruce
  const {id} = request.params;
  
  // delete repo
  const index = repositories.findIndex(repo => repo.id === id);
  repositories.splice(index, 1);

  // 204 No content
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepoId, validateRepoIndex, (request, response) => {
  // only "like" this repo
  const {id} = request.params;
  
  // "like" the repo
  const index = repositories.findIndex(repo => repo.id === id);
  const repo = repositories[index];
  repo.likes += 1;
  repositories[index] = repo;

  // 200 OK
  return response.json(repo);
});

module.exports = app;
