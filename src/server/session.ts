import * as net from "net";
import { Product } from '../utils/product';
import dayjs from 'dayjs';

interface OrdersDto {
  BUY: Record<string, net.Socket[]>; 
  SELL: Record<string, net.Socket[]>;
}

export class Session {
  private id: string;
  private socket: net.Socket | null;
  private sessions: Session[];
  public static orders: OrdersDto = {
    BUY: {
      [Product.APPLE]: [],
      [Product.PEAR]: [],
      [Product.TOMATO]: [],
      [Product.POTATO]: [],
      [Product.ONION]: []
    },
    SELL: {
      [Product.APPLE]: [],
      [Product.PEAR]: [],
      [Product.TOMATO]: [],
      [Product.POTATO]: [],
      [Product.ONION]: []
    }
  };

  constructor(id: string, socket: net.Socket, sessions: Session[]) {
    this.id = id;
    this.socket = socket;
    this.sessions = sessions;
    this._bindSocketEvents(socket);
  }

  get getSocket() {
    return this.socket;
  }

  get getIp() {
    return (this.socket && this.socket.remoteAddress) || "";
  }

  dispose() {
    this.socket = null;
  }

  private _bindSocketEvents(socket: net.Socket) {
    // binding listeners:
    socket.on("data", (data: Buffer) => {
      const message = data.toString().trim();
      const [orderType, product] = message.split(":");

      if (orderType === "BUY" || orderType === "SELL") {
        this.handleOrder(socket, orderType, product);
      }
      console.log(`${dayjs().format('HH:mm:ss')} new ${orderType} order (${this.id}, ${product})`);
    });

    socket.on("error", (err: any) => {
      // Socket Error handler:
      //   LOG.e(this.tag, err.toString());
    });

    socket.on("close", () => {
      //   LOG.i(this.tag, this.id, this.ip, 'socket disconnected');
    });
  }

  handleOrder(client: net.Socket, orderType: keyof OrdersDto, product: string) {
    const oppositeOrderType: keyof OrdersDto = orderType === 'BUY' ? 'SELL' : 'BUY';
    
    if (Session.orders[oppositeOrderType][product] && Session.orders[oppositeOrderType][product].length > 0) {
      const oppositeOrder = Session.orders[oppositeOrderType][product].shift();
      const message = `TRADE:${product}\n`;
      client.write(message);
      if (oppositeOrder) oppositeOrder.write(message);
    } else {
      Session.orders[orderType][product].push(client);
      const ackMessage = `ACK:${product}\n`;
      client.write(ackMessage);
    }
  }
}
