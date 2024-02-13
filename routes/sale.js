var express = require("express");
const dbCon = require("../dbConnect");
var router = express.Router();

router.get("/product/newyork", async (req, res) => {
  try {
    const connection = await dbCon.getConnection();

    const [rows] = await connection.query(`
      SELECT p. *
      FROM product p
      JOIN sale_fact sf ON p.Product_key = sf.product_key
      JOIN store s ON sf.store_key = s.Store_key
      WHERE s.City = 'New York'
    `);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error("Error fetching store data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/profit/newyork", async (req, res) => {
  try {
    const connection = await dbCon.getConnection();

    const [rows] = await connection.query(`
      SELECT SUM(profit) AS total_profit
      FROM sale_fact sf
      JOIN store s ON sf.store_key = s.Store_key
      WHERE s.City = 'New York'
    `);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error("Error fetching store data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/delete/wolf", async (req, res) => {
  try {
    const connection = await dbCon.getConnection();

    await connection.execute(`
      DELETE sf. *
      FROM sale_fact sf
      JOIN product p ON sf.product_key = p.Product_key
      WHERE p.Brand = 'Wolf'
    `);
    connection.release();

    res.json({messages : 'Data is Deleted'});
  } catch (error) {
    console.error("Error fetching store data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
