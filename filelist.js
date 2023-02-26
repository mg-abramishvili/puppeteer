const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1/?subsection_id=-44')

    const files = await page.$$eval('a', as => as.map(a => {
        return '<li><a href="' + a.href.replace('http://127.0.0.1/docs', '/docfiles') + '"><span>' + a.innerText + '</span></a></li>'
    }))

    fs.writeFile('files.txt', files.join("\n"), (err) => {
        if(err) throw err
        console.log('OK')
    })

    await browser.close()
}

run()