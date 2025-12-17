import { pool } from '../src/db.js';
import { createGroupDB, addMemberDB, removeMemberDB } from '../models/groupModel.js';


export const createGroup = async (req, res) => {
  const { name } = req.body;
  const ownerId = req.user.id; 

  if (!name) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  try {
    const result = await createGroupDB(name, ownerId);

    const createdGroup = result.rows[0];

    // creator automatically joins
    await addMemberDB(createdGroup.id, ownerId);

    res.status(201).json(createdGroup);
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: err.message });
  }
};


export const addMember = async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  if (!groupId) {
    return res.status(400).json({ error: 'groupId required' });
  }

  try {
    await addMemberDB(groupId, userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: err.message });
  }
};


export const removeMember = async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  try {
    await removeMemberDB(groupId, userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: err.message });
  }
};


export const getAllGroups = async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM groups');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM groups WHERE id = $1',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [groupId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (rows[0].owner_id !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this group' });
    }

    await pool.query('DELETE FROM groups WHERE id = $1', [groupId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: err.message });
  }
};


export const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE groups
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name, description, id]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET MEMBERS
 */
export const getGroupMembers = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.display_name
       FROM users u
       JOIN group_memberships gm ON gm.user_id = u.id
       WHERE gm.group_id = $1`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
