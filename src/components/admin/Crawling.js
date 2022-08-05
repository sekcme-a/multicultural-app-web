import React, { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import axios from "axios"
import cheerio from "cheerio"
import style from "styles/admin/container.module.css"

const Crawling = () => {
  const [idRange, setIdRange] = useState("")
  const [errorText, setErrorText] = useState("")
  const onIdRangeChange = (e)=>{setIdRange(e.target.value)}

  const onUpdateClick = () => {

  }

  const onCrawlingClick = () => {
    // if (isValidIdRange) {
    //   const tempArray = idRange.split("~")
    //   const firstId = tempArray[0]
    //   const lastId = tempArray[1]
    //   let fetchedHTML = []
    //   for (let i = firstId; i <= lastId; i++){
    //     fetchedHTML.push(getHTML(i))
    //     console.log(fetchedHTML)
    //   }
    // }
    fetch('/api/crawling', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ docId: "2195" }),
    })
      .then((res) => res.json())
      .then((userData) => {
        console.log(userData)
      })
  }


  const isValidIdRange = () => {
    try {
      const tempArray = idRange.split("~")
      const firstId = tempArray[0]
      const lastId = tempArray[1]
      if (firstId > lastId) {
        alert("크롤링 범위 설정이 맞지 않습니다.")
        return(false)
      }
    } catch (e) {
      alert("크롤링 범위 설정이 맞지 않습니다.")
    }
  }
  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>크롤링 범위설정</h4>
        <p className={style.warning}>*2110~2130 와 같이 작성</p>
        <p className={style.warning}>*https://www.kmcn.kr/news/view.php?no=2195 의 기사는 2195 에 해당.</p>
        <p>크롤링할 Id 범위 : <input type="text" value={idRange} onChange={onIdRangeChange} size="60" required /></p>
      </div>
      <div className={style.container}>
        <h4>오류창</h4>
          <p className={style.warning}>해당 id의 크롤링 실패 시, 실패 사유가 출력됩니다.</p>
        <p>오류 문구 : <textarea type="text" value={errorText} cols="100" rows="25" required disabled/></p>
      </div>
      <div className={style.submitButton} onClick={onUpdateClick}>
        기사 자동 업데이트
      </div>
      <div className={style.submitButton} onClick={onCrawlingClick}>
        기사 크롤링 시작
      </div>
    </div>
  )
}

export default Crawling