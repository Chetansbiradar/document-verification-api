require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const mongoose = require("mongoose");
const MONGO_URI = process.env.DATABASE_URL;

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to DB");
  }
);

const authRouter = require("./routes/auth");
app.use("/api/auth/", authRouter);

const adminRouter = require("./routes/admin")
app.use("/api/admin/", adminRouter);

const postRouter = require("./routes/post")
app.use("/api/post/", postRouter);

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
