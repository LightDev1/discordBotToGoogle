import { getPictures, clearPicsArray } from './searching.js';
import fsExtra from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

const searchPictures = async (bot, msg, args) => {
    try {
        msg.channel.send('Бот ищет картинки по вашему запросу. Это может занять пару минут');

        const queryArray = args.slice(1, args.length);
        const queryString = queryArray.join(' ');

        const countOfPictures = await getPictures(queryString);

        for (let i = 0; i < countOfPictures; i++) {
            msg.channel.send('-', { files: [path.resolve(__dirname, 'images', `img_${i}.png`)] });
        }

        fsExtra.emptyDir(path.join(__dirname, 'images'));

        clearPicsArray();
    } catch (error) {
        console.log(error);
        msg.channel.send('Возникла ошибка, попробуйте снова');
    }
};

export const commands = [
    {
        name: 'search',
        out: searchPictures,
        about: 'Команда для поиска картинок в яндексе',
    }
];