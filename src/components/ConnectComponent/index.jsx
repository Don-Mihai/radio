import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './ConnectComponent.module.scss';
import Button from '../Button/Button';

function ConnectComponent({ data = {} }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Управление отображением подсказок
  const [showInitialDesc, setShowInitialDesc] = useState(true);
  const [showAcceptDesc, setShowAcceptDesc] = useState(false);
  const [showFinalDesc, setShowFinalDesc] = useState(false);
  const lastIndex = (data.texts?.length || 1) - 1;

  const audioRef = useRef(new Audio());

  // Если на последнем — сброс, иначе +1
  const advanceText = () => {
    setCurrentIndex((prev) => (prev === lastIndex ? 0 : Math.min(prev + 1, lastIndex)));
  };

  useEffect(() => {
    const socket = io();

    socket.on('button-long', advanceText);
    socket.on('button-short', advanceText);

    return () => {
      socket.off('button-long', advanceText);
      socket.off('button-short', advanceText);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      // Останавливаем и сбрасываем аудио при unmount
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    let timer;

    // Сбрасываем все второстепенные подсказки на смену шага
    setShowAcceptDesc(false);
    setShowFinalDesc(false);

    // Шаг 0: стартовая подсказка
    if (currentIndex === 0) {
      setShowInitialDesc(true);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      return;
    }

    // Любой шаг ≥1: скрываем стартовую подсказку
    setShowInitialDesc(false);

    // Запускаем соответствующее аудио, если есть
    const { audio } = data.texts[currentIndex] || {};
    if (audio) {
      audioRef.current.src = audio;
      audioRef.current.play();
    }

    // Через 5 сек показываем либо подсказку принять, либо финальное сообщение
    timer = setTimeout(() => {
      if (currentIndex === lastIndex) {
        setShowFinalDesc(true);
      } else {
        setShowAcceptDesc(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, data.texts, lastIndex]);

  const handleClickBack = () => {
    navigate('/connect_menu');
  };

  const displayedTexts = (data.texts || []).slice(0, currentIndex + 1);

  return (
    <div className={styles.wrapper}>
      {showInitialDesc && <div className={styles.description}>ВОЗЬМИТЕ НАУШНИК И НАЖМИТЕ НА ТЕЛЕГРАФНЫЙ КЛЮЧ, ЧТОБЫ ОТПРАВИТЬ СООБЩЕНИЕ</div>}
      {showAcceptDesc && <div className={styles.description}>НАЖМИТЕ НА ТЕЛЕГРАФНЫЙ КЛЮЧ, ЧТОБЫ ПРИНЯТЬ ОТВЕТ НА СООБЩЕНИЕ</div>}
      {showFinalDesc && (
        <div className={styles.description}>ВСЕ СООБЩЕНИЯ ПЕРЕДАНЫ УСПЕШНО. НАЧНИТЕ СНАЧАЛА, НАЖАВ НА ТЕЛЕГРАФНЫЙ КЛЮЧ ИЛИ ВЕРНИТЕСЬ В ПРЕДЫДУЩЕЕ МЕНЮ</div>
      )}

      <div className={styles.textContainer}>
        {displayedTexts.map((obj, idx) => (
          <div className={styles.item} key={idx}>
            {obj?.title && <div className={styles.title}>{obj.title}</div>}

            {obj?.phrazes?.map((phraze, idx) => (
              <div key={idx} className={styles.text}>
                {phraze}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* <button onClick={advanceText}>click</button> */}
      <Button className={styles.button} onClick={handleClickBack}>
        Назад
      </Button>
    </div>
  );
}

export default ConnectComponent;
