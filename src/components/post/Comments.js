import React, {useEffect, useState} from "react"
import styles from "styles/post/comments.module.css"
import { firestore as db } from "firebase/firebase"

//props.num 불러올 댓글 수 제한. 999일때 모두 불러오기
const Comments = (props) => {
  useEffect(() => {
    
  },[])
  return (
    <div className={styles.main_container}>
      
    </div>
  )
}
export default Comments