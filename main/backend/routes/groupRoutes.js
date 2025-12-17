import express from 'express';
import {
  createGroup,
  addMember,
  removeMember,
  getAllGroups,
  getGroupById,
  deleteGroup,
  updateGroup,
  getGroupMembers,
  removeMemberAsOwner, 
} from '../controllers/groupController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST routes
router.post('/create', requireAuth, createGroup);
router.post('/add-member', requireAuth, addMember);
router.post('/remove-member', requireAuth, removeMember);

// GET routes
router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.get('/:id/members', getGroupMembers);

// PATCH route
router.patch('/:id', requireAuth, updateGroup);

// DELETE route
router.delete('/:id', requireAuth, deleteGroup);

// OWNER removes member
router.delete('/:id/members/:userId', requireAuth, removeMemberAsOwner);

export default router;
