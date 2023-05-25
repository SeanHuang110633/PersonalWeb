const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// connect to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/PersonalWebDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to PersonalWebDB");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use("/api/user", authRoute);
// app.use(
//   "/api/journal",
//   passport.authenticate("jwt", { session: false }),
//   journalRoute
// );

app.listen(8080, () => {
  console.log("Sever is running on port 8080");
});
