import React, { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import axios from "axios"
import cheerio from "cheerio"
import style from "styles/admin/container.module.css"
import useAuth from "src/hook/auth"
import { cityList } from "data/cityList"

const Crawling = () => {
  const [idRange, setIdRange] = useState("")
  const [progress, setProgress] = useState("")
  const [categoryIdList, setCategoryIdList] = useState("")
  const [countryIdList, setCountryIdList] = useState("")
  const [searchData, setSearchData] = useState("")
  const [keyword, setKeyword] = useState("")
  const [editId, setEditId] = useState("")
  const onKeywordChange = (e) => {setKeyword(e.target.value)}
  const onSearchDataChange = (e) => {setSearchData(e.target.value)}
  const onIdRangeChange = (e) => { setIdRange(e.target.value) }
  const onEditIdChange = (e) => {setEditId(e.target.value)}
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchData = async () => {
      setCategoryIdList("")
      let tempCategoryIdList = ""
      const doc = await db.collection("category").doc("list").get()
      if (doc.exists) {
        setSearchData(doc.data().searchData)
        setKeyword(doc.data().keyword)
        for (let i = 0; i < doc.data().list.length; i++){
          tempCategoryIdList = `${tempCategoryIdList}${doc.data().list[i]} : ${doc.data().idList[i]}\n`
        }
        setCategoryIdList(tempCategoryIdList)
      }
      setCountryIdList("")
      let tempCountryIdList = ""
      const doc2 = await db.collection("country").doc("list").get()
      if (doc2.exists) {
        for (let i = 0; i < doc2.data().list.length; i++){
          tempCountryIdList = `${tempCountryIdList}${doc2.data().list[i]} : ${doc2.data().idList[i]}\n`
        }
        setCountryIdList(tempCountryIdList)
      }
    }
    fetchData()
  }, [])

  const onSaveclick = () => {
    try {
      db.collection("category").doc("list").update({searchData: searchData})
      alert("저장완료.")
    } catch (e) {
      alert(e.message)
    }
  }

  const onKeywordSaveClick = () => {
    try {
      db.collection("category").doc("list").update({keyword: keyword})
      alert("저장완료.")
    } catch (e) {
      alert(e.message)
    }
  }
  
  const onUpdateClick = () => {

  }

  const onCrawlingClick = async () => {
    setProgress("")
    let progress =""
    // const tempArray = [2195, 2194, 2193]
    let nameList = []
    let idList = []
    let codeList = []
    let newBiggestIdSaved = 0;
    const tmp = searchData.split("\n")
    progress = `${progress}Fetching search data\n`;  setProgress(progress)
    for (let i = 0; i < tmp.length; i++){
      if (i % 3 === 0)
        nameList.push(tmp[i])
      if (i % 3 === 1)
        idList.push(tmp[i])
      if (i%3===2)
        codeList.push(tmp[i])
    }
    progress = `${progress}Success!\n`;  setProgress(progress)
    progress = `${progress}Fetching max Id saved\n`;  setProgress(progress)
    const doc = await db.collection("category").doc("list").get()
    let biggestIdSaved = 0
    if(doc.data().biggestIdSaved)
      biggestIdSaved = doc.data().biggestIdSaved
    if (editId !== "" && editId !== " ") {
      biggestIdSaved = editId-1
    }
    // if(isValidIdRange())
    // for (let i = 0;codeList.push(tmp[i]))
    progress = `${progress}Max Id Saved: ${biggestIdSaved}\n`;  setProgress(progress)
    for (let j = 0; j < nameList.length; j++){
      progress = `${progress}Fetching Id List from ${nameList[j]}\n`;  setProgress(progress)
      progress = `${progress}Code: ${codeList[j]}\n`;  setProgress(progress)
      const missionIdList = await getMissionId(codeList[j], biggestIdSaved)
      // const missionIdList= {"newBiggestIdSaved": 2225, "list" : ["1883"]}
      progress = `${progress}Fetched Ids: `;  setProgress(progress)
      missionIdList.list.map((doc) => {
        progress = `${progress}${doc}, `;  setProgress(progress)
      })
      progress = `${progress}\n, `; setProgress(progress)
      if (newBiggestIdSaved < missionIdList.newBiggestIdSaved) {
        newBiggestIdSaved = missionIdList.newBiggestIdSaved
        progress = `${progress}New Max Id: ${newBiggestIdSaved}\n`;  setProgress(progress)
      }
      if (missionIdList.list.length === 0) {
        progress = `${progress}No new articles from: ${nameList[j]}(${codeList[j]})\n`; setProgress(progress)
      }
      else {
        for (let i = 0; i < missionIdList.list.length; i++) {
          progress = `${progress}Fetching Id: ${missionIdList.list[i]} from ${nameList[j]}\n`;  setProgress(progress)
          const data = await getData(missionIdList.list[i])
          if (data.condition === "error") {
            progress = `${progress}Error fetching ${missionIdList.list[i]} from ${nameList[j]}\n`; setProgress(progress)
            progress = `${progress}Error message: ${data.error}\n`; setProgress(progress)
          } else {
            progress = `${progress}Success fetching id:${missionIdList.list[i]}\n`; setProgress(progress)
            progress = `${progress}${missionIdList.list[i]} - title: ${data.title}, image: ${data.thumbnailImg}\n`; setProgress(progress)
            progress = `${progress}Pushing Id: ${missionIdList.list[i]} to db.posts\n`; setProgress(progress)
            try {
              let text = data.subtitle
              if (data.subtitle === undefined || data.subtitle === "") {
                // console.log(temp)
                let temp = data.content
                temp = temp.replace(/<[^>]*>?/g, '')
                temp = temp.replace("&lt;", "<")
                temp = temp.replace("&gt;", ">")
                temp = temp.replace("&nbsp;", "")
                // console.log(temp)
                let tmp = temp.substr(0, 60)
                while (tmp.includes("\n"))
                  tmp = tmp.replace("\n", " ")
                text = tmp
                console.log(text)
              }
              console.log(data.content)
              const hashMap = {
                category: nameList[j],
                importance: 3,
                title: data.title,
                subtitle: text,
                createdAt: new Date(data.createdAt[0],data.createdAt[1]-1,data.createdAt[2],data.createdAt[3],data.createdAt[4]),
                thumbnail: data.thumbnailImg,
                imageFrom: data.imageFrom,
                author: data.author,
                text: data.content,
                tag: data.tag,
                uid: user.uid,
              }
              const thumbnailHashMap = {
                title: data.title,
                subtitle: text,
                thumbnail: data.thumbnailImg,
                createdAt: new Date(data.createdAt[0],data.createdAt[1]-1,data.createdAt[2],data.createdAt[3],data.createdAt[4]),
                imageFrom: data.imageFrom,
                author: data.author,
                uid: user.uid,
                category: nameList[j],
                tag: data.tag,
              }
              const batch = db.batch()
              const categoryDoc = await db.collection("category").doc(idList[j]).get()
              const countryDoc = await db.collection("country").doc(idList[j]).get()
              //키워드를 통해 지역별 자동 작성
              cityList.forEach(async (city) => {
                const localDoc = await db.collection("local").get()
                localDoc.docs.map((doc) => {
                  if (city.city === doc.data().name) {
                    city.item.map((item) => {
                      if (data.title.includes(item)) {
                        batch.set(db.collection(doc.id).doc(data.id.toString()), thumbnailHashMap)
                        progress = `${progress}Found ${doc.data().name} in "local"\n`; setProgress(progress)
                      }
                    })
                  }
                })
              })
              


              if (categoryDoc.exists) {
                progress = `${progress}Found ${idList[j]} in "category"\n`; setProgress(progress)
                batch.set(db.collection("posts").doc(data.id.toString()), hashMap)
                batch.set(db.collection(idList[j].toString()).doc(data.id.toString()), thumbnailHashMap)
                batch.set(db.collection("4qrOMyHdFxkG2AQnRhtQ").doc(data.id.toString()), thumbnailHashMap)
                batch.set(db.collection("lvc").doc(data.id.toString()), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
                batch.set(db.collection("posts").doc(data.id.toString()).collection('lvc').doc("count"), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
                await batch.commit();
              } else if (countryDoc.exists) {
                progress = `${progress}Found ${idList[j]} in "country"\n`; setProgress(progress)
                batch.set(db.collection("posts").doc(data.id.toString()), hashMap)
                batch.set(db.collection(idList[j].toString()).doc(data.id.toString()), thumbnailHashMap)
                batch.set(db.collection("lvc").doc(data.id.toString()), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
                batch.set(db.collection("posts").doc(data.id.toString()).collection('lvc').doc("count"), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
                await batch.commit();
              } else {
                progress = `${progress}Error Message: No match for ${idList[j]}, please check id of ${nameList[j]}\n`; setProgress(progress)
              }
            } catch (e) {
              progress = `${progress}Error pushing Id: ${missionIdList.list[i]}\n`; setProgress(progress)
              progress = `${progress}Error Message:  ${e.message}\n`; setProgress(progress)
            }
            progress = `${progress}Successfuly saved all datas from : ${nameList[j]}\n`; setProgress(progress)
          }
        }
      }
    }
    db.collection("category").doc("list").update({biggestIdSaved: newBiggestIdSaved})
    alert("크롤링 성공")
    // for (let i = 0; i < tempArray.length; i++){
    //   const d = await getData(tempArray[i])
    //   progressText = `${progressText}${d.id} : ${d.title}\n`
    //   setProgress(progressText)
    // }
    // tempArray.forEach((id) => {
    //   getData(id)
    // })
  }

  const getData = (id) => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        try {
          fetch('/api/crawling', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ docId: id }),
          })
            .then((res) => res.json())
            .then((userData) => {
              resolve(userData)
            })
        } catch (e) {
          resolve(e.message)
        }
      },300)
    })
  }

  const getMissionId = (code, biggestIdSaved) => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        try {
          fetch('/api/getMissionId', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ code: code, biggestIdSaved: biggestIdSaved }),
          })
            .then((res) => res.json())
            .then((userData) => {
              resolve(userData)
            })
        } catch (e) {
          resolve(e.message)
        }
      },300)
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
      } else if (lastId - firstId > 300) {
        alert("300개이상의 기사를 선택할 수 없습니다.")
      }
    } catch (e) {
      alert("크롤링 범위 설정이 맞지 않습니다.")
    }
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>카테고리 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={categoryIdList} cols="100" rows="10" /></p>
      </div>
      <div className={style.container}>
        <h4>국가별 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={countryIdList} cols="100" rows="10" /></p>
      </div>
      <div className={style.container}>
        <h4>검색할 데이터</h4>
        <p className={style.warning}>{`만약 English 국가별의 주소가 https://www.kmcn.kr/news/index.php?code=20140925141337_5787&d_code=20140925145906_6669&page=46#list_anchor 라면,`}</p>
        <p className={style.warning}>{`English 국가별의 코드는 code=20140925141337_5787&d_code=20140925145906_6669`}</p>
        <p className={style.warning}>{`국가별 id명은 위 리스트에서 확인 `}</p>
        <p className={style.warning}>{`카테고리명  줄바꿈  id명  줄바꿈  코드명  줄바꿈`}</p>
        <p className={style.warning}>{`형식으로 작성`}</p>
        <p>데이터 : <textarea type="text" value={searchData} cols="100" rows="25" onChange={onSearchDataChange} required/></p>
      </div>
      <div className={style.submitButton} onClick={onSaveclick}>
        데이터 저장
      </div>
      <div className={style.submitButton} onClick={onCrawlingClick}>
        기사 자동 업데이트
      </div>
      {/* <div className={style.container}>
        <h4>지역별 키워드</h4>
        <p className={style.warning}>{`키워드 줄바꿈 지역명 줄바꿈 id명`}</p>
        <p className={style.warning}>{`형식으로 작성`}</p>
        <p>키워드 : <textarea type="text" value={keyword} cols="100" rows="25" onChange={onKeywordChange} required/></p>
      </div>
      <div className={style.submitButton} onClick={onKeywordSaveClick}>
        키워드 저장
      </div> */}
      <div className={style.container}>
        <h4>수정 기사 불러오기</h4>
        <p>수정할 기사 id : <input type="text" value={editId} onChange={onEditIdChange} size="60" required/></p>
      </div>
      <div className={style.submitButton} onClick={onCrawlingClick}>
        기사 수정 크롤링 시작
      </div>
      <div className={style.container}>
        <h4>상태창</h4>
          <p className={style.warning}>크롤링 진행 상태입니다.</p>
        <p>상태 문구 : <textarea type="text" value={progress} cols="100" rows="25" required/></p>
      </div>
      <h3 style={{marginBottom: "300px"}}> </h3>
    </div>
  )
}

export default Crawling