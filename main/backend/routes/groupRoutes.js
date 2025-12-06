import express from 'express';
import { createGroup, addMember, removeMember } from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);
router.post('/add-member', addMember);
router.post('/remove-member', removeMember);

export default router;
