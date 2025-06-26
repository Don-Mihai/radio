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

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentSymbols, setCurrentSymbols] = useState([]);
  const [completedCodes, setCompletedCodes] = useState([]);
  const [letters, setLetters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const letterTimeout = useRef(null);
  const symbolsRef = useRef(currentSymbols);

  useEffect(() => {
    symbolsRef.current = currentSymbols;
  }, [currentSymbols]);

  const handleChooseWord = (index) => {
    setSelectedIndex(index);
    setCurrentSymbols([]);
    setCompletedCodes([]);
    setLetters([]);
    setIsSuccessModalOpen(false);
  };

  const checkSuccess = (newLetters) => {
    if (selectedIndex === null) return;
    const target = morzeWords[selectedIndex].text;
    const current = newLetters.join('');
    if (current === target) {
      setIsSuccessModalOpen(true);
    }
  };

  const pushSymbol = (dotOrDash) => {
    if (letterTimeout.current) clearTimeout(letterTimeout.current);
    setCurrentSymbols((prev) => [...prev, dotOrDash]);
    letterTimeout.current = setTimeout(() => {
      const code = symbolsRef.current.join('');
      const decoded = MORSE_MAP[code] || '?';
      setLetters((prev) => {
        const nextIndex = prev.length;
        let updated = [...prev, decoded];
        if (selectedIndex !== null) {
          const target = morzeWords[selectedIndex].text;
          // if the next target char is a space, auto-insert it
          if (target[nextIndex] === ' ' && decoded !== ' ') {
            updated.push(' ');
          }
        }
        checkSuccess(updated);
        return updated;
      });
      setCompletedCodes((prev) => [...prev, code]);
      setCurrentSymbols([]);
    }, 2000);
  };

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

  const handleDeleteSymbol = () => {
    if (currentSymbols.length > 0) {
      setCurrentSymbols((s) => s.slice(0, -1));
      clearTimeout(letterTimeout.current);
    } else {
      setLetters((l) => l.slice(0, -1));
      setCompletedCodes((c) => c.slice(0, -1));
    }
  };

  const handleReset = () => {
    setCurrentSymbols([]);
    setCompletedCodes([]);
    setLetters([]);
    setIsSuccessModalOpen(false);
  };

  const sendShort = () => pushSymbol('.');
  const sendLong = () => pushSymbol('-');
  const handleToggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <div className={styles.wrapper}>
      <div className={styles.words}>
        {morzeWords.map((word, idx) => (
          <div key={idx} onClick={() => handleChooseWord(idx)} className={idx === selectedIndex ? styles.selectedWord : styles.word}>
            {word.text}
          </div>
        ))}
      </div>

      {/* Test buttons */}
      <div className={styles.testButtons}>
        <button onClick={sendShort}>Test Short</button>
        <button onClick={sendLong}>Test Long</button>
      </div>

      <div className={styles.textContainer}>
        <div className={styles.symbols}>
          {completedCodes.map((code, i) => (
            <span key={i} className={styles.codeGroup}>
              {code.split('').map((s, j) => (
                <span key={j}>{s === '.' ? '·' : '–'}</span>
              ))}
              <span className={styles.sep}> </span>
            </span>
          ))}
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

      <div className={styles.actionsContainer}>
        <div className={styles.actionButton} onClick={handleClickBack} />
        <div className={styles.actionButton} onClick={handleToggleModal} />
      </div>

      {/* Standard Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} onClick={handleToggleModal} />
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.successModalContent}>
            <h2>ВЕРНО!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Morze;
