import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

let picturesArray = [];

export const getPictures = async (query) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://yandex.ru/images/?utm_source=main_stripe_big', {
        waitUntil: 'domcontentloaded'
    });

    try {
        await page.$eval('input[name="text"]', (el, value) => el.value = value, query);
    } catch (error) {
        console.log(error);
        throw new Error('Ошибка при совершении запроса');
    }

    await page.click('button[type="submit"]');

    await page.waitForSelector('div.serp-controller__content');

    let picturesLinks = await page.evaluate(async () => {
        let response = [];

        const container = document.querySelector('div.serp-list.serp-list_type_search.serp-list_unique_yes.serp-list_rum_yes.serp-list_justifier_yes.serp-controller__list.counter__reqid.clearfix.i-bem.serp-list_js_inited')

        for (const child of container.children) {
            if (!child.querySelector('img.serp-item__thumb.justifier__thumb')) {
                continue;
            }

            const imgLink = child.querySelector('a.serp-item__link').href;
            response.push(imgLink);
        }

        return response;
    });

    for (let i = 0; i < picturesLinks.length; i++) {
        console.log(picturesLinks[i]);
        await page.goto(picturesLinks[i], { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('div.MMImageWrapper');

        let picture = await page.evaluate(async () => {
            const container = document.querySelector('div.MMImageWrapper')
            const img = container.querySelector('img.MMImage-Origin').src;

            console.log(img);

            return img;
        });

        picturesArray.push(picture);
    }

    console.log(picturesArray);

    for (let i = 0; i < picturesArray.length; i++) {
        const imageSource = await page.goto(picturesArray[i], { timeout: 0 });
        console.log(picturesArray[i]);
        fs.writeFile(path.resolve(__dirname, 'images', `img_${i}.png`), await imageSource.buffer(), (err) => {
            if (err) {
                return console.log(err);
            }
        });
    }

    console.log('Изображения были сохранены');

    browser.close();

    return picturesArray.length;
};

export const clearPicsArray = () => {
    picturesArray = [];
};