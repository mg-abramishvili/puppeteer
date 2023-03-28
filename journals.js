const puppeteer = require('puppeteer')
const https = require('https')
const fs = require('fs')
const Path = require('path')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://ufa-tr.gazprom.ru/press/journal/')

    // получаем файлы
    const files = await page.$$eval('.journal .media_link a', as => as.map(a => {
        return {
            link: a.href,
            text: a.innerText
        }
    }))
    
    // скачиваем одиночные картинки новостей
    if(files.length) {
        for (const pic of files) {
            if (!fs.existsSync(Path.resolve(__dirname, 'journals', pic.link.split('/')[pic.link.split('/').length - 2] + "_" + pic.link.split('/')[pic.link.split('/').length - 1] + '.pdf'))) {
                https.get(pic.link, res => {
                    const f = fs.createWriteStream(Path.resolve(__dirname, 'journals', pic.link.split('/')[pic.link.split('/').length - 2] + "_" + pic.link.split('/')[pic.link.split('/').length - 1] + '.pdf'))
                
                    res.pipe(f)

                    f.on('finish', () => {
                        f.close()
                        console.log(`File downloaded!`)
                    })
                })
                .on('error', err => {
                    console.log('Error: ', err.message)
                })
            }
        }
    }

    const journals = await page.evaluate(() => Array.from(document.querySelectorAll('.journal'), (a) => ({
        title: a.querySelector(".media_link a").innerText,
        cover: a.querySelector("img").src.replace("=h180", "=h500"),
        file: a.querySelector(".media_link a").href.split('/')[a.querySelector(".media_link a").href.split('/').length - 2] + "_" + a.querySelector(".media_link a").href.split('/')[a.querySelector(".media_link a").href.split('/').length - 1],
    })))
    
    fs.writeFile('journals.json', JSON.stringify(journals), (err) => {
        if(err) throw err
        console.log('OK')
    })

    await browser.close()
}

run()