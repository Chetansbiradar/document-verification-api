require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
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

// const postRouter = require("./routes/post")
// app.use(express.urlencoded({ extended: true }))
// app.get("/api/test/", (req,res)=>{
//   console.log(req)
// });

const authRouter = require("./routes/auth");
app.use("/api/auth/", authRouter);

const adminRouter = require("./routes/admin");
app.use("/api/admin/", adminRouter);

const docsRouter = require("./routes/docs");
app.use("/api/docs/", docsRouter);

const testRouter = require("./routes/test");
app.use("/api/subject/", testRouter);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require("./apiDocs/swagger.json")
var options = {
  customJs: '/custom.js'
};
app.use('/api/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
