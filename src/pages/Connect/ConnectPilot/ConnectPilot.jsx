import styles from './ConnectPilot.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';

function Connect() {
   const navigate = useNavigate();

   const handleClickBack = () => {
       navigate('/connect_menu');
   };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Button
                    className={styles.button}
                    onClick={handleClickBack}
                />
            </div>
        </div>
    );
}

export default Connect;
