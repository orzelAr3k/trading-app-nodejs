import * as net from "net";
import * as _ from "lodash";
import { customAlphabet } from "nanoid";
import { Session } from "./session";
import { LOG } from "../utils/log";

export class SessionManager {
	private sessions: Session[] = [];

	createSession(socket: net.Socket) {
		const nid = customAlphabet("1234567890", 5);
		const id = nid();
		const session = new Session(id, socket);
		this.sessions.push(session);
		LOG.clientConnected(session.getIp, id);
	}

	getSession(id: string) {
		return _.find(this.sessions, { id: id });
	}

	broadcast(message: string) {
		_.forEach(this.sessions, (session: Session) => {
			session.getSocket?.write(message);
		});
	}
}
