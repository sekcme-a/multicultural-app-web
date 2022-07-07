import React, { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"
import style from "styles/admin/container.module.css"
import Loader from "src/components/public/Loader"

//<Setting loc="" />   loc: catgory/local/country
//카테고리, 지역별, 나라별 설정
const Setting = (props) => {
  const [isLoading, setIsLoading] = useState(true)

  const [list, setList] = useState("")
  const onListChange = (e) => { setList(e.target.value) }
  const [text, setText] = useState("")

  useEffect(() => {
    let arrayToStringData = ""
    if(props.loc==="category") setText("카테고리")
    if(props.loc==="local") setText("지역별")
    if(props.loc==="country") setText("나라별")
    const fetchData = async () => {
      try {
        await db.collection("setting").doc(props.loc).get().then((doc) => {
          doc.data().list.forEach((data) => {
            arrayToStringData += `${data},`
          })
        })
        setList(arrayToStringData.slice(0, -1))
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        if(e.message !== "Cannot read properties of undefined (reading 'list')")
          alert(`데이터를 불러오는데 실패했습니다 : ${e.message}`)
      }
    }
    fetchData()
  },[])
  
  const onSubmit = () => {
    const data = list.split(",")
    if (data[data.length - 1]==="")
      data.pop()
    try {
      db.collection("setting").doc(props.loc).set({ list: data })
      alert("업로드 성공")
    } catch (e) {
      alert(`업로드 실패 : ${e.message}`)
    }
  }
  if (isLoading)
    return <Loader />

  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>{text}</h4>
        <p className={style.warning}>{`${text},${text},${text} 형식으로 저장(빈칸없이)`}</p>
        <p className={style.warning}>{`${text} 순서 변경이나 삭제나 추가가 아닌 이름 변경 혹은 카테고리 이전 시 개발자 문의`}</p>
        <p>{`${text} 편집`} : <input type="text" value={list} onChange={onListChange} size="60" required/></p>
      </div>
      <div className={style.submitButton} onClick={onSubmit}>저장</div>
    </div>
  )
}

export default Setting;