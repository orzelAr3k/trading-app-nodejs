import * as net from "net";

// import {} from "./";
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
    this._bindServerEvents(server);
  }

  private _bindServerEvents(server: net.Server) {
    server.on("error", (err: any) => {
      if (err.code == "EADDRINUSE") {
        // LOG.e(this.tag, "Address in use, retrying...");
        this._retry();
      } else {
        // LOG.e(this.tag, err.toString());
      }
    });

    server.listen(this.PORT, this.HOST, () => {
      // LOG.i(this.tag, "bind to", this.HOST, ":", this.PORT);
    });
  }

  private _retry() {
    if (this.server && this.PORT && this.HOST) {
      setTimeout(() => {
        if (this.server) {
          let server = this.server;
          server.close();
          server.listen(this.PORT, this.HOST, () => {
            // LOG.i(this.tag, "bind to", this.HOST, ":", this.PORT);
          });
        } else {
          throw Error('Cannot init server!');
        }
      }, 1000);
    }
  }
}
