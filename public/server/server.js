// server.js
const express = require('express');
const http = require('http');
const { SerialPort } = require('serialport');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(express.json());

// Настройки последовательного порта
const portPath = 'COM3';
const baudRate = 9600;

const serialPort = new SerialPort({
  path: portPath,
  baudRate: baudRate,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
});

serialPort.on('open', () => {
  console.log(`Serial port opened on ${portPath} at ${baudRate} baud`);
});

serialPort.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

// Здесь добавляем слушатель данных с COM-порта
serialPort.on('data', (rawBuffer) => {
  const msg = rawBuffer.toString('utf8').trim(); // убираем \r\n и лишние пробелы
  console.log('Received from serial:', msg);

  if (String(msg) === '1') {
    // Рассылаем всем клиентам событие button-press
    io.emit('button-press');
    console.log('→ Emitted socket event: button-press');
  } else if (String(msg) === '0') {
    // Рассылаем всем клиентам событие button-release
    io.emit('button-release');
    console.log('→ Emitted socket event: button-release');
  }
});

// Раздача статических файлов фронтенда
const buildPath = path.join(__dirname, '..');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
