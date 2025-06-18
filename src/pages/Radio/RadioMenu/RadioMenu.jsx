import styles from './RadioMenu.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import BackButton from '../../../components/BackButton/BackButton';

function RadioMenu() {
    const navigate = useNavigate();

    const handleClickArctic = () => {
        navigate('/radio_arctic');
    };

    const handleClickPilot = () => {
        navigate('/radio_pilot');
    };

    const handleClickPolar = () => {
        navigate('/radio_polar');
    };

    const handleClickBack = () => {
        navigate('/home');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Button className={styles.button} onClick={handleClickArctic} />
                <Button className={styles.button} onClick={handleClickPilot} />
                <Button onClick={handleClickPolar} />
            </div>
            <BackButton className={styles.backButton} onClick={handleClickBack} />
        </div>
    );
}

export default RadioMenu;
