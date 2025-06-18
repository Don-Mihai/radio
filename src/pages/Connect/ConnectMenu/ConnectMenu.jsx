import styles from './ConnectMenu.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import BackButton from '../../../components/BackButton/BackButton';

function ConnectMenu() {
    const navigate = useNavigate();

    const handleClickArctic = () => {
        navigate('/connect_arctic');
    };

    const handleClickPilot = () => {
        navigate('/connect_pilot');
    };

    const handleClickPolar = () => {
        navigate('/connect_polar');
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

export default ConnectMenu;
