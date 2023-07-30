import * as net from "net";
import { LOG } from "../utils/log";
import { isProduct } from "../utils/product";

interface OrdersDto {
	BUY: Record<Product, Session[]>;
	SELL: Record<Product, Session[]>;
}

export class Session {
	private id: string;
	private socket: net.Socket | null;
	public static orders: OrdersDto = {
		BUY: {},
		SELL: {},
	} as OrdersDto;

	constructor(id: string, socket: net.Socket) {
		this.id = id;
		this.socket = socket;
		this.bindSocketEvents(socket);
	}

	get getSocket() {
		return this.socket;
	}

	get getIp() {
		return this.socket?.remoteAddress || "";
	}

	dispose() {
		this.socket = null;
	}

	private bindSocketEvents(socket: net.Socket) {
		socket.on("data", (data: Buffer) => {
			const message = data.toString("utf-8").trim();
			const [action, product]: [Action, Product] = message.split(":") as [Action, Product];

			if (action && (action === "BUY" || action === "SELL")) {
				if (product && isProduct(product)) {
					LOG.newOrder(action, product, this.id);
					this.handleAction(this, action, product);
				} else {
					this.getSocket?.write("Product not exists!\n");
				}
			} else {
				this.getSocket?.write("Forbidden action!\n");
			}
		});

		socket.on("error", (err: any) => {
			LOG.error(err.toString());
		});

		socket.on("close", () => {
			LOG.clientDisconnected(this.getIp, this.id);
		});
	}

	handleAction(session: Session, action: Exclude<Action, "TRADE" | "ACK">, product: Product) {
		const oppositeAction: Exclude<Action, "TRADE" | "ACK"> = action === "BUY" ? "SELL" : "BUY";

		if (
			Session.orders[oppositeAction][product] &&
			Session.orders[oppositeAction][product].length > 0
		) {
			const oppositeOrder = Session.orders[oppositeAction][product].shift();
			const message = `TRADE:${product}\n`;
			LOG.newOrder("TRADE", product, this.id);
			if (session) session.getSocket?.write(message);
			if (oppositeOrder) oppositeOrder.getSocket?.write(message);
		} else {
			if (!Session.orders[action][product]?.length) Session.orders[action][product] = [];
			Session.orders[action][product].push(session);
			const ackMessage = `ACK:${product}\n`;
			session.getSocket?.write(ackMessage);
		}
	}
}
