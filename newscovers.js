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
        
        const images = await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper .media img'), (e) => e.src ))

        // if(images.length) {
        //     for (const imagefile of images) {
        //         console.log(imagefile)
        //         const imagefileDL = await page.goto(imagefile)
        //         fs.writeFile('./uploadscovers/' + imagefile.replace(/^.*[\\\/]/, '') + '.jpg', await imagefileDL.buffer(), function(err) {
        //             if(err) {
        //                 console.log(err)
        //             }
        //         })
        //     }
        // }
        
        data.push(...await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper .news_list_item'), (i) => ({
            cover: i.querySelectorAll('.media')[0] ? '/press/novosti/images/' + i.querySelectorAll('.media')[0].querySelector('img').src.substring(i.querySelectorAll('.media')[0].querySelector('img').src.lastIndexOf('/')+1) + '.jpg' : '',
        }))))

        console.log('image saved')
    }
    
    fs.writeFile('newscovers.json', JSON.stringify(data), (err) => {
        if(err) throw err
        console.log('OK')
    })


    // закрываем браузер
    await browser.close()
}

run()