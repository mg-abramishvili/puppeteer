const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const months = [
        'https://ufa-tr.gazprom.ru/press/news/2023/02/',
        'https://ufa-tr.gazprom.ru/press/news/2023/01/',
        'https://ufa-tr.gazprom.ru/press/news/2022/12/',
        'https://ufa-tr.gazprom.ru/press/news/2022/11/',
        'https://ufa-tr.gazprom.ru/press/news/2022/10/',
        'https://ufa-tr.gazprom.ru/press/news/2022/09/',
        'https://ufa-tr.gazprom.ru/press/news/2022/08/',
        'https://ufa-tr.gazprom.ru/press/news/2022/07/',
        'https://ufa-tr.gazprom.ru/press/news/2022/06/',
        'https://ufa-tr.gazprom.ru/press/news/2022/05/',
        'https://ufa-tr.gazprom.ru/press/news/2022/04/',
        'https://ufa-tr.gazprom.ru/press/news/2022/03/',
        'https://ufa-tr.gazprom.ru/press/news/2022/02/',
        'https://ufa-tr.gazprom.ru/press/news/2022/01/',
        'https://ufa-tr.gazprom.ru/press/news/2021/12/',
        'https://ufa-tr.gazprom.ru/press/news/2021/11/',
        'https://ufa-tr.gazprom.ru/press/news/2021/10/',
        'https://ufa-tr.gazprom.ru/press/news/2021/09/',
        'https://ufa-tr.gazprom.ru/press/news/2021/08/',
        'https://ufa-tr.gazprom.ru/press/news/2021/07/',
        'https://ufa-tr.gazprom.ru/press/news/2021/06/',
        'https://ufa-tr.gazprom.ru/press/news/2021/05/',
        'https://ufa-tr.gazprom.ru/press/news/2021/04/',
        'https://ufa-tr.gazprom.ru/press/news/2021/03/',
        'https://ufa-tr.gazprom.ru/press/news/2021/02/',
        'https://ufa-tr.gazprom.ru/press/news/2021/01/',
        'https://ufa-tr.gazprom.ru/press/news/2020/12/',
        'https://ufa-tr.gazprom.ru/press/news/2020/11/',
        'https://ufa-tr.gazprom.ru/press/news/2020/10/',
        'https://ufa-tr.gazprom.ru/press/news/2020/09/',
        'https://ufa-tr.gazprom.ru/press/news/2020/08/',
        'https://ufa-tr.gazprom.ru/press/news/2020/07/',
        'https://ufa-tr.gazprom.ru/press/news/2020/06/',
        'https://ufa-tr.gazprom.ru/press/news/2020/05/',
        'https://ufa-tr.gazprom.ru/press/news/2020/04/',
        'https://ufa-tr.gazprom.ru/press/news/2020/03/',
        'https://ufa-tr.gazprom.ru/press/news/2020/02/',
        'https://ufa-tr.gazprom.ru/press/news/2020/01/',
        'https://ufa-tr.gazprom.ru/press/news/2019/12/',
        'https://ufa-tr.gazprom.ru/press/news/2019/11/',
        'https://ufa-tr.gazprom.ru/press/news/2019/10/',
        'https://ufa-tr.gazprom.ru/press/news/2019/09/',
        'https://ufa-tr.gazprom.ru/press/news/2019/08/',
        'https://ufa-tr.gazprom.ru/press/news/2019/07/',
        'https://ufa-tr.gazprom.ru/press/news/2019/06/',
        'https://ufa-tr.gazprom.ru/press/news/2019/05/',
        'https://ufa-tr.gazprom.ru/press/news/2019/04/',
        'https://ufa-tr.gazprom.ru/press/news/2019/03/',
        'https://ufa-tr.gazprom.ru/press/news/2019/02/',
        'https://ufa-tr.gazprom.ru/press/news/2019/01/',
        'https://ufa-tr.gazprom.ru/press/news/2018/12/',
        'https://ufa-tr.gazprom.ru/press/news/2018/11/',
        'https://ufa-tr.gazprom.ru/press/news/2018/10/',
        'https://ufa-tr.gazprom.ru/press/news/2018/09/',
        'https://ufa-tr.gazprom.ru/press/news/2018/08/',
        'https://ufa-tr.gazprom.ru/press/news/2018/07/',
        'https://ufa-tr.gazprom.ru/press/news/2018/06/',
        'https://ufa-tr.gazprom.ru/press/news/2018/05/',
        'https://ufa-tr.gazprom.ru/press/news/2018/04/',
        'https://ufa-tr.gazprom.ru/press/news/2018/03/',
        'https://ufa-tr.gazprom.ru/press/news/2018/02/',
        'https://ufa-tr.gazprom.ru/press/news/2018/01/',
        'https://ufa-tr.gazprom.ru/press/news/2017/12/',
        'https://ufa-tr.gazprom.ru/press/news/2017/11/',
        'https://ufa-tr.gazprom.ru/press/news/2017/10/',
        'https://ufa-tr.gazprom.ru/press/news/2017/09/',
        'https://ufa-tr.gazprom.ru/press/news/2017/08/',
        'https://ufa-tr.gazprom.ru/press/news/2017/07/',
        'https://ufa-tr.gazprom.ru/press/news/2017/06/',
        'https://ufa-tr.gazprom.ru/press/news/2017/05/',
        'https://ufa-tr.gazprom.ru/press/news/2017/04/',
        'https://ufa-tr.gazprom.ru/press/news/2017/03/',
        'https://ufa-tr.gazprom.ru/press/news/2017/02/',
        'https://ufa-tr.gazprom.ru/press/news/2017/01/',
        'https://ufa-tr.gazprom.ru/press/news/2016/12/',
        'https://ufa-tr.gazprom.ru/press/news/2016/11/',
        'https://ufa-tr.gazprom.ru/press/news/2016/10/',
        'https://ufa-tr.gazprom.ru/press/news/2016/09/',
        'https://ufa-tr.gazprom.ru/press/news/2016/08/',
        'https://ufa-tr.gazprom.ru/press/news/2016/07/',
        'https://ufa-tr.gazprom.ru/press/news/2016/06/',
        'https://ufa-tr.gazprom.ru/press/news/2016/05/',
        'https://ufa-tr.gazprom.ru/press/news/2016/04/',
        'https://ufa-tr.gazprom.ru/press/news/2016/03/',
        'https://ufa-tr.gazprom.ru/press/news/2016/02/',
        'https://ufa-tr.gazprom.ru/press/news/2016/01/',
        'https://ufa-tr.gazprom.ru/press/news/2015/12/',
        'https://ufa-tr.gazprom.ru/press/news/2015/11/',
        'https://ufa-tr.gazprom.ru/press/news/2015/10/',
        'https://ufa-tr.gazprom.ru/press/news/2015/09/',
        'https://ufa-tr.gazprom.ru/press/news/2015/08/',
        'https://ufa-tr.gazprom.ru/press/news/2015/07/',
        'https://ufa-tr.gazprom.ru/press/news/2015/06/',
        'https://ufa-tr.gazprom.ru/press/news/2015/05/',
        'https://ufa-tr.gazprom.ru/press/news/2015/04/',
        'https://ufa-tr.gazprom.ru/press/news/2015/03/',
        'https://ufa-tr.gazprom.ru/press/news/2015/02/',
        'https://ufa-tr.gazprom.ru/press/news/2015/01/',
        'https://ufa-tr.gazprom.ru/press/news/2014/12/',
        'https://ufa-tr.gazprom.ru/press/news/2014/11/',
        'https://ufa-tr.gazprom.ru/press/news/2014/10/',
        'https://ufa-tr.gazprom.ru/press/news/2014/09/',
        'https://ufa-tr.gazprom.ru/press/news/2014/08/',
        'https://ufa-tr.gazprom.ru/press/news/2014/07/',
        'https://ufa-tr.gazprom.ru/press/news/2014/06/',
        'https://ufa-tr.gazprom.ru/press/news/2014/05/',
        'https://ufa-tr.gazprom.ru/press/news/2014/04/',
        'https://ufa-tr.gazprom.ru/press/news/2014/03/',
    ]

    const data = []

    for (const month of months) {
        await page.goto(month)

        // получение ссылок на детальные страницы каждой новости
        const links = await page.evaluate(() => Array.from(document.querySelectorAll('.news_list_item h3 a'), (e) => e.href ))

        for (const url of links) {
            await page.goto(url)

            // скачивание картинок
            // const images = await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper img'), (e) => e.src ))

            // if(images.length) {
            //     for (const imagefile of images) {
            //         console.log(imagefile)
            //         const imagefileDL = await page.goto(imagefile)
            //         fs.writeFile('./uploads/' + imagefile.replace(/^.*[\\\/]/, '') + '.jpg', await imagefileDL.buffer(), function(err) {
            //             if(err) {
            //                 console.log(err)
            //             }
            //         })
            //     }
            // }

            // Обработка блоков с картинками (замена урлов на локальные, удаление лишних ссылок и дивов)
            await page.evaluate(() => {
                const divs = document.querySelectorAll('#content_wrapper .media')
                if(divs.length) {
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
                }
            })

            // удаление лишних тегов (nav)
            await page.evaluate(() => {
                const divs = document.querySelectorAll('#content_wrapper nav')
                if(divs.length) {
                    divs.forEach(div => {
                        div.remove()
                    })
                }
            })

            // удаление лишних тегов (child_navigation_wrapper)
            await page.evaluate(() => {
                const divs = document.querySelectorAll('.child_navigation_wrapper')
                if(divs.length) {
                    divs.forEach(div => {
                        div.remove()
                    })
                }
            })

            // удаление лишних тегов (img_source)
            await page.evaluate(() => {
                const divs = document.querySelectorAll('.img_source')
                if(divs.length) {
                    divs.forEach(div => {
                        div.remove()
                    })
                }
            })

            // удаление лишних тегов (img_source)
            await page.evaluate(() => {
                const divs = document.querySelectorAll('.other_excusive_reports')
                if(divs.length) {
                    divs.forEach(div => {
                        div.remove()
                    })
                }
            })

            // удаление лишних тегов (news_item_signature)
            await page.evaluate(() => {
                const divs = document.querySelectorAll('.news_item_signature')
                if(divs.length) {
                    divs.forEach(div => {
                        div.remove()
                    })
                }
            })

            // сохранение новости в массив
            data.push(...await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper'), (i) => ({
                date: i.querySelector('time').innerText.split(',')[0],
                title: i.querySelector('h1').innerText,
                cover: i.querySelectorAll('.media')[0] ? '/press/novosti/images/thumbs/' + i.querySelectorAll('.media')[0].querySelector('img').src.substring(i.querySelectorAll('.media')[0].querySelector('img').src.lastIndexOf('/')+1) : '',
                content: i.innerHTML.split('<p>​</p>').join('').replace('<h1>' + i.querySelector('h1').innerHTML + '</h1>', "").replace('<time class="date">' + i.querySelector('time').innerHTML + '</time>', ""),
            }))))

            console.log('news item saved')
        }
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