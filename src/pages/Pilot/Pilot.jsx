import styles from './Pilot.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import BackButton from '../../components/BackButton/BackButton';

function Pilot() {
	const navigate = useNavigate();

    const handleClickRadio = () => {
        navigate('/radio_pilot');
    };

    const handleClickConnect = () => {
        navigate('/connect_pilot');
    };

	 const handleClickBack = () => {
         navigate('/home');
     };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Button className={styles.button} onClick={handleClickRadio} />
                <Button className={styles.button} onClick={handleClickConnect} />
            </div>
            <BackButton className={styles.backButton} onClick={handleClickBack} />
        </div>
    );
}

export default Pilot;
