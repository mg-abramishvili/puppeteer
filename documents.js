const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1/docs1.php?cat_id=-1&name=&number=&period_s=&period_e=')

    const documents = await page.$$eval('.users tbody tr', as => as.map(a => {
        return {
            number: a.querySelectorAll('td')[0] ? a.querySelectorAll('td')[0].innerText : '',
            category: a.querySelectorAll('td')[1] ? a.querySelectorAll('td')[1].innerText : '',
            name: a.querySelectorAll('td')[2] ? a.querySelectorAll('td')[2].innerText : '',
            file: a.querySelectorAll('td')[2] && a.querySelectorAll('td')[2].querySelector('a') ? a.querySelectorAll('td')[2].querySelector('a').href.replace("http://127.0.0.1/docs/", "/docfiles/") : '',
            date: a.querySelectorAll('td')[3] ? a.querySelectorAll('td')[3].innerText : '',
            comment: a.querySelectorAll('td')[4] ? a.querySelectorAll('td')[4].innerText : '',
        }
    }))
    
    fs.writeFile('documents.json', JSON.stringify(documents), (err) => {
        if(err) throw err
        console.log('Done: ' + documents.length)
    })

    await browser.close()
}

run()