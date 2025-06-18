import styles from './Button.module.scss';

function Button({ className = '', onClick}) {
    return (
		<button 
		className={`${styles.base} ${className}`}
		onClick={onClick}
		></button>
	 );
	 
}

export default Button;
