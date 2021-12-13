const puppeteer = require('puppeteer');

(async function main() {
    try {
        // 打开浏览器
        const browser = await puppeteer.launch({ headless: false });
        const [page] = await browser.pages();

        // 不打开浏览器
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();

        await page.setBypassCSP(true);
        page.on('console', msg => console.log(msg.text()));

        await page.goto('https://example.com');

        // 挂载方法到window对象
        page.exposeFunction('getValue', getValue);

        // 等待数据tip加载
        page.waitForSelector(selector).then(() => {
            page.evaluate(() => {
                // 要获取的node
                const target = document.querySelector(selector)

                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        window.getValue(
                            mutation.target.textContent
                        );
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
    console.log(`${val}`)
}