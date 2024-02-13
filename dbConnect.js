const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const dbConnection = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "express_test",
};
const dbCon = mysql.createPool(dbConnection);

dbCon.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release();
});

module.exports = dbCon;

async function createStoreTable() {
  const connection = await mysql.createConnection(dbConnection);

  try {
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS store (
      Store_key INT PRIMARY KEY,
      City VARCHAR(255) NOT NULL,
      Region VARCHAR(255) NOT NULL
    )
        `);
    await connection.query(`
    INSERT IGNORE INTO store (Store_key, City, Region) VALUES
    ('1','New York', 'East'),
    ('2','Chicago', 'Central'),
    ('3','Atlanta', 'East'),
    ('4','Los Angeles', 'West'),
    ('5','San Francisco', 'West'),
    ('6','Philadelphia', 'East')
`);

    console.log("Store table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    await connection.end();
  }
  return true;
}
async function createProductTable() {
  const connection = await mysql.createConnection(dbConnection);

  try {
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS product (
      Product_key INT PRIMARY KEY,
      Description VARCHAR(255) NOT NULL,
      Brand VARCHAR(255) NOT NULL
    )
        `);
    await connection.query(`
    INSERT IGNORE INTO product (Product_key, Description, Brand) VALUES
    ('1','Beatiful Girls', 'MKF Studios'),
    ('2','Toy Story', 'Wolf'),
    ('3','Sense and Sensibiblity', 'Parabuster Inc.'),
    ('4','Holiday of the Year', 'Wolf'),
    ('5','Pulp Fiction', 'MKF Studios'),
    ('6','The Juror', 'MKF Studios'),
    ('7','Some Dusl Till Dawn', 'Parabuster Inc.'),
    ('8','Hellraiser: Bloodline', 'Big Studioss')
`);

    console.log("product table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    await connection.end();
  }
  return true;
}
async function createSaleFactTable() {
  const connection = await mysql.createConnection(dbConnection);

  try {
    await connection.query(`
    CREATE TABLE IF NOT EXISTS sale_fact (
      sale_fect_id INT PRIMARY KEY,
      store_key INT,
      product_key INT,
      sale DECIMAL(10, 2) NOT NULL,
      cost DECIMAL(10, 2) NOT NULL,
      profit DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (store_key) REFERENCES store(Store_key),
      FOREIGN KEY (product_key) REFERENCES product(Product_key)
    )
      `);
    await connection.query(`
      INSERT IGNORE INTO sale_fact (sale_fect_id ,store_key, product_key, sale, cost, profit) VALUES
      (1, 1, 6, 1, 2, 3),
      (2, 1, 2, 1, 2, 3),
      (3, 2, 7, 1, 2, 3),
      (4, 3, 2, 1, 2, 3),
      (5, 5, 3, 1, 2, 3),
      (6, 5, 1, 1, 2, 3)
  `);

    console.log("sale_fact table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    await connection.end();
  }
}

async function createUsersTable() {
  const connection = await mysql.createConnection(dbConnection);

  try {
    await connection.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            gender VARCHAR(255) NOT NULL,
            birthDate VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL
          )
        `);
    // console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    await connection.end();
  }
}

createStoreTable();
createProductTable();
setTimeout(() => {
  createSaleFactTable();
}, 1000);
createUsersTable();
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
