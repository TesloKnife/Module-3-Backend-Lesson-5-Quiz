import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getQuiz, updateQuiz } from '../services/quiz-service';

const EditPageContainer = ({ className }) => {
	const [quiz, setQuiz] = useState(null);
	const [expandedQuestions, setExpandedQuestions] = useState([]);
	const navigate = useNavigate();

	// Загрузка теста при монтировании
	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const { data } = await getQuiz();
				setQuiz(data);
				// Инициализируем массив раскрытых вопросов
				setExpandedQuestions(data?.questions.map(() => false) || []);
			} catch (error) {
				console.error('Ошибка загрузки теста:', error);
			}
		};
		fetchQuiz();
	}, []);

	// Переключение раскрытия вопроса
	const toggleQuestion = (index) => {
		const newExpanded = [...expandedQuestions];
		newExpanded[index] = !newExpanded[index];
		setExpandedQuestions(newExpanded);
	};

	// Изменение текста вопроса
	const handleQuestionChange = (qIndex, value) => {
		const newQuiz = { ...quiz };
		newQuiz.questions[qIndex].text = value;
		setQuiz(newQuiz);
	};

	// Изменение текста ответа
	const handleAnswerChange = (qIndex, aIndex, value) => {
		const newQuiz = { ...quiz };
		newQuiz.questions[qIndex].answers[aIndex].text = value;
		setQuiz(newQuiz);
	};

	// Изменение правильного ответа
	const handleCorrectChange = (qIndex, aIndex) => {
		const newQuiz = { ...quiz };
		const question = newQuiz.questions[qIndex];
		question.answers.forEach((answer, idx) => {
			answer.isCorrect = idx === aIndex;
		});
		setQuiz(newQuiz);
	};

	// Добавление нового ответа
	const addAnswer = (qIndex) => {
		const newQuiz = { ...quiz };
		newQuiz.questions[qIndex].answers.push({
			text: '',
			isCorrect: false,
		});
		setQuiz(newQuiz);
	};

	// Удаление ответа
	const removeAnswer = (qIndex, aIndex) => {
		const newQuiz = { ...quiz };
		newQuiz.questions[qIndex].answers.splice(aIndex, 1);
		setQuiz(newQuiz);
	};

	// Добавление нового вопроса
	const addQuestion = () => {
		const newQuiz = { ...quiz };
		newQuiz.questions.push({
			text: 'Новый вопрос',
			answers: [
				{ text: 'Вариант ответа 1', isCorrect: true },
				{ text: 'Вариант ответа 2', isCorrect: false },
			],
		});
		setQuiz(newQuiz);
		setExpandedQuestions([...expandedQuestions, true]);
	};

	// Удаление вопроса
	const removeQuestion = (qIndex) => {
		const newQuiz = { ...quiz };
		newQuiz.questions.splice(qIndex, 1);
		setQuiz(newQuiz);

		const newExpanded = [...expandedQuestions];
		newExpanded.splice(qIndex, 1);
		setExpandedQuestions(newExpanded);
	};

	// Сохранение теста
	const handleSave = async () => {
		try {
			await updateQuiz(quiz);
			navigate('/');
		} catch (error) {
			console.error('Ошибка сохранения теста:', error);
			alert('Не удалось сохранить тест');
		}
	};

	if (!quiz) return <div className={className}>Не удалось загрузить тест</div>;

	return (
		<div className={className}>
			<h1>Редактирование теста</h1>

			{quiz.questions.map((question, qIndex) => (
				<div className="question-block" key={qIndex}>
					<div
						className="question-header"
						onClick={() => toggleQuestion(qIndex)}
					>
						<span style={{ marginRight: '10px' }}>
							{expandedQuestions[qIndex] ? '▼' : '▶'}
						</span>
						<span>{question.text || `Вопрос ${qIndex + 1}`}</span>
					</div>

					<div
						className={`question-content ${expandedQuestions[qIndex] ? 'open' : ''}`}
					>
						<input
							className="question-input"
							value={question.text}
							onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
							placeholder="Введите текст вопроса"
						/>

						<h4>Варианты ответов:</h4>
						{question.answers.map((answer, aIndex) => (
							<div className="answer-row" key={aIndex}>
								<input
									className="correct-checkbox"
									type="checkbox"
									checked={answer.isCorrect}
									onChange={() => handleCorrectChange(qIndex, aIndex)}
								/>
								<input
									className="answer-input"
									value={answer.text}
									onChange={(e) =>
										handleAnswerChange(qIndex, aIndex, e.target.value)
									}
									placeholder="Введите вариант ответа"
								/>
								<button
									className="remove-button"
									onClick={() => removeAnswer(qIndex, aIndex)}
								>
									Удалить
								</button>
							</div>
						))}

						<button className="add-button" onClick={() => addAnswer(qIndex)}>
							+ Добавить вариант ответа
						</button>

						<button
							className="remove-question-button"
							onClick={() => removeQuestion(qIndex)}
						>
							Удалить вопрос
						</button>
					</div>
				</div>
			))}

			<button className="add-button" onClick={addQuestion}>
				+ Добавить вопрос
			</button>

			<div className="actions-buttons">
				<button className="back-button" onClick={() => navigate('/')}>
					Назад
				</button>
				<button className="save-button" onClick={handleSave}>
					Сохранить тест
				</button>
			</div>
		</div>
	);
};

export const EditPage = styled(EditPageContainer)`
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;

	.question-block {
		margin-bottom: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
	}
	.question-header {
		display: flex;
		align-items: center;
		padding: 15px;
		background: #f5f5f5;
		cursor: pointer;
	}
	.question-content {
		padding: 0 15px;
		max-height: 0;
		overflow: hidden;
		transition: all 0.3s ease;
	}
	.question-content.open {
		padding: 15px;
		max-height: 1000px;
	}
	.question-input {
		width: 100%;
		padding: 10px;
		margin-bottom: 15px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.answer-row {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
	.answer-input {
		flex: 1;
		padding: 8px;
		margin-right: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.correct-checkbox {
		margin-right: 10px;
	}
	.remove-question-button {
		background: #ff4444;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 8px 15px;
		margin-right: 10px;
		margin-bottom: 15px;
		cursor: pointer;
	}
	.remove-button {
		background: #ff4444;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 5px 10px;
		cursor: pointer;
	}
	.add-button {
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 8px 15px;
		margin-right: 10px;
		margin-bottom: 15px;
		cursor: pointer;
	}
	.actions-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}
	.back-button {
		background: #f5f5f5;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		cursor: pointer;
	}
	.save-button {
		background: #2196f3;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		cursor: pointer;
	}
`;
