const express = require("express");
const {
  getQuiz,
  updateQuiz,
  validateQuiz,
} = require("../controllers/quiz-controller");

const router = express.Router();

router.get("/", getQuiz);
router.put("/", validateQuiz, updateQuiz);

module.exports = router;
