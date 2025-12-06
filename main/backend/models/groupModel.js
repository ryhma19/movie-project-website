import { pool } from '../src/db.js';

export const createGroupDB = (name, ownerId) => {
    return pool.query(
        `INSERT INTO groups (name, owner_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name, ownerId]
    );
};

export const addMemberDB = (groupId, userId) => {
    return pool.query(
        `INSERT INTO group_memberships (group_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [groupId, userId]
    );
};

export const removeMemberDB = (groupId, userId) => {
    return pool.query(
        `DELETE FROM group_memberships
         WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
    );
};
