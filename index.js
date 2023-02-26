const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://ufa-tr.gazprom.ru/press/news/2022/12/')

    // const links = await page.$$eval('a', as => as.map(a => a.href))
    
    // for (const imagefile of images) {
    //     const imagefileDL = await page.goto(imagefile);
    //     fs.writeFile('./uploads/' + imagefile.replace(/^.*[\\\/]/, ''), await imagefileDL.buffer(), function(err) {
    //         if(err) {
    //             return console.log(err);
    //         }
      
    //         console.log("The file was saved!");
    //     })
    // }

    const news = await page.evaluate(() => Array.from(document.querySelectorAll('.news_list_item h3 a'), (e) => e.href ))
    
    const hrefsPages = [];

    for (const url of news) {
        await page.goto(url)

        hrefsPages.push(...await page.evaluate(() => Array.from(document.querySelectorAll('#content_wrapper'), (a) => ({
            date: a.querySelector('time').innerText,
            title: a.querySelector('h2').innerText,
            content: a.innerHTML.replace(/<(\/?|\!?)(h2|time)>/, "")
        }))))
    }

    fs.writeFile('news.json', JSON.stringify(hrefsPages), (err) => {
        if(err) throw err
        console.log('OK')
    })

    await browser.close()
}

run()