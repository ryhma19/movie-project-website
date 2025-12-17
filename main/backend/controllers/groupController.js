import { pool } from '../src/db.js';
import { createGroupDB, addMemberDB, removeMemberDB } from '../models/groupModel.js';

/**
 * CREATE GROUP
 * owner_id = logged-in user
 * creator auto-joins group
 */
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

/**
 * JOIN GROUP
 */
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

/**
 * LEAVE GROUP (self)
 */
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

/**
 * GET ALL GROUPS
 */
export const getAllGroups = async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM groups');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET GROUP BY ID
 */
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

/**
 * DELETE GROUP (ONLY OWNER)
 */
export const deleteGroup = async (req, res) => {
  const groupId = Number(req.params.id);
  const userId = Number(req.user.id);

  try {
    const { rows } = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [groupId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (Number(rows[0].owner_id) !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this group' });
    }

    await pool.query('DELETE FROM groups WHERE id = $1', [groupId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE GROUP
 */
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

/**
 * OWNER REMOVES MEMBER
 * Only owner can remove other users
 */
export const removeMemberAsOwner = async (req, res) => {
  const groupId = Number(req.params.id);
  const targetUserId = Number(req.params.userId);
  const ownerId = Number(req.user.id);

  // prevent owner removing themselves
  if (targetUserId === ownerId) {
    return res.status(400).json({ error: 'Owner cannot remove themselves' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT owner_id FROM groups WHERE id = $1',
      [groupId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (Number(rows[0].owner_id) !== ownerId) {
      return res.status(403).json({ error: 'Only owner can remove members' });
    }

    await pool.query(
      'DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2',
      [groupId, targetUserId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error owner removing member:', err);
    res.status(500).json({ error: err.message });
  }
};
