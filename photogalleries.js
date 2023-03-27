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
    await page.goto('http://127.0.0.1/gallery.php?galsection_id=-9')

    const links = await page.$$eval('.gallery tr a', as => as.map(a => a.href))

    const data = []

    for (const url of links.slice(0,35).reverse()) {
        await page.goto(url)

        // получаем одиночные картинки новостей
        const images = await page.$$eval('#pictures tr a', as => as.map(a => {
            return {
                img: a.href,
                text: a.querySelector('img').getAttribute('alt'),
            }
        }))

        // меняем урлы у одиночных картинок новостей
        // for (var i = 0; i < images.length; i++) {
        //     images[i] = images[i].replace('http://127.0.0.1/images/gal_pics', '/press/photogallery/images');
        // }

        // записываем данные в массив
        data.push(...await page.$$eval('#center', (gallery, images) => {
            return gallery.map(i => {
                return {
                    date: i.querySelector('#date').innerText.replace('-', '/').replace('-', '/').split(" ")[0],
                    title: i.querySelector('#gal_name').innerText,
                    gallery: images.length ? images : '',
                }
            })
        }, images))

        console.log('gallery saved')
    }

    // подготовка данных для битрикса
    const finalData = []

    data.forEach((i, index) => {
        i.gallery.forEach(g => {
            finalData.push({
                id: index + 6000,
                date: i.date,
                title: i.title,
                image: g.img,
                text: g.text,
            })
        })
    })

    // записываем данные в файл
    fs.writeFile('galleries.json', JSON.stringify(finalData), (err) => {
        if(err) throw err
    })

    // закрываем браузер
    await browser.close()
}

run()