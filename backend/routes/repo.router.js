const express = require('express')
const { getAllRepositories,CreateRepository,fetchRepositoryById,fetchRepositoryByName,fetchRepositoryForCurrentUser,updateRepositoryById,ToogleVisibilityById,DeleteRepository} = require('../controllers/repoController.js');
const { auth } = require('../middleware/auth.js');

const RepoRouter = express.Router();



RepoRouter.get('/repo/user',auth,fetchRepositoryForCurrentUser);
RepoRouter.post('/repo/create',CreateRepository);
RepoRouter.get('/repo/all',getAllRepositories);
RepoRouter.get('/repo/:id',fetchRepositoryById);
RepoRouter.get('/repo/name/:name',fetchRepositoryByName);
RepoRouter.put('/repo/update/:id',auth,updateRepositoryById);
RepoRouter.delete('/repo/delete/:id',auth,DeleteRepository);
RepoRouter.patch('/repo/toogle/:id',auth,ToogleVisibilityById)





module.exports = {RepoRouter}