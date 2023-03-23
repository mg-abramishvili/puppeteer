const puppeteer = require('puppeteer')
const fs = require('fs')

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

    for (const url of links.slice(0, 5)) {
        await page.goto(url)

        const images = await page.$$eval('.strip_of_thumbnails a img', as => as.map(a => a.src.replace('preview/', '')))
        
        if(images.length) {
            for (const imagefile of images) {
                const imagefileDL = await page.goto(imagefile);
                fs.writeFile('./uploads/' + imagefile.replace(/^.*[\\\/]/, ''), await imagefileDL.buffer(), function(err) {
                    if(err) {
                        return console.log(err);
                    }
            
                    console.log("The file was saved!");
                })
            }
        }

        data.push(...await page.$$eval('#center', (newsItem) => {
            return newsItem.map(i => {
                return {
                    title: i.querySelector('#news_name').innerText,
                    content: i.querySelector('.content').innerHTML,
                }
            })
        }))

        console.log('news item saved')
    }

    fs.writeFile('newsOld.json', JSON.stringify(data), (err) => {
        if(err) throw err
    })

    await browser.close()
}

run()