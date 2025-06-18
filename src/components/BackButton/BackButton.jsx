import styles from './BackButton.module.scss';

function BackButton({ className = '', onClick }) {
    return (
		<button 
	 		className={`${styles.base} ${className}`} 
	 		onClick={onClick}
	 	>
	 	</button>
	 );
}

export default BackButton;