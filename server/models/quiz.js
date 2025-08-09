const mongoose = require("mongoose");

// Схемы данных
const AnswerSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const QuestionSchema = new mongoose.Schema({
  text: String,
  answers: [AnswerSchema],
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, default: "Мой первый тест" },
  questions: [QuestionSchema],
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;
