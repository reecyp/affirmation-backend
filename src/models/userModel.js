import pool from "../config/db.js";

export const getAllUsersService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUsersByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUserService = async (name, email, password) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
};

export const createUserActionsService = async (id) => {
  for (let i = 0; i < 3; i++) {
    let count = i + 1;
    const result = await pool.query(
      "INSERT INTO affirmation_actions (user_id, affirmation_number) VALUES ($1, $2) RETURNING *",
      [id, count]
    );
    console.log(`Action row ${count} created for user ${id}`);
  }
};

export const addUserAffirmationCount = async (id) => {
  for (let i = 0; i < 3; i++) {
    let count = i + 1;
    const result = await pool.query(
      "INSERT INTO affirmation_count (user_id, affirmation_number, affirmation_count, last_updated) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [id, count, 0]
    );
    console.log(`Affirmation count: ${count} added`);
  }
};

export const increaseAffirmation = async (id, affNum) => {
  try {
    const result = await pool.query(
      `UPDATE affirmation_count 
      SET affirmation_count = affirmation_count + 1 
      WHERE user_id = $1 AND affirmation_number = $2
      RETURNING *;
      `,
      [id, affNum]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error increasing affirmation:", error);
    throw error;
  }
};

export const changeAction = async (id, action, actionNum) => {
  try {
    const result = await pool.query(
      `UPDATE affirmation_actions 
      SET action_text = $1
      WHERE user_id = $2 
      AND affirmation_number = $3
      RETURNING *;
      `,
      [action, id, actionNum]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error changing action:", error);
    throw error;
  }
};

export const getUserAffDataService = async (id) => {
  try {
    const checkDate = await pool.query(
      `SELECT last_updated FROM affirmation_count
      WHERE user_id = $1 LIMIT 1`,
      [id]
    );

    if (checkDate.rows.length > 0) {
      const lastUpdate = new Date(checkDate.rows[0].last_updated);

      // Convert both to CST
      const now = new Date();
      const lastUpdateCST = new Date(
        lastUpdate.toLocaleString("en-US", { timeZone: "America/Chicago" })
      );
      const todayCST = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Chicago" })
      );

      // Compare date components (ignore time)
      const lastUpdateDate = new Date(
        lastUpdateCST.getFullYear(),
        lastUpdateCST.getMonth(),
        lastUpdateCST.getDate()
      );
      const todayDate = new Date(
        todayCST.getFullYear(),
        todayCST.getMonth(),
        todayCST.getDate()
      );

      console.log("Last update:", lastUpdateDate.toLocaleDateString("en-US"));
      console.log("Today:", todayDate.toLocaleDateString("en-US"));
      console.log(
        "Are they different?",
        lastUpdateDate.getTime() !== todayDate.getTime()
      );

      // Reset if different day
      if (lastUpdateDate.getTime() !== todayDate.getTime()) {
        await pool.query(
          `UPDATE affirmation_count
          SET affirmation_count = 0, last_updated = CURRENT_TIMESTAMP
          WHERE user_id = $1;`,
          [id]
        );

        await pool.query(
          `UPDATE affirmation_actions
          SET action_text = NULL, action_date = CURRENT_DATE
          WHERE user_id = $1;`,
          [id]
        );
        
        console.log("Actions reset for new day");
      }
    }

    const affCountResult = await pool.query(
      `SELECT * FROM affirmation_count WHERE user_id = $1;`,
      [id]
    );

    const affListResult = await pool.query(
      `SELECT * FROM affirmation_list WHERE user_id = $1;`,
      [id]
    );

    return { affCount: affCountResult.rows, affList: affListResult };
  } catch (err) {
    console.error("Error in getUserAffDataService:", err);
    throw err;
  }
};

export const createUserAffirmation = async (id, affirmation) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO affirmation_list (user_id, affirmation) VALUES ($1, $2) RETURNING *;
      `,
      [id, affirmation]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error adding affirmation:", error);
    throw error;
  }
};

export const resetUserAffCountAndActionService = async (id) => {
  try {
    // Reset affirmation counts
    const countResult = await pool.query(
      `UPDATE affirmation_count 
       SET affirmation_count = 0, last_updated = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING *;`,
      [id]
    );

    // Reset action texts
    const actionResult = await pool.query(
      `UPDATE affirmation_actions 
       SET action_text = NULL, created_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING *;`,
      [id]
    );

    console.log(`Reset complete for user ${id}`);
    return {
      affirmations: countResult.rows,
      actions: actionResult.rows
    };
  } catch (error) {
    console.error("Error resetting affirmation count and actions:", error);
    throw error;
  }
};

export const deleteUserAffirmation = async (id) => {
  try {
    const result = await pool.query(
      `
        DELETE FROM affirmation_list 
        WHERE id = $1;
      `,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting affirmation:", error);
    throw error;
  }
};

export const getUserActionsService = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM affirmation_actions WHERE user_id = $1 ORDER BY affirmation_number;`,
      [id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user actions:", error);
    throw error;
  }
};

export const updateUserService = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
    [name, email, id]
  );
  return result.rows[0];
};
export const deleteUserService = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
