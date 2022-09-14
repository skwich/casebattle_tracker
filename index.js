import { Account } from './Account.js';
import { config } from "dotenv";
config();

(function main() {
    const Ilya = new Account('Илья', process.env.URL1);
    const Max = new Account('Макс', process.env.URL2);

    Ilya.Start();
    Max.Start();
})();