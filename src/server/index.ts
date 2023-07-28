import * as net from "net";
import dayjs from 'dayjs';
import { SessionManager } from "./sessionManager";

export class TcpServer {
  // Singleton ==================================
  private static serverInstance: TcpServer | null = null;

  static getInstance() {
    if (TcpServer.serverInstance == null) {
      TcpServer.serverInstance = new TcpServer();
    }
    return TcpServer.serverInstance;
  }

  constructor() {
    this.server = null;
    this.PORT = 0;
    this.HOST = "";
  }
  // ============================================

  private sessionManager = new SessionManager();
  private server: net.Server | null;
  private PORT: number;
  private HOST: string;

  init(host: string, port: number) {
    let server = net.createServer((socket: net.Socket) => {
      // on socket connection:
      this.sessionManager.createSession(socket);
    });

    this.server = server;
    this.PORT = port;
    this.HOST = host;
    this.bindServerEvents(server);
  }

  private bindServerEvents(server: net.Server) {
    server.on("error", (err: any) => {
      if (err.code == "EADDRINUSE") {
        console.error("Address in use, retrying...");
        this.retry();
      } else {
        console.error(err.toString());
      }
    });

    server.listen(this.PORT, this.HOST, () => {
      console.info(`${dayjs().format('HH:mm:ss')} listen on ${this.HOST}:${this.PORT}`);
    });
  }

  private retry() {
    if (this.server && this.PORT && this.HOST) {
      setTimeout(() => {
        if (this.server) {
          let server = this.server;
          server.close();
          server.listen(this.PORT, this.HOST, () => {
            console.info(`${dayjs().format('HH:mm:ss')} listen on ${this.HOST}:${this.PORT}`);
          });
        } else {
          throw Error('Cannot init server!');
        }
      }, 1000);
    }
  }
}
