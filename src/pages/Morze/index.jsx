import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './Morze.module.scss';
import { useNavigate } from 'react-router';

// таблица для русской азбуки (ITU-К)
const MORSE_MAP = {
  '.-': 'А',
  '-...': 'Б',
  '.--': 'В',
  '--.': 'Г',
  '-..': 'Д',
  '.': 'Е',
  '...-': 'Ж',
  '--..': 'З',
  '..': 'И',
  '.---': 'Й',
  '-.-': 'К',
  '.-..': 'Л',
  '--': 'М',
  '-.': 'Н',
  '---': 'О',
  '.--.': 'П',
  '.-.': 'Р',
  '...': 'С',
  '-': 'Т',
  '..-': 'У',
  '..-.': 'Ф',
  '....': 'Х',
  '-.-.': 'Ц',
  '---.': 'Ч',
  '----': 'Ш',
  '--.-': 'Щ',
  '--.--': 'Ъ',
  '-..-': 'Ы',
  '-.--': 'Ь',
  '.-.-': 'Э',
  '..-..': 'Ю',
  '.-.-.': 'Я',
};

const morzeWords = [{ text: 'ПРИЕМ' }, { text: 'ЗЕМЛЯ' }, { text: 'ЗАЖАТ ЛЬДАММИ' }, { text: 'ПОГОДА ОТЛИЧНАЯ' }, { text: 'СЛЫШУ ХОРОШО' }];

const Morze = () => {
  const navigate = useNavigate();

  // индекс выбранного слова или null
  const [selectedIndex, setSelectedIndex] = useState(null);

  // текущий код буквы (строим в реальном времени)
  const [currentSymbols, setCurrentSymbols] = useState([]);
  // массив завершенных кодов букв
  const [completedCodes, setCompletedCodes] = useState([]);
  // распознанные буквы
  const [letters, setLetters] = useState([]);

  const letterTimeout = useRef(null);
  const symbolsRef = useRef(currentSymbols);

  useEffect(() => {
    symbolsRef.current = currentSymbols;
  }, [currentSymbols]);

  // выбираем слово и сбрасываем ввод
  const handleChooseWord = (index) => {
    setSelectedIndex(index);
    setCurrentSymbols([]);
    setCompletedCodes([]);
    setLetters([]);
  };

  const pushSymbol = (dotOrDash) => {
    if (letterTimeout.current) clearTimeout(letterTimeout.current);
    setCurrentSymbols((prev) => [...prev, dotOrDash]);
    // если пауза — считаем, что буква закончилась
    letterTimeout.current = setTimeout(() => {
      const code = symbolsRef.current.join('');
      const decoded = MORSE_MAP[code] || '?';
      setLetters((prev) => [...prev, decoded]);
      setCompletedCodes((prev) => [...prev, code]);
      setCurrentSymbols([]);
    }, 2000);
  };

  // подключаемся к сокету при выборе слова
  useEffect(() => {
    if (selectedIndex === null) return;

    const socket = io();
    socket.on('button-short', () => pushSymbol('.'));
    socket.on('button-long', () => pushSymbol('-'));

    return () => {
      socket.off('button-short');
      socket.off('button-long');
      socket.disconnect();
    };
  }, [selectedIndex]);

  const handleClickBack = () => navigate(-1);

  // удаляем последний символ или букву
  const handleDeleteSymbol = () => {
    // если есть текущие символы — удаляем последний ввод
    if (currentSymbols.length > 0) {
      setCurrentSymbols((s) => s.slice(0, -1));
      clearTimeout(letterTimeout.current);
    } else {
      // иначе убираем последнюю букву и код
      setLetters((l) => l.slice(0, -1));
      setCompletedCodes((c) => c.slice(0, -1));
    }
  };

  // сброс всего ввода
  const handleReset = () => {
    setCurrentSymbols([]);
    setCompletedCodes([]);
    setLetters([]);
  };

  // тестовые кнопки для отправки событий
  const sendShort = () => pushSymbol('.');
  const sendLong = () => pushSymbol('-');

  return (
    <div className={styles.wrapper}>
      <div className={styles.words}>
        {morzeWords.map((word, idx) => (
          <div key={idx} onClick={() => handleChooseWord(idx)} className={idx === selectedIndex ? styles.selectedWord : styles.word}>
            {word.text}
          </div>
        ))}
      </div>

      {/* Тестовые кнопки */}
      <div className={styles.testButtons}>
        <button onClick={sendShort}>Test Short</button>
        <button onClick={sendLong}>Test Long</button>
      </div>

      <div className={styles.textContainer}>
        <div className={styles.symbols}>
          {/* рисуем все завершенные коды */}
          {completedCodes.map((code, i) => (
            <span key={i} className={styles.codeGroup}>
              {code.split('').map((s, j) => (
                <span key={j}>{s === '.' ? '·' : '–'}</span>
              ))}
              <span className={styles.sep}> </span>
            </span>
          ))}
          {/* текущий набор символов */}
          {currentSymbols.map((s, i) => (
            <span key={`curr-${i}`}>{s === '.' ? '·' : '–'}</span>
          ))}
        </div>
        <div className={styles.letters}>{letters.join('')}</div>
      </div>

      <div className={styles.optionsContainer}>
        <div className={styles.optionsButton} onClick={handleDeleteSymbol} />
        <div className={styles.optionsButton} onClick={handleReset} />
      </div>

      <div className={styles.backButton} onClick={handleClickBack} />
    </div>
  );
};

export default Morze;
