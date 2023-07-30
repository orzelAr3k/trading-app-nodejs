import dayjs from "dayjs";

export class LOG {
  static serverListen(port: number) {
    console.log(`${dayjs().format("HH:mm:ss")} listening on port ${port}`);
  }

  static clientConnected(ipAddress: string, id: string) {
    console.log(`${dayjs().format("HH:mm:ss")} connected ('${ipAddress}', ${id})`);
  }

  static clientDisconnected(ipAddress: string, id: string) {
    console.log(`${dayjs().format("HH:mm:ss")} disconnected ('${ipAddress}', ${id})`);
  }

  static newOrder(action: Action, product: Product, id: string) {
    if (action !== "TRADE") console.info(`${dayjs().format("HH:mm:ss")} new ${action.toLocaleLowerCase()} order ('${id}', ${product})`);
    else console.info(`${dayjs().format("HH:mm:ss")} ${action.toLowerCase()} (${product})`);
  }

  static error(e: string) {
    console.error(e);
  }
}
