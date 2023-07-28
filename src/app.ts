// import { serverLog } from "./utils/log";
import { TcpServer } from "./server";
import 'dotenv/config';

function app() {
  let tcpServer = TcpServer.getInstance();
  tcpServer.init( process.env.ADDRESS || '0.0.0.0', process.env.SERVER_PORT || 8888);
}

app();