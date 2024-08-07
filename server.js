const express = require('express');
const ModbusRTU = require('modbus-serial');
const app = express();
const port = 3000; // 웹 서버 포트

// Modbus 클라이언트 생성
const client = new ModbusRTU();
const modbusHost = '127.0.0.1'; // Modbus TCP 서버 IP 주소
const modbusPort = 503;         // Modbus TCP 서버 포트 (기본값)

let modbusData = [];

// 데이터 읽기 함수
async function readData() {
  try {
    const data = await client.readHoldingRegisters(0x01, 10);
    return data.data;
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

// Modbus TCP 서버에 연결
client.connectTCP(modbusHost, { port: modbusPort })
  .then(() => {
    console.log('Connected to Modbus TCP server');
    
    // 주기적으로 데이터 읽기
    setInterval(async () => {
      const newData = await readData();
      modbusData = modbusData.concat(newData); // 데이터 누적
    }, 5000); // 5초마다 데이터 읽기
  })
  .catch(err => {
    console.error('Error connecting to Modbus TCP server:', err);
  });

// API 엔드포인트 설정
app.get('/data', (req, res) => {
  res.json({
    data: modbusData,
    count: modbusData.length
  });
});

// 정적 파일 제공
app.use(express.static('public'));

// 웹 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
