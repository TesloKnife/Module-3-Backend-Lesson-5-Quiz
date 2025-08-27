const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
    minlength: 3,
  },
  answers: {
    type: [AnswerSchema],
    validate: {
      validator: function (answers) {
        return answers.length >= 2; // Минимум 2 ответа
      },
      message: "Question must have at least 2 answers",
    },
  },
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    default: "Мой первый тест",
  },
  questions: {
    type: [QuestionSchema],
    validate: {
      validator: function (questions) {
        return questions.length >= 1; // Минимум 1 вопрос
      },
      message: "Quiz must have at least 1 question",
    },
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
