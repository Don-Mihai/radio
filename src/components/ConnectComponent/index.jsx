import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './ConnectComponent.module.scss';
import Button from '../Button/Button';

function ConnectComponent({ data = {} }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Функция обработки события (листаем тексты)
  const advanceText = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, (data.texts?.length || 1) - 1));
  };

  useEffect(() => {
    // Подключаемся к сокету на том же хосте
    const socket = io();

    // Подписываемся на событие "button-press"
    socket.on('button-press', advanceText);

    // Очистка при демонтировании
    return () => {
      socket.off('button-press', advanceText);
      socket.disconnect();
    };
  }, []);

  const showDescription = currentIndex === 0;
  const showText = currentIndex >= 0;

  const handleClickBack = () => {
    navigate('/connect_menu');
  };

  return (
    <div className={styles.wrapper}>
      {showDescription && <div className={styles.description}>НАЖМИТЕ НА ТЕЛЕГРАФНЫЙ КЛЮЧ, ЧТОБЫ ПРИНЯТЬ ОТВЕТ НА СООБЩЕНИЕ</div>}

      <div className={styles.textContainer}>{showText && <div className={styles.text}>{data.texts[currentIndex]}</div>}</div>

      {/* Кнопка «Назад» для возврата */}
      <Button className={styles.button} onClick={handleClickBack}>
        Назад
      </Button>
    </div>
  );
}

export default ConnectComponent;
