import React, { useEffect, useState } from "react"
import style from "styles/admin/container.module.css"
import useAuth from "src/hook/auth"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
import Button from '@mui/material/Button';

const NewAnnouncement = () => {
  const [text, setText] = useState("")
  const onTextChange = (e) => { setText(e.target.value) }
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        const doc = await db.collection("setting").doc("help").get()
        if (doc.exists) {
          setText(doc.data().text)
        }
      } catch (e) {
        alert(`데이터 불러오기 실패 : ${e.message}`)
      }
    }
    fetchData()
  },[])


  const onSubmitClick = () => {
    try {
      db.collection("setting").doc("help").set({ text: text })
      alert("변경 성공")
    } catch (e) {
      alert(`변경 실패 : ${e.message}`)
    }
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>내용</h4>
          <p className={style.warning}>{`*제목은 [[[제목]]] 로 표기, 강조체는 <<<강조할문구>>> 로 표기`}</p>
        <p>내용 문구 : <textarea type="text" value={text} onChange={onTextChange} cols="100" rows="25" required/></p>
      </div>
      <Button variant="contained" onClick={onSubmitClick}>변 경</Button>
    </div>
  )
}

export default NewAnnouncement