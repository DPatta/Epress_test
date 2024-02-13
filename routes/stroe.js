var express = require("express");
const dbCon = require("../dbConnect");
var router = express.Router();

router.get("/newyork", async (req, res) => {
    try {
        // const region = req.params.region
        const connection = await dbCon.getConnection();
    
        const [rows] = await connection.query(`
          SELECT *
          FROM store
          WHERE Region = 'New York'
        `);
        connection.release();
    
        res.json(rows);
      } catch (error) {
        console.error('Error fetching store data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});
module.exports = router;
