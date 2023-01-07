require("dotenv").config({ path: "./config.env" });

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbo = require("./db/conn");

app.use(cors());
app.use(express.json());
app.use(require("./routes/users"));
app.use(require("./routes/student"));
app.use(require("./routes/professor"));
app.use(require("./routes/group"));
app.use(require("./routes/subject"));

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});