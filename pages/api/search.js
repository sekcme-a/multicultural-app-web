const cheerio = require('cheerio') // 1
const axios = require("axios")

export default async (req, res) => { // 2
  if (req.method === 'POST') { // 3
    res.statusCode = 200
    const input = req.body.input
    let list = []
    try { // 4
      for (let pageCount = 1; pageCount <= 3; pageCount++) {
        const fetchedHTML = await getHTML(input, pageCount)
        if (fetchedHTML) {
          const $ = cheerio.load(fetchedHTML.data)
          $(".art_list > li > dl > dt").find('a').each((index, element) => {
            let id = 0
            id = parseInt($(element).attr("href").replace("/news/view.php?no=", ""))
            if (id) {
              list.push(id)
            }
          })
        }
      }
      return res.json({
        condition: "success",
        list: list
      })
    } catch (e) { // 5
      res.statusCode = 404
      return res.json({
        condition: "error",
        error: e.message
      })
    }
  }
}
const getHTML = async (input,pageCount) => {
  try {
      return await axios.get(`https://www.kmcn.kr/news/search.php?q=${encodeURI(input)}&page0=${pageCount}`)
    } catch (e) {
      console.log(e.message)
    }
  }