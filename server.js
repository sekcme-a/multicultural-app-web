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
      const fetchedHTML = getHTML(docId)
      return res.json({
        fetchedHTML: fetchedHTML,
      })
    } catch (e) { // 5
      res.statusCode = 404
      return res.json({
        fetchedHTML: "error",
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