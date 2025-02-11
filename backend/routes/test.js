import express from "express";
import db from "../db/connection.js";
const router = express.Router();

let count = 0;

db.collection("test").findOne({ name: "clickNum" }, (err, result) => {
	count = result.value;
  });

router.get("/test/count", async (req, res) => {
  res.json({count});
});

router.patch("/test/increment", async (req,res) => {
	try {
		count += 1
		// Update the count in the database
		await db.collection("test").updateOne(
		{ name: "clickNum" },
		{ $set: { value: count } },
		);
		console.log("success")
		res.json({ count });
	} catch (err) {
		console.error(err);
		res.status(500).send("Error updating count");
	}
});

export default router;