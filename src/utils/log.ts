import dayjs from "dayjs";

export function clientLog(action: string, product: string, ...args: any[]) {
  console.log(`${action}:${product}`, ...args);
}

// export function serverLog(
//   tag: string,
//   ...args: any[]
// ) {
//   console.log(`${dayjs().format('HH:mm:ss')} [${type}] ${tag}:`, ...args);
// }
