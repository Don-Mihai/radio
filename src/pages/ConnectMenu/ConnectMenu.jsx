import styles from './ConnectMenu.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import BackButton from '../../components/BackButton/BackButton';

function ConnectMenu() {
  const navigate = useNavigate();

  const handleClickArctic = () => {
    navigate('/connect-item/1');
  };

  const handleClickPilot = () => {
    navigate('/connect-item/2');
  };

  const handleClickPolar = () => {
    navigate('/connect-item/3');
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
