# Trading app

Simple trading system for trading commodities. The project was made in ***NodeJS*** using the ***net*** package to create a simple TCP server.


**Requirements:**

- Available commodities: Apples, Pears, Tomatoes, Potatoes, Onions
- All commodities are in crates (there is no other unit of measurement)
- A buy and sell order covers only one crate (e.g., wanting to buy 5 crates of tomatoes requires sending 5 separate orders to the system, the same applies to selling)
- Orders are paired by product (e.g., a sell order for apples with a buy order for apples)
- We are not creating authorization mechanisms
- All connected users are notified about executed transactions




### Message structure:

    BUY:{PRODUCT} - buy order (input)
    SELL:{PRODUCT} - sell order (input)
    TRADE:{PRODUCT} - server message about executed transaction (output)
    ACK:{PRODUCT} - server message confirming order receipt (output)

### Example

![example](https://github.com/orzelAr3k/trading-app-nodejs/assets/63066341/b1ce925a-9b61-45b7-8a24-490ff46179b3)

## Getting started

- *Install dependencies*
```bash
npm install

#build project
npm run build
```

- *Uruchomienie aplikacji:*


```bash
npm run start
```


***Docker***
- *Devcontainer (preinstall netcat)*

---

- *Dockerfile*
```bash
docker build -t trading_app .
docker run -itd -p 8888:8888 trading_app
```
---
- *docker-compose*
```bash
docker-compose up -d
```
