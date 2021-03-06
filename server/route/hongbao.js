const express = require('express')
const router = express.Router()
const redirect = require('../service/redirect')
const eleme = require('../service/eleme')
const meituan = require('../service/meituan')

router.post('/', async (req, res, next) => {
  try {
    let {url, mobile} = req.body
    if (!url || !mobile) {
      throw new Error('请将信息填写完整')
    }
    if (!/^1\d{10}$/.test(mobile)) {
      throw new Error('请填写 11 位手机号码')
    }

    // 短链接处理
    if (/^https?:\/\/url\.cn\//i.test(url)) {
      url = await redirect(url)
    }

    console.log('开始抢红包', [url, mobile])

    if (url.indexOf('waimai.meituan.com') !== -1) {
      res.json(await meituan({url, mobile}))
    } else if (url.indexOf('h5.ele.me') !== -1) {
      res.json(await eleme({url, mobile}))
    } else {
      throw new Error('红包链接不正确')
    }
  } catch (e) {
    console.error(e.message)
    res.json({message: e.message})
  }
})

module.exports = router
