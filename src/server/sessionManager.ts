import * as net from "net";
import * as _ from "lodash";
import { customAlphabet } from "nanoid";

import { Session }  from "./session";

export class SessionManager {
  private sessions: Session[] = [];

  createSession(socket: net.Socket) {
    const nanoid = customAlphabet('1234567890', 5);
    const id = nanoid();
    const session = new Session(id, socket);
    this.sessions.push(session);
    // LOG.i(this.tag, 'session created:', id, 'for:', session.ip);
  }

  getSession(id: string) {
    return _(this.sessions).find({id: id});
  }
}