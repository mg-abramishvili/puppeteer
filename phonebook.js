const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1/phonebook.php')

    const phonebook = await page.$$eval('table.users tbody tr', trs => trs.map(tr => {
        const tds = [...tr.getElementsByTagName('td')];
        return {
            fio: tds.map(td => td.textContent)[0],
            job: tds.map(td => td.textContent)[1],
            tel_inner: tds.map(td => td.textContent)[2],
            tel_city: tds.map(td => td.textContent)[3],
            kb: tds.map(td => td.textContent)[4]
        }
    }));

    fs.writeFile('phonebook.json', JSON.stringify(phonebook), (err) => {
        if(err) throw err
        console.log('OK')
    })

    await browser.close()
}

run()