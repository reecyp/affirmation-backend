import pool from "../config/db.js";

const createUserTable = async () => {
  const userTableQueryText = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
    `;

  const affCountTableQueryText = `
    CREATE TABLE IF NOT EXISTS affirmation_count (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    affirmation_number INT NOT NULL,
    affirmation_count INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
    `;

  const affListTableQueryText = `
    CREATE TABLE IF NOT EXISTS affirmation_list (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    affirmation VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
    `;

  const affActiontableQueryText = `
    CREATE TABLE IF NOT EXISTS affirmation_actions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    affirmation_number INT NOT NULL,
    action_text VARCHAR(255),
    action_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, affirmation_number, action_date)
);
    `;

  try {
    pool.query(userTableQueryText);
    console.log("User table created if not exists");
  } catch (error) {
    console.log("Error creating users table : ", error);
  }

  try {
    pool.query(affCountTableQueryText);
    console.log("affirmation_count table created if not exists");
  } catch (error) {
    console.log("Error creating affirmation_count table : ", error);
  }

  try {
    pool.query(affListTableQueryText);
    console.log("affirmation_list table created if not exists");
  } catch (error) {
    console.log("Error creating affirmation_list table : ", error);
  }

  try {
    pool.query(affActiontableQueryText);
    console.log("affirmation_actions table created if not exists");
  } catch (error) {
    console.log("Error creating affirmation_actions table : ", error);
  }
};

export default createUserTable;
