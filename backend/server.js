import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import uploads from "./routes/uploads.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'] }));
app.use(express.json());
app.use("/users", users)
app.use("/uploads", uploads)

// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
  });
  
export default app;