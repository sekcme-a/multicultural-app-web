import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import styles from "styles/main/postList.module.css"
import { firestore as db } from "firebase/firebase"
import ThumbnailPost from "src/components/main/ThumbnailPost"
import CircularProgress from '@mui/material/CircularProgress';
import { useRouterScroll } from '@moxy/next-router-scroll';
import useNavi from "src/hook/customNavigation"
import HoverPost from "src/components/post/HoverPost"



/*
<PostList isBottom={props.isBottom} category="검색할 컬렉션명" mode="local이나 country" />
isBottom 필수

*/

const PostList = (props) => {
  const [list, setList] = useState([])
  const [lastDoc, setLastDoc] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const fetchCountInOneLoad = 6
  const lazyRoot = React.useRef(null)
  const { updateScroll = () => { } } = useRouterScroll() || {}
  const {setTouchStartXY, setTouchEndXY, isOnPost, history} = useNavi()

  useEffect(() => {
    updateScroll()
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      let tempIdList = []
      let count = 0;
    //시간순으로 정렬해 최근 10개의 기사 사용.
    setTimeout(async () => {
      const posts = await db.collection(props.category)?.orderBy("createdAt", 'desc').limit(fetchCountInOneLoad).get()
      posts.docs.map((doc) => {
        tempIdList = ([
          ...tempIdList,
          {
            author: doc.data().author,
            category: doc.data().category,
            createdAt: getDate(doc.data().createdAt),
            tag: doc.data().tag,
            thumbnail: doc.data().thumbnail,
            title: doc.data().title,
            subtitle: doc.data().subtitle,
            docId: doc.id
          }
        ])
        count++
        if (count === fetchCountInOneLoad)
          setLastDoc(doc)
        })
        setList(tempIdList)
        setIsLoading(false)
      },0)
    }
      fetchData()
  }, [props.category])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      let tempIdList = []
      let count = 0;
      if (props.isBottom && list && lastDoc) {
        const posts = await db.collection(props.category)?.orderBy("createdAt", 'desc').startAfter(lastDoc).limit(fetchCountInOneLoad).get()
        posts.docs.map((doc) => {
        tempIdList = ([
          ...tempIdList,
          {
            author: doc.data().author,
            category: doc.data().category,
            createdAt: getDate(doc.data().createdAt),
            tag: doc.data().tag,
            thumbnail: doc.data().thumbnail,
            subtitle: doc.data().subtitle,
            title: doc.data().title,
            docId: doc.id
          }
          ])
          count++
          if (count === fetchCountInOneLoad) {
            setLastDoc(doc)
          }
        })
        if(list[list.length-1].docId !== tempIdList[tempIdList.length-1]?.docId)
          setList([...list, ...tempIdList])
      }
      setIsLoading(false)
    }
     fetchData()
  }, [props.isBottom])

  
  const getDate = (d) => {
    const date = new Date(d.toMillis())
    if(date.getMonth()+1<10 && date.getDate()<10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1<10 && date.getDate()>=10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && d.getDate()<10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && date.getDate()>=10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  }
  const onTouchStart = (e) => {
    setTouchStartXY(e.targetTouches[0].clientX, e.targetTouches[0].clientY)
  }
  const onTouchEnd = (e) => {
    setTouchEndXY(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  }
  return (
    <div className={props.mode==="local"||props.mode==="country" ? `${styles.main_container} ${styles.add_margin}`:styles.main_container} ref={lazyRoot} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {props.category === "posts" && <h1 className={styles.title}>실시간 뉴스</h1>}
      {list?.map((doc, index) => {
        return (
          <ThumbnailPost data={doc} key={index} lazyRoot={lazyRoot} />
        )
      })}
      {isOnPost && <HoverPost id={history[history.length-1]} />}
      {isLoading && <CircularProgress size={20} />}
    </div>
  )
}
export default PostList