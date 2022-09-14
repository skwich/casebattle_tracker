import TelegramApi from 'node-telegram-bot-api';
import { config } from "dotenv";
config();

const bot = new TelegramApi(process.env.TOKEN, {polling: true});
const chatId = process.env.CHAT_ID;
const emoji = {
    rub: '₽',
    person: '👤',
    package: '📦',
    gear: '⚙️',
    gift: '🎁',
    gem: '💎',
    white_check_mark: '✅',
    x: '❌',
    chart_with_upwards_trend: '📈',
    no_entry_sign: '🚫'
}

export const OpenCase = (name, url, case_name, case_price, weapon_name, weapon_price) => {
    bot.sendMessage(chatId,
`
${emoji.person} [${name}](${url}) открыл кейс:

${emoji.package} *${case_name}* (${case_price} ₽)
${emoji.gift} *Дроп*: **${weapon_name}** (${weapon_price} ₽)
${emoji.gem} *Окупаемость*: ${Number(weapon_price - case_price).toFixed(2)} ₽
`,
        {parse_mode:'Markdown'});
}

export const UpgradeWeapon = (name, url, weapon_name, weapon_price, drop=false, drop_name='', drop_price=0) => {
    const yes = `${emoji.white_check_mark} *Дроп*: **${drop_name}** (${drop_price} ₽)`;
    const no = `${emoji.x} *Дроп не выпал*`;
    bot.sendMessage(chatId,
`
${emoji.chart_with_upwards_trend} [${name}](${url}) использовал в апгрейде:

${emoji.no_entry_sign} *${weapon_name}* (${weapon_price} ₽)
${ drop ? yes : no }
${emoji.gem} *Окупаемость*: ${Number(drop_price - weapon_price).toFixed(2)} ₽
`,
        {parse_mode:'Markdown'});
}

export const Contract = async (name, url, weapon, contracted_weapons) => {
    const str = await ContractWeapons(weapon, contracted_weapons);
    bot.sendMessage(chatId,
`
${emoji.gear} [${name}](${url}) сделал контракт:

${str}
`,
        {parse_mode:'Markdown'});
}

const ContractWeapons = async (weapon, contracted_weapons) => {
    let str = '',
        sum = 0;
    for (let i = 0; i < contracted_weapons.length; i++) {
        sum += Number(contracted_weapons[i].price);
        str += `${emoji.x} *${contracted_weapons[i].name}* (${contracted_weapons[i].price} ${emoji.rub})\n`
    }
    str += `\n${emoji.white_check_mark} *${weapon.name}* (${weapon.price} ${emoji.rub})`;
    str += `\n${emoji.gem} *Окупаемость*: ${Number(weapon.price - sum).toFixed(2)} ${emoji.rub}`;
    return str;
}