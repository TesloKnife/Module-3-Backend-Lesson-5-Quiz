const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const Quiz = require("./models/quiz");

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Роуты

app.get("/api/quiz", async (req, res) => {
  try {
    // Проверка на наличие теста
    let quiz = await Quiz.findOne();
    if (!quiz) {
      quiz = await Quiz.create({
        title: "Мой первый тест",
        questions: [
          {
            text: "Какой язык программирования вы изучаете?",
            answers: [
              { text: "JS", isCorrect: true },
              { text: "Python", isCorrect: false },
            ],
          },
        ],
      });
      console.log("Default quiz created:", quiz);
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/quiz", async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
