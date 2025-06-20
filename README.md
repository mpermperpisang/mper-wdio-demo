# mper-wdio-mocha-web-demo

### Install
- NodeJS v22.15.0
- NPM v10.9.2

### Framework + Library + Reporter
- WebdriverIO
- Mocha
- Allure

### How to Setup
Without Makefile
- `npm ci`

With Makefile
- `make ci`

### How to Run
Without Docker
- `npx wdio run ./wdio.conf.js` or
- `npm run test`

Open Allure Reporter (without Docker)
- `allure serve allure-results`
