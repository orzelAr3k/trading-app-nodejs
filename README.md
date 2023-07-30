# Trading app

### Startup

*Zainstalowanie zależności*
```bash
npm install

#build project
npm run build
```

*Uruchomienie aplikacji:*

---
- Lokalnie
```bash
npm run build
```
---

- Devcontainer (preinstalowany netcat)

*Otworzyć projekt w VS Code, a następnie ***Reopen in remote Container****

---

- Dockerfile
```bash
docker build -t trading_app .
docker run -itd -p 8888:8888 trading_app
```
---
- docker-compose
```bash
docker-compose up -d
```
---