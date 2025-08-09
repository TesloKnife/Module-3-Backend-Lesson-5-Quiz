import axios from 'axios';

const API_URL = 'http://localhost:3000/api/quiz';

export const getQuiz = () => axios.get(API_URL);
export const updateQuiz = (quizData) => axios.put(API_URL, quizData);
