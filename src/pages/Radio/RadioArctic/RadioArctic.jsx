import styles from './RadioArctic.module.scss';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';

function RadioArctic() {
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const handleClickBack = () => {
        // Останавливаем аудио при переходе назад
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        navigate('/radio_menu');
    };

    const handlePlay = () => {
        // Если аудио уже играет, останавливаем и начинаем сначала
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } else {
            // Создаем новый экземпляр Audio
            audioRef.current = new Audio('/audio/audio-arctic.mp3');
        }

        // Пробуем воспроизвести
        audioRef.current.play().catch(error => {
            console.error('Ошибка воспроизведения:', error);
            // Пробуем с отключенным звуком
            if (audioRef.current) {
                audioRef.current.muted = true;
                audioRef.current.play().catch(e => console.error('Не удалось воспроизвести даже с отключенным звуком:', e));
            }
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Button className={styles.button} onClick={handlePlay} />

                <Button className={styles.button} onClick={handleClickBack} />
            </div>
        </div>
    );
}

export default RadioArctic;
