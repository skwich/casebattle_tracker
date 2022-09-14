import axios from "axios";
import * as cheerio from 'cheerio';
import { config } from "dotenv";
config();

export const sleep = async (name) => {
    const random_num = Math.floor(Math.random() * (350 - 200)) + 200;
    console.log(`${name}: ${random_num} ms`);
    return new Promise(
        r => setTimeout(() => {
            r();
        }, random_num)
    );
}

const GetHTML = async url => {
    const {data} = await axios.get(url);
    return cheerio.load(data);
}

export const GetWeaponName = async url => {
    const $ = await GetHTML(url);
    return $('.skin-image').attr('alt');
}

export const GetWeaponPrice = async url => {
    const $ = await GetHTML(url);
    return $('.__balance').first().text();
}

export const GetActivity = async url => {
    const $ = await GetHTML(url);
    const total_cases = $('.ico-stat').eq(0).find('span').text();
    const total_upgrades = $('.ico-stat').eq(1).find('span').text();
    const total_contracts = $('.ico-stat').eq(2).find('span').text();
    return [total_cases, total_upgrades, total_contracts];
}

export const GetCaseName = async url => {
    const $ = await GetHTML(url);
    return $('.source-ico').attr('data-tooltip-content');
}

export const GetCasePrice = async url => {
    const $ = await GetHTML(url);
    const site = await GetHTML(process.env.SITE_URL);

    let case_name = $('.source-ico').attr('data-tooltip-content');
    case_name = String(case_name).substring(
        String(case_name).indexOf('«') + 1,
        String(case_name).indexOf('»')
    );
    let case_price = site(`[data-title="${case_name}"]`).find('.border-box span').text();
    return String(case_price).substring(0, String(case_price).indexOf(' '));
}

export const GetUpgradedWeapon = async url => {
    const $ = await GetHTML(url);
    const weapon = {
        name: '',
        price: ''
    };

    $('.unit').each((i, element) => {
        if ($(element).find('.si').attr('data-tooltip-content') == 'Использован в Апгрейде‎') {
            weapon.name = $(element).find('.skin-image').attr('alt');
            weapon.price = $(element).find('.__balance').eq(0).text();
            return false;
        }
    })
    return weapon;
}

export const GetContractedWeapons = async url => {
    const $ = await GetHTML(url);
    const weapons = [];

    $('.unit').each((i, element) => {
        if ($(element).find('.source-ico').attr('data-tooltip-content') == 'Из контракта' && i > 0) {
            return false;
        }

        if ($(element).find('.si').attr('data-tooltip-content') == 'Использован в Контракте‎') {
            let name = $(element).find('.skin-image').attr('alt'),
                price = $(element).find('.__balance').eq(0).text();

            weapons.push({name, price});
        }
    })
    return weapons;
}