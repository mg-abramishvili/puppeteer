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
    await page.goto('http://127.0.0.1/news.php')

    const links = await page.$$eval('.news-list-item a', as => as.map(a => a.href))

    const data = []

    const totalImages = []

    for (const url of links.slice(0, 10000)) {
        await page.goto(url)

        // получаем одиночные картинки новостей
        const pics = await page.$$eval('[rel="lightbox"]', as => as.map(a => a.href))

        // скачиваем одиночные картинки новостей
        if(pics.length) {
            for (const pic of pics) {
                if(pic.includes('.jpg') || pic.includes('.jpeg') || pic.includes('.png') || pic.includes('.gif') || pic.includes('.bmp')) {
                    http.get(pic, res => {
                        const f = fs.createWriteStream(Path.resolve(__dirname, 'novosti/images', pic.replace('http://127.0.0.1/images/', '')))

                        res.pipe(f)

                        f.on('finish', () => {
                            f.close()
                            console.log(`Image downloaded!`)
                        })
                    })
                    .on('error', err => {
                        console.log('Error: ', err.message)
                    })

                    totalImages.push(1)
                }
            }
        }

        // меняем урлы у одиночных картинок новостей
        for (var i = 0; i < pics.length; i++) {
            pics[i] = pics[i].replace('http://127.0.0.1/images', '/press/novosti/images');
        }

        // получаем картинки новостей
        const images = await page.$$eval('.strip_of_thumbnails a img', as => as.map(a => a.src.replace('preview/', '')))

        // скачиваем картинки новостей
        if(images.length) {
            for (const imagefile of images) {
                if(imagefile.includes('.jpg') || imagefile.includes('.jpeg') || imagefile.includes('.png') || imagefile.includes('.gif') || imagefile.includes('.bmp')) {
                    http.get(imagefile, res => {
                        const f = fs.createWriteStream(Path.resolve(__dirname, 'novosti/images', imagefile.replace('http://127.0.0.1/images/', '')))

                        res.pipe(f)

                        f.on('finish', () => {
                            f.close()
                            console.log(`Image downloaded!`)
                        })
                    })
                    .on('error', err => {
                        console.log('Error: ', err.message)
                    })

                    totalImages.push(1)
                }
            }
        }

        // меняем урлы у картинок
        for (var i = 0; i < images.length; i++) {
            images[i] = images[i].replace('http://127.0.0.1/images', '/press/novosti/images');
        }

        // получаем файлы новостей
        const files = await page.$$eval('.files li a', as => as.map(a => a.href))

        // скачиваем файлы новостей
        if(files.length) {
            for (const file of files) {
                http.get(file, res => {
                    const f = fs.createWriteStream(Path.resolve(__dirname, 'novosti/files', file.replace('http://127.0.0.1/docs/', '')))

                    res.pipe(f)

                    f.on('finish', () => {
                        f.close()
                        console.log(`PDF downloaded!`)
                    })
                })
                .on('error', err => {
                    console.log('Error: ', err.message)
                })
            }
        }

        //меняем урлы у файлов
        for (var i = 0; i < files.length; i++) {
            files[i] = files[i].replace('http://127.0.0.1/docs', '/press/novosti/files');
        }

        // записываем данные в массив
        data.push(...await page.$$eval('#center', (newsItem, pics, images, files) => {
            return newsItem.map(i => {
                return {
                    date: i.querySelector('#news_date').innerText.replace('-', '/').replace('-', '/').split(" ")[0],
                    title: i.querySelector('#news_name').innerText,
                    content: i.querySelector('.content').innerHTML,
                    pic: pics.length ? pics[0] : '',
                    gallery: images.length ? images : '',
                    files: files.length ? files : '',
                }
            })
        }, pics, images, files))

        console.log('news item saved')
    }

    // перестраиваем строки для импорта битрикса
    const finalData = []

    data.forEach(i => {
        if(i.gallery.length && i.files.length) {
            i.gallery.forEach(galleryItem => {
                i.files.forEach(fileItem => {
                    finalData.push({
                        date: i.date,
                        title: i.title,
                        content: i.content,
                        pic: i.pic,
                        gallery: galleryItem,
                        files: fileItem,
                    })
                })
            })
        } else if(i.gallery.length && !i.files.length) {
            i.gallery.forEach(galleryItem => {
                finalData.push({
                    date: i.date,
                    title: i.title,
                    content: i.content,
                    pic: i.pic,
                    gallery: galleryItem,
                    files: i.files,
                })
            })
        } else if(i.files.length && !i.gallery.length) {
            i.files.forEach(fileItem => {
                finalData.push({
                    date: i.date,
                    title: i.title,
                    content: i.content,
                    pic: i.pic,
                    gallery: i.gallery,
                    files: fileItem,
                })
            })
        } else {
            finalData.push(i)
        }
    })


    // записываем данные в файл
    fs.writeFile('newsOld.json', JSON.stringify(finalData), (err) => {
        if(err) throw err
    })

    console.log(totalImages.reduce((partialSum, a) => partialSum + a, 0))

    // закрываем браузер
    await browser.close()
}

run()