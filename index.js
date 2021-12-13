
const puppeteer = require('puppeteer');

(async function main() {
    try {
        // 打开浏览器
        const browser = await puppeteer.launch({ headless: false,
            args: [
                '--proxy-server=socks5://127.0.0.1:1081'
            ]});
        const [page] = await browser.pages();

        // 不打开浏览器
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();

        await page.setBypassCSP(true);
        page.on('console', msg => console.log(msg.text()));

        await page.goto('https://www.tradingview.com/chart/?symbol=BITMEX%3AXBTUSD');

        // 等待头部导航加载
        let top = await page.waitFor('#header-toolbar-intervals')
        await top
        // 选择种类  menu-1fA401bY button-13wlLwhJ apply-common-tooltip
        await page.click('#header-toolbar-intervals')
        // item-2xPVYue0 data-value 1 切换为1分钟
        await page.click('#overlap-manager-root .item-2IihgTnv[data-value="1"]')

        // 挂载方法到window对象
        page.exposeFunction('getValue', getValue);

        // 等待数据tip加载
        page
            .waitForSelector('.sourcesWrapper-1WIwNaDF .valueValue-1WIwNaDF')
            .then(() => {
                page.evaluate(() => {
                    // 要获取的node
                    const target = document.querySelector('.sourcesWrapper-1WIwNaDF .valueValue-1WIwNaDF')

                    const observer = new MutationObserver(async (mutationsList) => {
                        for (const mutation of mutationsList) {
                            window.getValue(
                                mutation.target.textContent
                            );
                            const val = mutation.target.textContent
                            if(val === '0'){
                                console.log('新柱子')
                                await page.mouse.move(350,200)
                                console.log(`上一根柱子${target.innerText}`)
                                await page.mouse.move(355,200)
                            }
                        }
                    });
                    observer.observe(
                        target,
                        {
                            characterData: true, attributes: false, childList: false, subtree: true
                        },
                    );
                })
            });


    } catch (err) {
        console.error('err:' + err);
    }
})();

function getValue(val) {
    console.log(`变化的${val}`)
}
