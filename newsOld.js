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

        const images = await page.$$eval('.strip_of_thumbnails a img', as => as.map(a => a.src.replace('preview/', '')))
        
        // if(images.length) {
        //     for (const imagefile of images) {
        //         const imagefileDL = await page.goto(imagefile);
        //         fs.writeFile('./uploads/' + imagefile.replace(/^.*[\\\/]/, ''), await imagefileDL.buffer(), function(err) {
        //             if(err) {
        //                 return console.log(err);
        //             }
            
        //             console.log("The file was saved!");
        //         })
        //     }
        // }

        // меняем урлы у картинок
        for (var i = 0; i < images.length; i++) {
            images[i] = images[i].replace('http://127.0.0.1/images', '/press/novosti/images');
        }

        const files = await page.$$eval('.files li a', as => as.map(a => a.href))

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

        // console.log('news item saved')
    }

    fs.writeFile('newsOld.json', JSON.stringify(data), (err) => {
        if(err) throw err
    })

    await browser.close()
}

run()