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
                fio: tds.map(td => td.textContent)[0],
                job: tds.map(td => td.textContent)[1],
                tel_inner: tds.map(td => td.textContent)[2],
                tel_city: tds.map(td => td.textContent)[3],
                kb: tds.map(td => td.textContent)[4].trim().replace('NULL', ''),
                otdel: getOtdelPath(tr.closest('.nsh_closed')),
            }
        }

        function getOtdelPath(otdelElement) {
            let otdel = otdelElement.querySelector('a').innerText

            let path = []

            path.push(otdel.trim())

            if(getParent(otdelElement)) {
                path.push(getParent(otdelElement).trim())

                if(getParent(otdelElement.parentElement)) {
                    path.push(getParent(otdelElement.parentElement).trim())

                    if(getParent(otdelElement.parentElement.parentElement)) {
                        path.push(getParent(otdelElement.parentElement.parentElement).trim())

                        if(getParent(otdelElement.parentElement.parentElement.parentElement)) {
                            path.push(getParent(otdelElement.parentElement.parentElement.parentElement).trim())

                            if(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement)) {
                                path.push(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement).trim())

                                if(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement)) {
                                    path.push(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement).trim())

                                    if(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)) {
                                        path.push(getParent(otdelElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement).trim())
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
                
            return pathWithoutDuplicates.reverse().join('|')
                .replace("ОБ ОБЩЕСТВЕ|АППАРАТ УПРАВЛЕНИЯ", "АППАРАТ УПРАВЛЕНИЯ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|АРКАУЛОВСКОЕ ЛПУМГ", "АРКАУЛОВСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|ДЮРТЮЛИНСКОЕ ЛПУМГ", "ДЮРТЮЛИНСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|ИНЖЕНЕРНО-ТЕХНИЧЕСКИЙ ЦЕНТР", "ИНЖЕНЕРНО-ТЕХНИЧЕСКИЙ ЦЕНТР")
                .replace("АППАРАТ УПРАВЛЕНИЯ|КАРМАСКАЛИНСКОЕ ЛПУМГ", "КАРМАСКАЛИНСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|МЕДИКО-САНИТАРНАЯ ЧАСТЬ", "МЕДИКО-САНИТАРНАЯ ЧАСТЬ")
                .replace('АППАРАТ УПРАВЛЕНИЯ|ОБЪЕДИНЕННАЯ ПЕРВИЧНАЯ ПРОФСОЮЗНАЯ ОРГАНИЗАЦИЯ "ГАЗПРОМ ТРАНСГАЗ УФА ПРОФСОЮЗ"', 'ОБЪЕДИНЕННАЯ ПЕРВИЧНАЯ ПРОФСОЮЗНАЯ ОРГАНИЗАЦИЯ "ГАЗПРОМ ТРАНСГАЗ УФА ПРОФСОЮЗ"')
                .replace("АППАРАТ УПРАВЛЕНИЯ|ПОЛЯНСКОЕ ЛПУМГ", "ПОЛЯНСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|ПРИЮТОВСКОЕ ЛПУМГ", "ПРИЮТОВСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|СИБАЙСКОЕ ЛПУМГ", "СИБАЙСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|СЛУЖБА КОРПОРАТИВНОЙ ЗАЩИТЫ", "СЛУЖБА КОРПОРАТИВНОЙ ЗАЩИТЫ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|СТЕРЛИТАМАКСКОЕ ЛПУМГ", "СТЕРЛИТАМАКСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|СТОРОННИЕ ОРГАНИЗАЦИИ", "СТОРОННИЕ ОРГАНИЗАЦИИ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|УПРАВЛЕНИЕ АВАРИЙНО-ВОССТАНОВИТЕЛЬНЫХ РАБОТ", "УПРАВЛЕНИЕ АВАРИЙНО-ВОССТАНОВИТЕЛЬНЫХ РАБОТ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|УПРАВЛЕНИЕ МАТЕРИАЛЬНОГО-ТЕХНИЧЕСКОГО СНАБЖЕНИЯ И КОМПЛЕКТАЦИИ", "УПРАВЛЕНИЕ МАТЕРИАЛЬНОГО-ТЕХНИЧЕСКОГО СНАБЖЕНИЯ И КОМПЛЕКТАЦИИ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|УПРАВЛЕНИЕ СВЯЗИ", "УПРАВЛЕНИЕ СВЯЗИ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|УПРАВЛЕНИЕ ТЕХНОЛОГИЧЕСКОГО ТРАНСПОРТА И СПЕЦИАЛЬНОЙ ТЕХНИКИ", "УПРАВЛЕНИЕ ТЕХНОЛОГИЧЕСКОГО ТРАНСПОРТА И СПЕЦИАЛЬНОЙ ТЕХНИКИ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|УРГАЛИНСКОЕ ЛПУМГ", "УРГАЛИНСКОЕ ЛПУМГ")
                .replace("АППАРАТ УПРАВЛЕНИЯ|ШАРАНСКОЕ ЛПУМГ ", "ШАРАНСКОЕ ЛПУМГ ")
                .trim()
        }

        function getParent(otdelElement) {
            if(otdelElement.parentElement) {
                return otdelElement.parentElement.querySelector('a').innerText
            }
        }
    }))

    // записываем данные в файл
    fs.writeFile('tel.json', JSON.stringify(phonebook.filter(n => n)), (err) => {
        if(err) throw err
    })

    // закрываем браузер
    await browser.close()
}

run()