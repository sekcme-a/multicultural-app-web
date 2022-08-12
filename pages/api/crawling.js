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
      let createdAt = []
      $createdAt.map((date) => {
        createdAt.push(parseInt(date))
      })

      let $thumbnailImg = ""
      // $(".view_con > .view_con_wrap > img").text()
      // console.log($thumbnailImg)
      $(".view_con").find(".view_con_wrap").each((index, element) => {
        $thumbnailImg = $(element).find("img").attr("src")
      })
      if($thumbnailImg===undefined)
        $thumbnailImg="/public/default_thumbnail.png"
      // const asdf = $(".view_con_wrap").find("img").first().attr('href')
      // console.log(asdf)

      
      const $imageFrom = $(".cheditor-caption > .cheditor-caption-text").text()
      let imageFrom = $imageFrom
      while(imageFrom.includes(" "))
        imageFrom = imageFrom.replace(" ", "")
      while(imageFrom.includes("\u00A0"))  //&nbsp; 제거하기 위해 유니코드 사용.
        imageFrom = imageFrom.replace("\u00A0", "")
      
      const $author = $(".art_etc").children().first().text()
      const $tag = $(".tag_list > ul > .view01_tag > li").text()
      let tag = ""
      const tempArrayTag = $tag.split("#")
      tempArrayTag.forEach((item) => {
        if(item!=="")
          tag = `${tag} #${item}`
      })
      
      // const $content = $(".view_con_wrap > p").text()
      // let content = $content
      // console.log(content)
      // while (content.includes("\n"))
      //   content = content.replace("\n", `<p class="ql-align-justify"/>&nbsp;</p>`)
      // while (content.includes("\u00A0"))
      //   // content = content.replace("\u00A0", `&lt;p class="ql-align-justify"&gt;&nbsp;&lt;/p&gt;`)
      //   content = content.replace("\u00A0", `<p class="ql-align-justify"/>&nbsp;</p>`)
      let content = ""
      $(".view_con_wrap").find("p").each((index, element) => {
        content = `${content}${$(element).text()}<p class="ql-align-justify"/>&nbsp;</p>`
      })
      console.log(content)

      return res.json({
        condition: "success",
        title: $title,
        subtitle: $subtitle,
        createdAt: createdAt,
        thumbnailImg: $thumbnailImg,
        imageFrom: imageFrom,
        author: $author,
        tag: tag,
        content: content,
        id: docId,
      })
    } catch (e) { // 5
      res.statusCode = 404
      console.log(e)
      return res.json({
        condition: "error",
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