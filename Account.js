import * as parser from './parser.js';
import * as telegram from './telegram.js';

export class Account {
    constructor(name, url, ...data) {
        this.name = name;
        this.url = url;
        this.total_cases = data.total_cases;
        this.total_upgrades = data.total_upgrades;
        this.total_contracts = data.total_contracts;

        this.active = true;
    }

    async Start() {
        console.log(`${this.name} has been started.`);
        while(this.active) {
            await this.Activity();
        }
        console.log(`${this.name} has been stopped.`);
    }

    async Stop() {
        this.active = false;
    }

    async Activity() {
        await parser.sleep(this.name);
        const activity_arr = await parser.GetActivity(this.url);
        const total_cases = activity_arr[0];
        const total_upgrades = activity_arr[1];
        const total_contracts = activity_arr[2];

        if(total_cases > this.total_cases) {
            telegram.OpenCase(
                            this.name,
                            this.url,
                            await parser.GetCaseName(this.url),
                            await parser.GetCasePrice(this.url),
                            await parser.GetWeaponName(this.url),
                            await parser.GetWeaponPrice(this.url)
                        );
        }
        else if(total_upgrades > this.total_upgrades) {
            let weapon, drop, drop_name, drop_price;
            if (await parser.GetCaseName(this.url) == 'Из апгрейда') {
                drop = true;
                drop_name = await parser.GetWeaponName(this.url);
                drop_price = await parser.GetWeaponPrice(this.url);
            } else {
                drop = false;
                drop_name = '';
                drop_price = 0;
            }

            weapon = await parser.GetUpgradedWeapon(this.url);

            telegram.UpgradeWeapon(
                this.name,
                this.url,
                weapon.name,
                weapon.price,
                drop,
                drop_name,
                drop_price
            );
        }
        else if(total_contracts > this.total_contracts) {
            const weapon = {
                name: await parser.GetWeaponName(this.url),
                price: await parser.GetWeaponPrice(this.url)
            }

            const contracted_weapons = await parser.GetContractedWeapons(this.url);
            console.log(contracted_weapons);

            telegram.Contract(
                this.name,
                this.url,
                weapon,
                contracted_weapons
            );
        }

        this.total_cases = total_cases;
        this.total_upgrades = total_upgrades;
        this.total_contracts = total_contracts;
    }
}