import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryList } from '../components/HistoryList';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HomePageContainer = ({ className }) => {
	const [history, setHistory] = useState([]);
	const navigate = useNavigate();

	// Что делает?
	useEffect(() => {
		const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
		setHistory(savedHistory);
	}, []);

	return (
		<div className={className}>
			<h1>Добро пожаловать в Quiz!</h1>
			<div className="buttons">
				<button className="btn" onClick={() => navigate('/quiz')}>
					Запустить тест
				</button>
				<button className="btn" onClick={() => navigate('/edit')}>
					Редактировать тест
				</button>
			</div>
			<HistoryList history={history} />
		</div>
	);
};

HomePageContainer.propTypes = {
	className: PropTypes.string,
};

export const HomePage = styled(HomePageContainer)`
	font-family: Arial, sans-serif;
	color: #222;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 20px;
	box-sizing: border-box;

	.buttons {
		display: flex;
		gap: 20px;
		margin-bottom: 30px;
	}

	.btn {
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

	.history-title {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 20px;
		text-align: center;
	}
`;
