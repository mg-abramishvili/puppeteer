const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1/?subsection_id=21')
    
    // const images = await page.$$eval('.strip_of_thumbnails', as => as.map(a => a.querySelector('a').querySelector('img').src.replace('/preview','')))

    // for (const imagefile of images) {
    //     const imagefileDL = await page.goto(imagefile);
    //     fs.writeFile('./uploads/' + imagefile.replace(/^.*[\\\/]/, ''), await imagefileDL.buffer(), function(err) {
    //         if(err) {
    //             return console.log(err);
    //         }
      
    //         console.log("The file was saved!");
    //     })
    // }

    const images = await page.$$eval('.strip_of_thumbnails', as => as.map(a => {
        // return '<div class="carousel-cell"><img src="' + a.querySelector('a').querySelector('img').src.replace('/preview','').replace('http://127.0.0.1/', '') + '" /></div>'
        return '<div class="carousel-cell"><div class="carousel-cell-inner" style="background-image:url(' + a.querySelector('a').querySelector('img').src.replace('/preview','').replace('http://127.0.0.1/', '') + ')"></div></div>'
    }))

    fs.writeFile('images.txt', images.join("\n"), (err) => {
        if(err) throw err
        console.log('OK')
    })

    await browser.close()
}

run()