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
    await page.goto('http://127.0.0.1/phonebook.php')

    const phonebook = await page.$$eval('table.users tbody tr', trs => trs.map(tr => {
        const tds = [...tr.getElementsByTagName('td')];

        if(tds.map(td => td.textContent)[0]) {
            return {
                // otdel: tr.closest('.nsh_closed').querySelector('a').innerText,
                otdel_path: getOtdelPath(tr.closest('.nsh_closed')),
                fio: tds.map(td => td.textContent)[0],
                job: tds.map(td => td.textContent)[1],
                tel_inner: tds.map(td => td.textContent)[2],
                tel_city: tds.map(td => td.textContent)[3],
                kb: tds.map(td => td.textContent)[4]
            }
        }

        function getOtdelPath(otdelElement) {
            let otdel = otdelElement.querySelector('a').innerText

            let path = []

            path.push(otdel)

            if(getParent(otdelElement)) {
                path.push(getParent(otdelElement))

                if(getParent(otdelElement.parentElement)) {
                    path.push(getParent(otdelElement.parentElement))

                    if(getParent(otdelElement.parentElement.parentElement)) {
                        path.push(getParent(otdelElement.parentElement.parentElement))

                        if(getParent(otdelElement.parentElement.parentElement.parentElement)) {
                            path.push(getParent(otdelElement.parentElement.parentElement.parentElement))

                            if(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement)) {
                                path.push(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement))

                                if(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement)) {
                                    path.push(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement))

                                    if(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)) {
                                        path.push(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement))
                                    }
                                }
                            }
                        }
                    }
                }
            }

            let pathWithoutDuplicates = path.filter((element, index) => {
                return path.indexOf(element) === index
            })
                
            return pathWithoutDuplicates.reverse().join(" | ")
        }

        function getParent(otdelElement) {
            if(otdelElement.parentElement) {
                return otdelElement.parentElement.querySelector('a').innerText
            }
        }
    }))

    console.log(phonebook.slice(200,250))

    // записываем данные в файл
    // fs.writeFile('tel.json', JSON.stringify(finalData), (err) => {
    //     if(err) throw err
    // })

    // закрываем браузер
    await browser.close()
}

run()