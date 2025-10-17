const express = require('express')
const { getAllRepositories,CreateRepository,fetchRepositoryById,fetchRepositoryByName,fetchRepositoryForCurrentUser,updateRepositoryById,ToogleVisibilityById,DeleteRepository} = require('../controllers/repoController.js')

const RepoRouter = express.Router();



RepoRouter.post('/repo/create',CreateRepository);
RepoRouter.get('/repo/all',getAllRepositories);
RepoRouter.get('/repo/:id',fetchRepositoryById);
RepoRouter.get('/repo/:name',fetchRepositoryByName);
RepoRouter.get('/repo/:userId',fetchRepositoryForCurrentUser);
RepoRouter.put('/repo/update/:id',updateRepositoryById);
RepoRouter.delete('/repo/delete/:id',DeleteRepository);
RepoRouter.patch('/repo/toogle/:id',ToogleVisibilityById)





module.exports = {RepoRouter}