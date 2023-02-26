const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://ufa-tr.gazprom.ru/press/video/')

    const videos = await page.evaluate(() => Array.from(document.querySelectorAll('.album'), (a) => ({
        date: a.getAttribute("time"),
        title: a.getAttribute("data-name"),
        link: a.getAttribute("data-video-href"),
        cover: a.querySelector('img').src.replace('=h180', '=h500')
    })))

    for (const imagefile of videos) {
        const imagefileDL = await page.goto(imagefile.cover);
        fs.writeFile('./uploads/' + imagefile.cover.replace(/^.*[\\\/]/, ''), await imagefileDL.buffer(), function(err) {
            if(err) {
                return console.log(err);
            }
      
            console.log("The file was saved!");
        })
    }
    
    // fs.writeFile('videos.json', JSON.stringify(videos), (err) => {
    //     if(err) throw err
    //     console.log('OK')
    // })

    await browser.close()
}

run()