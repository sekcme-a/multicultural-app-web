import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"
import styles from "styles/comments.module.css"
import Comments from "src/components/post/Comments"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CommentsPage = () => {
  const router = useRouter()
  const { slug } = router.query

  return (
    <div className={styles.main_container}>
      <div className={styles.header_container}>
        <ArrowBackIcon fontSize="small"/>
        <h1>이 기사의 댓글</h1>
      </div>
      <div className={styles.body_container}>
        <Comments num={999} />
      </div>
    </div>
  )
}
export default CommentsPage