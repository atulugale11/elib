import express = require("express");
import createHttpError = require("http-errors");
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();
app.use(express.json());

// Routes
app.get("/", (req, res) => {
   res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRouter);

// Global error handler (always last)
app.use(globalErrorHandler);

export default app;
