import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { HomePage, QuizPage } from './pages';

const Page = styled.div``;

export const App = () => {
	return (
		<Page>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/quiz" element={<QuizPage />} />
			</Routes>
		</Page>
	);
};
