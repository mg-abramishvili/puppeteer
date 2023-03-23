const puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs')
const Path = require('path')

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        // args: [
        //   '--disable-gpu',
        //   '--disable-dev-shm-usage',
        //   '--disable-setuid-sandbox',
        //   '--no-first-run',
        //   '--no-sandbox',
        //   '--no-zygote',
        //   '--window-size=1280,720',
        // ],
    })
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1/news.php')

    const links = await page.$$eval('.news-list-item a', as => as.map(a => a.href))

    const data = []

    for (const url of links.slice(0, 6)) {
        await page.goto(url)

        // получаем картинки новостей
        const images = await page.$$eval('.strip_of_thumbnails a img', as => as.map(a => a.src.replace('preview/', '')))
        
        // скачиваем картинки новостей
        if(images.length) {
            for (const imagefile of images) {
                http.get(imagefile, res => {
                    const f = fs.createWriteStream(Path.resolve(__dirname, 'uploads', imagefile.replace('http://127.0.0.1/images/', '')))

                    res.pipe(f)

                    f.on('finish', () => {
                        f.close()
                        console.log(`Image downloaded!`)
                    })
                })
                .on('error', err => {
                    console.log('Error: ', err.message)
                })
            }
        }

        // меняем урлы у картинок
        for (var i = 0; i < images.length; i++) {
            images[i] = images[i].replace('http://127.0.0.1/images', '/press/novosti/images');
        }

        // получаем файлы новостей
        const files = await page.$$eval('.files li a', as => as.map(a => a.href))

        // скачиваем файлы новостей
        if(files.length) {
            for (const file of files) {
                http.get(file, res => {
                    const f = fs.createWriteStream(Path.resolve(__dirname, 'uploads', file.replace('http://127.0.0.1/docs/', '')))

                    res.pipe(f)

                    f.on('finish', () => {
                        f.close()
                        console.log(`PDF downloaded!`)
                    })
                })
                .on('error', err => {
                    console.log('Error: ', err.message)
                })
            }
        }

        //меняем урлы у файлов
        for (var i = 0; i < files.length; i++) {
            files[i] = files[i].replace('http://127.0.0.1/docs', '/press/novosti/files');
        }

        // записываем данные в массив
        data.push(...await page.$$eval('#center', (newsItem, images, files) => {
            return newsItem.map(i => {
                return {
                    title: i.querySelector('#news_name').innerText,
                    content: i.querySelector('.content').innerHTML,
                    gallery: images,
                    files: files,
                }
            })
        }, images, files))

        console.log('news item saved')
    }

    // записываем данные в файл
    fs.writeFile('newsOld.json', JSON.stringify(data), (err) => {
        if(err) throw err
    })

    // закрываем браузер
    await browser.close()
}

run()