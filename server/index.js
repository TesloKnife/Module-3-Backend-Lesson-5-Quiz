const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const quizRoutes = require("./routes/quiz");

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Роуты
app.use("/api/quiz", quizRoutes);

// Подключение к БД и запуск сервера
mongoose
  .connect("mongodb://user:mongopass@localhost:27017/quizdb?authSource=admin")
  .then(() => {
    console.log(chalk.green("MongoDB connected"));

    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  })
  .catch((err) => console.error(chalk.red("MongoDB connection error:"), err));
