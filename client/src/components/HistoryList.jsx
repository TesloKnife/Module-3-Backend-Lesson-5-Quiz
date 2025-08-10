import styled from 'styled-components';
import PropTypes from 'prop-types';

const HistoryListContainer = ({ className }) => {
	const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');

	// Сортируем историю по дате (новые сначала)
	const sortedHistory = [...history].sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const datePart = date.toLocaleDateString('ru-RU');
		const timePart = date.toLocaleTimeString('ru-RU');
		return { datePart, timePart };
	};

	return (
		<div className={className}>
			<h2 className="title">История прохождений</h2>
			{sortedHistory.length > 0 ? (
				<div className="history-items">
					{sortedHistory.map((item, index) => {
						const { datePart, timePart } = formatDate(item.date);
						return (
							<div key={index} className="history-item">
								<div className="date-time">
									<div>{datePart}</div>
									<div>{timePart}</div>
								</div>

								<div className="progress-wrapper">
									<span className="min">0</span>
									<div className="progress-bar">
										{item.answers.map((isCorrect, i) => (
											<div
												key={i}
												className={
													isCorrect ? 'correct' : 'incorrect'
												}
												style={{
													width: `${100 / item.answers.length}%`,
												}}
											></div>
										))}
									</div>
									<span className="max">{item.totalQuestions}</span>
								</div>

								<div className="result">
									Верно: {item.correctAnswers} из {item.totalQuestions}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="empty">Нет данных о прохождениях</div>
			)}
		</div>
	);
};

HistoryListContainer.propTypes = {
	className: PropTypes.string,
};

export const HistoryList = styled(HistoryListContainer)`
	display: flex;
	flex-direction: column;
	gap: 15px;
	width: 100%;
	max-width: 900px;
	margin: 0 auto;

	.title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.history-items {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.history-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 10px 16px;
		font-size: 14px;
		background: #fff;
	}

	.date-time {
		display: flex;
		flex-direction: column;
		font-size: 13px;
		color: #555;
		min-width: 90px;
	}

	.progress-wrapper {
		max-width: 400px;
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
	}

	.progress-bar {
		flex: 1;
		height: 16px;
		border: 1px solid;
		border-radius: 6px;
		overflow: hidden;
		display: flex;
		background: #e0e0e0;
	}

	.correct {
		background: #8bc34a;
	}

	.incorrect {
		background: #c62828;
	}

	.min,
	.max {
		font-size: 12px;
		color: #555;
	}

	.result {
		font-weight: 500;
		min-width: 110px;
		text-align: right;
	}

	.empty {
		color: #777;
		font-size: 14px;
		text-align: center;
		margin-top: 10px;
	}
`;
