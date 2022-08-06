const cheerio = require('cheerio') // 1
const axios = require("axios")

export default async (req, res) => { // 2
  if (req.method === 'POST') { // 3
    const code = req.body.code
    const biggestIdSaved = req.body.biggestIdSaved
    let newBiggestIdSaved = 0
    let list = []
    let stack = 0
    try {
      res.statusCode = 200
      // const fetchedHTML = await getHTML(`https://www.kmcn.kr/news/index.php?${code}&page${pageCount}`)
      for (let pageCount = 1; pageCount <= 5; pageCount++){
        console.log(pageCount)
        if (stack > 6)
          break;
        const fetchedHTML = await getHTML(code, pageCount)
        const $ = cheerio.load(fetchedHTML.data)
        $(".art_list > li > dl > dt").find('a').each((index, element) => {
          let id = 0
          id = parseInt($(element).attr("href").replace("/news/view.php?no=",""))
          if (id > biggestIdSaved) {
            list.push(id)
            stack = 0
            if (id > newBiggestIdSaved)
              newBiggestIdSaved = id
          } else
            stack ++
        })
      }

      return res.json({
        list: list,
        newBiggestIdSaved: newBiggestIdSaved,
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
  const getHTML = async(code,pageCount) => {
    try {
      return await axios.get(`https://www.kmcn.kr/news/index.php?${code}&page=${pageCount}`)
    } catch (e) {
      console.log(e.message)
    }
  }