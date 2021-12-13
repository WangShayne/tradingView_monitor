
const puppeteer = require('puppeteer');

(async function main() {
    try {
        // 打开浏览器
        const browser = await puppeteer.launch({ headless: false});
        const [page] = await browser.pages();

        // 不打开浏览器
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();

        await page.setBypassCSP(true);
        page.on('console', msg => console.log(msg.text()));

        await page.goto('https://www.baidu.com');


        page.then(() => {
                page.evaluate(() => {
                    // 要获取的node
                    const f = debounce(e => {
                        console.log(e.clientX, e.clientY)
                    }, 1000)

                    function debounce(fn, t) {
                        let timer = null
                        return function() {
                            let ags = arguments
                            if (timer) clearTimeout(timer)
                            timer = setTimeout(() => {
                                fn.apply(this, ags)
                            }, t);
                        }
                    }

                    document.addEventListener('mousemove', f)

                    setTimeout(() => {page.mouse.move(50,50)},1000)
                    setTimeout(() => {page.mouse.move(100,100)},3000)
                    setTimeout(() => {page.mouse.move(150,150)},5000)
                })
        });


    } catch (err) {
        console.error('err:' + err);
    }
})();

function getValue(val) {
    console.log(`变化的${val}`)
}
