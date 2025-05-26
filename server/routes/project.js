import express from 'express';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protectRoute } from '../middlewares/authMiddlewear.js';

const router = express.Router();

router.get('/all', protectRoute, getAllProjects);
router.post('/create', protectRoute, createProject);
router.put('/:id', protectRoute, updateProject);
router.delete('/:id', protectRoute, deleteProject);

export default router; 