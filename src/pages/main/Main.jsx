import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function Main() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home'); 
    };

	 
	 const videoRef = useRef(null);

	 useEffect(() => {
         // Проверяем, что ссылка на видео существует
         if (!videoRef.current) return;

         const video = videoRef.current;

         const handlePlay = async () => {
             try {
                 await video.play();
             } catch (error) {
                 console.log('Автовоспроизведение заблокировано:', error);
                 // Fallback: включаем без звука
                 video.muted = true;
                 try {
                     await video.play();
                 } catch (err) {
                     console.error('Не удалось воспроизвести видео:', err);
                 }
             }
         };

         // Обработчик для события, когда видео готово к воспроизведению
         const handleCanPlay = () => {
             handlePlay();
             video.removeEventListener('canplay', handleCanPlay);
         };

         video.addEventListener('canplay', handleCanPlay);

         // Очистка при размонтировании
         return () => {
             if (videoRef.current) {
                 videoRef.current.pause();
                 videoRef.current.removeEventListener('canplay', handleCanPlay);
             }
         };
     }, []);
	 

    return (
        <div onClick={handleClick} className={styles.background}>
            <video
                ref={videoRef}
                className={styles.videoBackground}
                autoPlay
                loop
                muted={false}
                playsInline
            >
                <source src="/video/background.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>
        </div>
    );
}

export default Main;
