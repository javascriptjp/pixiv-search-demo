//https://www.pixiv.net/search.php?word=hentai
const https = require('https')
const fs = require('fs')
let download = 0;
const checkNameFormat = (name) => {
    const pattern = /[\\\/:\*\?\"<>\|]/g
    return name.replace(pattern, "")
}
const SearchPixiv = (word = "javascript", lang = "ja", p = null) => {
    if(!fs.existsSync("pic"))fs.mkdirSync("pic")
    const options = {
        host: 'www.pixiv.net',
        path: `/ajax/search/illustrations/${encodeURI(word)}?lang=${lang}${p==null?"":`&word=${encodeURI(word)}&s_mode=s_tag_full&mode=all&order=date_d&type=illust_and_ugoira&p=${p}`}`,
        "mode": "cors",
        headers: {
            'Referer': "https://www.pixiv.net"
        }
    }
    https.get(options, (res) => {
        let body = ''
        res.on('data',chunk=>body+=chunk)
        res.on('end', (ress) => {
            ress = JSON.parse(body)
            ress.body.illust.data.forEach(item => {
                if(item.url == undefined)return
                let title = "pic/" + checkNameFormat(item.url)
                getImage(item.url, title).then(i=>{
                    download++;
                    console.log(download)
                })
            })
        })
    }).on('error',e=>console.log(e.message))
}
const getImage = (url, filename) => new Promise((resolve, reject) => {
    const imageOption = {
        host: 'i.pximg.net',
        path: url.replace("https://i.pximg.net", ""),
        headers: {
            'Referer': "https://www.pixiv.net",
            "sec-fetch-dest": "image",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1"
        }
    }
    https.get(imageOption, (res) => {
        res.pipe(fs.createWriteStream(filename))
        .on('error', reject)
        .once('close', () => resolve(filename))
    })
})

const SearchPixivLoop = (word, num = 1, lang = "ja") => {
    for (let index = 1; index < num +1; index++) {
        SearchPixiv(word, "ja", index, lang)
    }
}