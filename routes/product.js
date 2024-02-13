var express = require("express");
const dbCon = require("../dbConnect");
var router = express.Router();

router.put("/update/brand/ToyStory", async (req, res) => {
  try {
    const connection = await dbCon.getConnection();

    await connection.execute(`
    UPDATE product
    SET Brand = 'W'
    WHERE Description = 'Toy Story'
  `);
    connection.release();

    res.json({messages : 'Brand is Updated'});
  } catch (error) {
    console.error("Error fetching store data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
