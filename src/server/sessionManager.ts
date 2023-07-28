import * as net from "net";
import * as _ from "lodash";
import { customAlphabet } from "nanoid";
import dayjs from 'dayjs';

import { Session }  from "./session";

export class SessionManager {
  private sessions: Session[] = [];

  createSession(socket: net.Socket) {
    const nid = customAlphabet('1234567890', 5);
    const id = nid();
    const session = new Session(id, socket, this.sessions);
    this.sessions.push(session);
    console.info(`${dayjs().format('HH:mm:ss')} connected (${session.getIp}, ${id})`);
  }

  // getSession(id: string) {
  //   return _(this.sessions).find({id: id});
  // }
}