const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    await page.goto('https://ufa-tr.gazprom.ru/press/news/2023/02/')

    // получение ссылок на детальные страницы каждой новости
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('.news_list_item h3 a'), (e) => e.href ))
    
    const data = []

    for (const url of links) {
        await page.goto(url)

        // скачивание картинок
        const images = await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper img'), (e) => e.src ))

        for (const imagefile of images) {
            const imagefileDL = await page.goto(imagefile)
            fs.writeFile('./uploads/' + imagefile.replace(/^.*[\\\/]/, '') + '.jpg', await imagefileDL.buffer(), function(err) {
                if(err) {
                    return console.log(err)
                }
            })
        }

        // Обработка блоков с картинками (замена урлов на локальные, удаление лишних ссылок и дивов)
        await page.evaluate(() => {
            const divs = document.querySelectorAll('#content_wrapper .media')
            divs.forEach(div => {
                let img = document.createElement("img")

                img.setAttribute("src", '/press/novosti/images/' + div.querySelector('img').src.substring(div.querySelector('img').src.lastIndexOf('/')+1) + '.jpg')

                div.insertBefore(img, div.childNodes[0])
                
                if(div.querySelector('a')) {
                    div.querySelector('a').remove()
                }
                if(div.querySelectorAll('img')[1]) {
                    div.querySelectorAll('img')[1].remove()
                }
            })
        })

        // удаление лишних тегов (nav)
        await page.evaluate(() => {
            const divs = document.querySelectorAll('#content_wrapper nav')
            divs.forEach(div => {
                div.remove()
            })
        })

        // удаление лишних тегов (child_navigation_wrapper)
        await page.evaluate(() => {
            const divs = document.querySelectorAll('.child_navigation_wrapper')
            divs.forEach(div => {
                div.remove()
            })
        })

        // удаление лишних тегов (img_source)
        await page.evaluate(() => {
            const divs = document.querySelectorAll('.img_source')
            divs.forEach(div => {
                div.remove()
            })
        })

        // сохранение новости в массив
        data.push(...await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper'), (i) => ({
            date: i.querySelector('time').innerText.split(',')[0],
            title: i.querySelector('h1').innerText,
            content: i.innerHTML.split('<p>​</p>').join(''),
        }))))
    }

    // запись файла
    fs.writeFile('news.json', JSON.stringify(data), (err) => {
        if(err) throw err
        console.log('OK')
    })


    // закрываем браузер
    await browser.close()
}

run()