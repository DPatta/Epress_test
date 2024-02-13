var express = require("express");
var router = express.Router();
const dbCon = require("../dbConnect");
const fs = require("fs").promises;
const path = require('path');
router.get("/", async function (req, res, next) {
  try {
    const connection = await dbCon.getConnection();
    const [rows] = await connection.query("SELECT * FROM users");
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const userArr = req.body;
    for (const user of userArr) {
      const { firstName, lastName, gender, birthDate, image } = user;
      const imageData = Buffer.from(image, "base64");
      const imageName = `user_.${firstName}-${Dtae.now()}.png`;
      const imagePath = path.join(__dirname, "../base64/images", imageName);
      await fs.writeFile(imagePath, imageData);

      const connection = await dbCon.getConnection();
      await connection.query(
        "INSERT INTO users (firstName, lastName, gender,birthDate, image) VALUES (?, ?, ?, ?,?)",
        [firstName, lastName, gender, birthDate, imageName]
      );
      connection.release();
      res.json({ status: "Success", user: req.body });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

router.get("/:nameSurname", async (req, res, next) => {
  try {
    const nameSurname = req.params.nameSurname;

    const connection = await dbCon.getConnection();

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE firstName = ? OR lastName = ?",
      [nameSurname, nameSurname]
    );
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error("Error fetching users by name or surname:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const userId = req.params.id;
    const userArr = req.body;

    const connection = await dbCon.getConnection();

    const [rowUser] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    const currentUserData = rowUser[0];

    let updateQuery = "UPDATE users SET";
    const updateValues = [];

    for (const user of userArr) {
      const { firstName, lastName, gender, birthDate, image } = user;
      if (firstName !== null && firstName !== undefined) {
        updateQuery += " firstName = ?,";
        updateValues.push(firstName);
      } else {
        updateQuery += " firstName = ?,";
        updateValues.push(currentUserData.firstName);
      }

      if (lastName !== null && lastName !== undefined) {
        updateQuery += " lastName = ?,";
        updateValues.push(lastName);
      } else {
        updateQuery += " lastName = ?,";
        updateValues.push(currentUserData.lastName);
      }

      if (gender !== null && gender !== undefined) {
        updateQuery += " gender = ?,";
        updateValues.push(gender);
      } else {
        updateQuery += " gender = ?,";
        updateValues.push(currentUserData.gender);
      }
      if (birthDate !== null && gender !== undefined) {
        updateQuery += " birthDate = ?,";
        updateValues.push(birthDate);
      } else {
        updateQuery += " birthDate = ?,";
        updateValues.push(currentUserData.birthDate);
      }
      if (image !== null && image !== undefined) {
        const imageData = Buffer.from(image, "base64");
        const imageName = `user_.${firstName}-${Date.now()}.png`;
        const imagePath = path.join(__dirname, "../base64/images", imageName);
        await fs.writeFile(imagePath, imageData);
        updateQuery += " image = ?,";
        updateValues.push(imageName);
      } else {
        updateQuery += " image = ?,";
        updateValues.push(currentUserData.image);
      }
    }

    updateQuery = updateQuery.slice(0, -1);

    updateQuery += " WHERE id = ?";
    updateValues.push(userId);

    const [result] = await connection.query(updateQuery, updateValues);

    connection.release();

    
    if (result.affectedRows > 0) {
      res.json({ status: "Success", udate: req.body, message: "User updated" });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const userId = req.params.id;

    const connection = await dbCon.getConnection();

    const [result] = await connection.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    connection.release();

    if (result.affectedRows > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
