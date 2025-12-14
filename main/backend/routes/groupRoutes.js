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
  } from '../controllers/groupController.js';

const router = express.Router();

// POST routes
router.post('/create', createGroup);         // Create a new group
router.post('/add-member', addMember);       // Add a user to a group
router.post('/remove-member', removeMember); // Remove a user from a group

// GET routes
router.get('/', getAllGroups);              // Get all groups
router.get('/:id', getGroupById);           // Get a single group by ID
router.get('/:id/members', getGroupMembers);

// PATCH route
router.patch('/:id', updateGroup);          // Update group name/description

// DELETE route
router.delete('/:id', deleteGroup);         // Delete a group by ID

export default router;
