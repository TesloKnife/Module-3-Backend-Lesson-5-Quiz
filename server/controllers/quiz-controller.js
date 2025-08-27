const Quiz = require("../models/quiz");

// Валидация данных
const validateQuiz = (req, res, next) => {
  const { title, questions } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Invalid title" });
  }

  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: "Questions must be an array" });
  }

  for (const question of questions) {
    if (!question.text || typeof question.text !== "string") {
      return res.status(400).json({ error: "Invalid question text" });
    }

    if (!Array.isArray(question.answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }

    for (const answer of question.answers) {
      if (!answer.text || typeof answer.text !== "string") {
        return res.status(400).json({ error: "Invalid answer text" });
      }
      if (typeof answer.isCorrect !== "boolean") {
        return res.status(400).json({ error: "isCorrect must be boolean" });
      }
    }
  }

  next();
};

// Получение квиза
const getQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findOne();
    if (!quiz) {
      quiz = await createDefaultQuiz();
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Обновление квиза
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true, // Включаем валидацию Mongoose
    });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Создание дефолтного квиза
const createDefaultQuiz = async () => {
  return await Quiz.create({
    title: "Мой первый тест",
    questions: [
      {
        text: "Какой язык программирования вы изучаете?",
        answers: [
          { text: "JS", isCorrect: true },
          { text: "Python", isCorrect: false },
        ],
      },
      {
        text: "Сколько родительских HTML тегов может быть выведено в React JS компоненте?",
        answers: [
          { text: "Всегда 1", isCorrect: true },
          { text: "Не более 3", isCorrect: false },
          { text: "Не более 10", isCorrect: false },
          { text: "Неограниченное количество", isCorrect: false },
          { text: "Не более 5", isCorrect: false },
        ],
      },
      {
        text: "Как много компонентов может быть на сайте?",
        answers: [
          { text: "Не более 300", isCorrect: false },
          { text: "Неограниченное количество", isCorrect: true },
          { text: "Не более 50", isCorrect: false },
          { text: "Не более 10", isCorrect: false },
          { text: "Не более 100", isCorrect: false },
        ],
      },
    ],
  });
};

module.exports = {
  getQuiz,
  updateQuiz,
  validateQuiz,
};
