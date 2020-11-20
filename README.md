# API Pikobar Pelaporan Jabar
[![Maintainability](https://api.codeclimate.com/v1/badges/2298b98ac9b6d1ad5bca/maintainability)](https://codeclimate.com/github/jabardigitalservice/pikobar-pelaporan-backend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2298b98ac9b6d1ad5bca/test_coverage)](https://codeclimate.com/github/jabardigitalservice/pikobar-pelaporan-backend/test_coverage)

API service for Jabar Pikobar application

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)
- **Mongo DB** - [https://mongodb.github.io/node-mongodb-native/3.5/](https://mongodb.github.io/node-mongodb-native/3.5/)

## Quick Start

Clone project and install dependencies:
```bash
$ https://github.com/jabardigitalservice/pikobar-pelaporan-backend.git
$ cd pikobar-pelaporan-backend
$ docker-compose up --build
```

Start the server (optional if running without docker):
```bash
$ npm start -s
```

Run tests (tester apps):
```bash
$ npm test
```

## Project Structure
```
.
├── api/
|   ├── users/
|   |   └── validations
|   |   |   └── input.js    * Validation when input method
|   |   |   └── output.js   * Output validation
|   |   └── handlers.js     * Sample handler
|   |   └── index.js        * Index
|   |   └── routes.js       * REST User Routes
|   └── index.js        * Index
|   └── helpers.js      * Helpers function
|   └── validations.js  * Validation checker API
├── config/
|   ├── manifest.js   * Server configuration
|   └── cofig.js      * Database/ other configuration apps
├── auth/
|   └── index.js    * Strategy of API Auth
├── models/
|   └── index.js    * Index
|   └── User.js     * Users model schemas
├── services/
|   └── index.js    * Index
|   └── users.js     * Users service function / controller
├── test/
|   └── index.js    * test apps

```

## License
Copyright (c) 2020 JDS (Jabar Digital Service)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

****
ini fiitur a