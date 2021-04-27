import fetch from 'node-fetch'
import sharp from 'sharp'

export default async function handler(req, res) {
  try {
    const url = `https://images.unsplash.com/photo-1475965894430-b05c9d13568a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&fm=jpg&fit=crop&w=1080&q=80&fit=max`
    const response = await fetch(url)
    const bgImg = await response.buffer()

    const mainText = Buffer.from(
      `<svg width="500" height="200">
          <text x="0" y="0" font-size="48" font-weight="bold" letter-spacing="-0.7">
            <tspan x="0" dy="1.2em">Lorem Ipsum</tspan>
            <tspan x="0" dy="1.2em" dx=".4em" fill="#6356fd">dolor sit</tspan> <tspan dx=".05em">amet.</tspan>
          </text>
        </svg>`
    )

    const smallText = Buffer.from(
      `<svg width="870" height="50">
          <text x="50%" dominant-baseline="middle" text-anchor="middle" y="22" font-size="22" font-weight="bold" fill="#2c2d2c" letter-spacing=".8">
            Hello World.
          </text>
        </svg>`
    )

    const mainTextBuff = await sharp(mainText)
      .extend({
        top: 200,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    const smallTextBuff = await sharp(smallText)
      .extend({
        bottom: 200,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    const bg = await sharp(bgImg)
      .composite([
        {
          input: mainTextBuff,
          gravity: 'north',
        },
        {
          input: smallTextBuff,
          gravity: 'south',
        },
      ])
      .png()
      .toBuffer()

    res.setHeader('Content-Type', `image/png`)
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
    res.statusCode = 200
    res.end(bg)
  } catch (err) {
    console.log({ err })
    res.status(404).send('Not Found')
  }
}
