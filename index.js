const ModbusRTU = require('modbus-serial');

// Modbus 클라이언트 생성
const client = new ModbusRTU();

// 서버 주소와 포트
const host = '127.0.0.1'; // 서버 IP 주소
const port = 503;         // 서버 포트 (기본 Modbus TCP 포트)

// 주기적인 데이터 읽기 설정
const readInterval = 5000; // 5초마다 데이터 읽기

function readData() {
  client.readHoldingRegisters(0x01, 10)
    .then(data => {
      console.log('Data received:', data.data);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

// Modbus TCP 서버에 연결
client.connectTCP(host, { port: port })
  .then(() => {
    console.log('Connected to Modbus TCP server');
    readData(); // 초기 데이터 읽기

    // 주기적으로 데이터 읽기
    setInterval(readData, readInterval);
  })
  .catch(err => {
    console.error('Error:', err);
  });

// 클라이언트 종료 처리
process.on('SIGINT', () => {
  console.log('Closing connection');
  client.close();
  process.exit();
});
