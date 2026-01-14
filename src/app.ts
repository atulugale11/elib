import express = require("express");
const app = express();

//roues
//HTTP methods:GET,POST,PUT,PATCH,DELETE
app.get("/", (req, res, next) => {
   res.json({ message: "Welcome to elib apis" });
});
export default app;
