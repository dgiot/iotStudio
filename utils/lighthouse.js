const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

function launchChromeAndRunLighthouse(url, opts, config = null) {
  // 1. 使用chrome launcher打开一个chrome窗口
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then((chrome) => {
      opts.port = chrome.port
      // 2. 在相同的端口运行lighthouse
      return lighthouse(url, opts, config).then((results) =>
        chrome.kill().then(() => results)
      )
    })
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
}

// Usage:
launchChromeAndRunLighthouse('https://prod.iotn2n.com', opts).then(
  (results) => {
    // Use results!
  }
)
