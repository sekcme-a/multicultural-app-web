const cheerio = require('cheerio') // 1
const axios = require("axios")

export default async (req, res) => { // 2
  if (req.method === 'POST') { // 3
    const docId = req.body.docId
    try { // 4
      // const response = await fetch(`https://mobile.twitter.com/${username}`)
      // const htmlString = await response.text()
      // const $ = cheerio.load(htmlString)
      // const searchContext = `a[href='/${username}/followers']`
      // const followerCountString = $(searchContext)
      //   .text()
      //   .match(/[0-9]/gi)
      //   .join('')
      res.statusCode = 200
      const fetchedHTML = await getHTML(docId)
      const $ = cheerio.load(fetchedHTML.data)
      const $title = $(".subject > a").text()
      const $subtitle = $(".h-group.cf > .sub-title").text()
      const $createdAt = $(".view_top_right > .date").text().replace("기사입력 : ", "").replace(":", ".").replace(" ", ".").split(".")
      const $thumbnailImg = $(".cheditor-caption-wrapper > p > img").attr("src")
      let createdAt = []
      $createdAt.map((date) => {
        createdAt.push(parseInt(date))
      })
      return res.json({
        title: $title,
        subtitle: $subtitle,
        createdAt: createdAt,
        thumbnailImg: $thumbnailImg,
      })
    } catch (e) { // 5
      res.statusCode = 404
      return res.json({
        fetchedHTML: "error",
        error: e.message
      })
    }
  }
}
  const getHTML = async(id) => {
    try {
      return await axios.get(`https://www.kmcn.kr/news/view.php?no=${id}`)
    } catch (e) {
      console.log(e.message)
    }
  }