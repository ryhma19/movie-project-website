// Tuodaan tietokantayhteys pool-muuttujasta
import { pool } from '../src/db.js';

// Funktio uuden ryhmän luomiseen tietokantaan
export const createGroupDB = (name, ownerId) => {
    return pool.query(
        // SQL-lause ryhmän lisäämiseksi
        `INSERT INTO groups (name, owner_id)
         VALUES ($1, $2)
         RETURNING *`, // RETURNING * palauttaa juuri lisätyn rivin
        [name, ownerId] 
    );
};

// Funktio jäsenen lisäämiseksi ryhmään
export const addMemberDB = (groupId, userId) => {
    return pool.query(
        // SQL-lause jäsenen lisäämiseksi group_memberships-tauluun
        `INSERT INTO group_memberships (group_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`, // Jos jäsen on jo ryhmässä ei tehdä mitään
        [groupId, userId] 
    );
};

// Funktio jäsenen poistamiseksi ryhmästä
export const removeMemberDB = (groupId, userId) => {
    return pool.query(
        // SQL-lause jäsenen poistamiseksi group_memberships-taulusta
        `DELETE FROM group_memberships
         WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId] 
    );
};

// Funktio ryhmän tietojen päivittämiseen (esim. nimi tai kuvaus)
export const updateGroupDB = (id, name, description) => {
    return pool.query(
        `UPDATE groups
         SET name = COALESCE($1, name),
             description = COALESCE($2, description)
         WHERE id = $3
         RETURNING *`, // RETURNING * palauttaa päivitetyn rivin
        [name, description, id]
    );
};
