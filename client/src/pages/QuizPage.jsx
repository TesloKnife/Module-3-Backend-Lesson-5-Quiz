import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuiz } from '../services/quiz-service';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const QuizPageContainer = ({ className }) => {
	const [quiz, setQuiz] = useState(null); // Хранит весь тест из БД
	const [currentIndex, setCurrentIndex] = useState(0); // Текущий вопрос
	const [selectedAnswer, setSelectedAnswer] = useState(null); // Выбранный ответ
	const [results, setResults] = useState([]); // Результаты ответов
	const [isFinished, setIsFinished] = useState(false); // Завершен ли тест
	const [score, setScore] = useState(0); // Количество правильных ответов
	const [isLoading, setIsLoading] = useState(true); // Добавляем флаг загрузки
	const navigate = useNavigate();

	// Загрузка теста при монтировании компонента
	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const { data } = await getQuiz();
				setQuiz(data);
			} catch (error) {
				console.error('Ошибка загрузки теста:', error);
				navigate('/');
			} finally {
				setIsLoading(false); // Загрузка завершена в любом случае
			}
		};
		fetchQuiz();
	}, [navigate]);

	// Обработчик выбора ответа
	const handleAnswerSelect = (answerIndex) => {
		setSelectedAnswer(answerIndex);

		// Обновляем результаты
		const newResults = [...results];
		newResults[currentIndex] = {
			answerIndex,
			isCorrect: quiz.questions[currentIndex].answers[answerIndex].isCorrect,
		};
		setResults(newResults);
	};

	// Переход к предыдущему вопросу
	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			// Восстанавливаем выбранный ответ для этого вопроса
			setSelectedAnswer(results[currentIndex - 1]?.answerIndex ?? null);
		}
	};

	// Переход к следующему вопросу или завершение
	const handleNext = () => {
		if (currentIndex < quiz.questions.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setSelectedAnswer(results[currentIndex + 1]?.answerIndex ?? null);
		} else {
			finishQuiz();
		}
	};

	// Завершение теста и подсчет результатов
	const finishQuiz = () => {
		const correctCount = results.reduce(
			(count, result) => (result?.isCorrect ? count + 1 : count),
			0,
		);
		const answers = results.map((item) => item.isCorrect);
		setScore(correctCount);
		setIsFinished(true);

		// Сохраняем в историю
		const historyRecord = {
			date: new Date().toLocaleString(),
			answers,
			totalQuestions: quiz.questions.length,
			correctAnswers: correctCount,
		};

		const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
		localStorage.setItem('quizHistory', JSON.stringify([...history, historyRecord]));
	};

	// Начать тест заново
	const restartQuiz = () => {
		setCurrentIndex(0);
		setSelectedAnswer(null);
		setResults([]);
		setIsFinished(false);
		setScore(0);
	};

	if (isFinished) {
		return (
			<div className={className}>
				<h2 className="result-title">Правильных ответов:</h2>
				<p className="result-score">
					<span>{score}</span>
					<span className="separator">/</span>
					<span>{quiz.questions.length}</span>
				</p>
				<div className="buttons">
					<button className="btn" onClick={() => navigate('/')}>
						На главную
					</button>
					<button className="btn" onClick={restartQuiz}>
						Пройти еще раз
					</button>
				</div>
			</div>
		);
	}

	// Показываем лоадер при загрузке
	if (isLoading) return <div className={className}>Загрузка...</div>;

	if (!quiz) return <div className={className}>Не удалось загрузить тест</div>;

	const currentQuestion = quiz.questions[currentIndex];
	const isLastQuestion = currentIndex === quiz.questions.length - 1;

	return (
		<div className={className}>
			<h3>
				Вопрос {currentIndex + 1} из {quiz.questions.length}
			</h3>
			<h4>{currentQuestion.text}</h4>

			<div className="answers">
				{currentQuestion.answers.map((answer, index) => (
					<div key={index}>
						<input
							type="radio"
							id={`answer-${index}`}
							name="answer"
							checked={selectedAnswer === index}
							onChange={() => handleAnswerSelect(index)}
						/>
						<label htmlFor={`answer-${index}`}>{answer.text}</label>
					</div>
				))}
			</div>

			<div className="buttons">
				<button
					className="btn"
					onClick={handlePrev}
					disabled={currentIndex === 0}
				>
					Предыдущий вопрос
				</button>
				<button
					className="btn"
					onClick={handleNext}
					disabled={selectedAnswer === null}
				>
					{isLastQuestion ? 'Завершить' : 'Следующий вопрос'}
				</button>
			</div>
		</div>
	);
};

QuizPageContainer.propTypes = {
	className: PropTypes.string,
};

export const QuizPage = styled(QuizPageContainer)`
	font-family: Arial, sans-serif;
	color: #222;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 20px;
	box-sizing: border-box;

	.answers {
		min-width: 350px;
		padding: 10px 15px;
		margin: 5px 0;
		background: ${(props) => (props.selected ? '#e3f2fd' : '#f5f5f5')};
		font-size: 20px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: #e3f2fd;
		}
	}

	.answers > div {
		margin-bottom: 15px; /* Отступ снизу каждого элемента */
	}

	/* Для последнего элемента убираем отступ */
	.answers > div:last-child {
		margin-bottom: 0;
	}

	.buttons {
		display: flex;
		gap: 20px;
		margin-bottom: 30px;
	}

	.btn {
		margin-top: 50px;
		padding: 18px 32px;
		font-size: 18px;
		font-weight: 500;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 400px;
		min-height: 90px;

		&:hover {
			background: #f5f5f5;
		}
	}

	.result-title {
		font-size: 30px;
		margin-bottom: 20px;
		color: #333;
	}

	.result-score {
		font-size: 40px;
		margin: 10px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #4caf50;
	}

	.separator {
		margin: 0 5px;
	}
`;
