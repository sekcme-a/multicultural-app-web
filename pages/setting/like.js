import React, { useEffect, useState } from "react"
import styles from "styles/setting/bookmark.module.css"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useAuth from 'src/hook/auth'
import { firestore as db } from "firebase/firebase"
import MiniPostList from "src/components/main/MiniPostList"
import useBookmarkLike from "src/hook/bookmarkLike";
import { useRouter } from "next/router"
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
const Bookmark = () => {
  const { user, userrole, logout, setUserrole } = useAuth();
  const { likeList, getLikeList, triggerReload } = useBookmarkLike()
  const [importance, setImportance] = useState(5)
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getLikeList(user.uid)
    if (likeList.length === 0) {
      setEmpty(true)
      setList([])
    }
  },[])
  useEffect(() => {
    let temp = []
    const fetchData = async () => {
      getLikeList(user.uid)
      if (likeList.length === 0)
        setList([])
      for (let i = likeList.length-1; i >= 0; i--) {
        if (likeList[i] !== undefined) {
          const doc = await db.collection("posts").doc(likeList[i]).get()
            temp.push({
              id: doc.id,
              title: doc.data().title,
              thumbnail: doc.data().thumbnail,
              tag: doc.data().tag,
              category: doc.data().category,
              author: doc.data().author,
            })
            setList(temp)
            // if(i === bookmarkList.length-1)
            //   setIsLoading(false)
        }
      }
      setIsLoading(false)
    }
    fetchData()
  }, [triggerReload])

  const onTitleClick = () => { router.back() }

  if (isLoading)
    return (<></>)
  if (empty) {
    return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>좋아요한 기사</p>
      </div>
      <div className={styles.bookmark_none_container}>
        <ThumbUpOutlinedIcon style={{ fontSize: "60px", color: "gray" }} />
        <p>아직 좋아요한 기사가 없습니다.</p>
        <p>마음에 드는 기사에 좋아요를 눌러보세요.</p>
      </div>
    </div>
    )
  }
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>좋아요한 기사</p>
      </div>
      <MiniPostList data={list} noTransparent={true} />
    </div>
  )
}

export default Bookmark