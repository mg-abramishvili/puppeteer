const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://ufa-tr.gazprom.ru/press/video/')

    const videos = await page.evaluate(() => Array.from(document.querySelectorAll('.album'), (a) => ({
        date: a.querySelector(".description .date").innerText,
        title: a.querySelector(".description .text").innerText,
        link: a.getAttribute("data-video-href"),
    })))
    
    fs.writeFile('videos.json', JSON.stringify(videos), (err) => {
        if(err) throw err
        console.log('OK')
    })

    await browser.close()
}

run()