import styles from './app.module.css';
import { getQuiz } from './services/quiz-service';

export const App = () => {
	console.log('getQuiz =', getQuiz());
	return (
		<div className={styles.app}>
			<div>Hello</div>
		</div>
	);
};
