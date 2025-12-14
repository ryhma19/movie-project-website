import { pool } from '../src/db.js';
import { createGroupDB, addMemberDB, removeMemberDB } from '../models/groupModel.js';

// luodaan uusi ryhmä
export const createGroup = async (req, res) => {
  const { name, ownerId } = req.body;
  try {
    const result = await createGroupDB(name, ownerId);

    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to create group' });
    }

    const createdGroup = result.rows[0];

    // Automatically add creator as a member
    await addMemberDB(createdGroup.id, ownerId);

    console.log('Created group:', createdGroup);
    res.json(createdGroup);
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: err.message });
  }
};


// lisäätään jäsen
export const addMember = async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) return res.status(400).json({ error: 'groupId and userId required' });

  try {
    await pool.query(
      `INSERT INTO group_memberships (group_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [groupId, userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: err.message });
  }
};

// poistetaan jäsen
export const removeMember = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    await removeMemberDB(groupId, userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error removing member:', err); // debug log
    res.status(500).json({ error: err.message });
  }
};

// haetaan kaikki ryhmät
export const getAllGroups = async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM groups');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching all groups:', err);
    res.status(500).json({ error: err.message });
  }
};

// haetaan yksittäinen ryhmä ID:n perusteella
export const getGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Group not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching group by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a group by ID
export const deleteGroup = async (req, res) => {
  const { id } = req.params; // group ID from URL
  const { userId } = req.body; // user attempting deletion

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Fetch group owner
    const { rows } = await pool.query('SELECT owner_id FROM groups WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Group not found' });

    if (rows[0].owner_id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Only the group owner can delete this group' });
    }

    // Delete the group
    const { rowCount } = await pool.query('DELETE FROM groups WHERE id = $1', [id]);
    res.json({ success: true, message: 'Group deleted' });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: err.message });
  }
};


// Päivitetään ryhmän tiedot (esim. description)
export const updateGroup = async (req, res) => {
  const { id } = req.params; // group ID from URL
  const { name, description } = req.body; // fields to update

  try {
    const { rowCount, rows } = await pool.query(
      `UPDATE groups
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name, description, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating group:', err);
    res.status(500).json({ error: err.message });
  }
};

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
    console.error('Error fetching group members:', err);
    res.status(500).json({ error: err.message });
  }
};