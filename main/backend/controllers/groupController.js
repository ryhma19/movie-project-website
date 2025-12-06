import { createGroupDB, addMemberDB, removeMemberDB } from '../models/groupModel.js';

// Create a new group
export const createGroup = async (req, res) => {
  const { name, ownerId } = req.body;
  try {
    const { rows } = await createGroupDB(name, ownerId);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a member
export const addMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    await addMemberDB(groupId, userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a member
export const removeMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    await removeMemberDB(groupId, userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
