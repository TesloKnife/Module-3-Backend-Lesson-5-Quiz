import styled from 'styled-components';

const HistoryListContainer = () => {};

export const HistoryList = styled(HistoryListContainer)`
	display: flex;
	flex-direction: column;
	gap: 10px;

	.history-item {
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 8px 12px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: #555;
	}

	.progress-bar {
		height: 12px;
		border-radius: 6px;
		overflow: hidden;
		display: flex;
	}

	.correct {
		background: #8bc34a;
	}

	.incorrect {
		background: #c62828;
	}

	.empty {
		background: #e0e0e0;
	}
`;
