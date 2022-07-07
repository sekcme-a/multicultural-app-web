import React, {useEffect, useState, useRef} from "react"
import styles from "styles/main/postList.module.css"
import { firestore as db } from "firebase/firebase"
import ThumbnailPost from "src/components/main/ThumbnailPost"

const PostList = (props) => {
  const [list, setList] = useState([])
  const [lastDoc, setLastDoc] = useState()
  const fetchCountInOneLoad = 6
  const lazyRoot = React.useRef(null)
  useEffect(() => {
    const fetchData = async () => {
      let tempIdList = []
      let count = 0;
    //시간순으로 정렬해 최근 10개의 기사 사용.
    setTimeout(async () => {
      const posts = await db.collection(props.category).orderBy("createdAt", 'desc').limit(fetchCountInOneLoad).get()
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
            docId: doc.id
          }
        ])
        count++
        if (count === fetchCountInOneLoad)
          setLastDoc(doc)
      })
      setList(tempIdList)
    },0)
  }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      let tempIdList = []
      let count = 0;
      if (props.isBottom && list) {
        const posts = await db.collection(props.category).orderBy("createdAt", 'desc').startAfter(lastDoc).limit(fetchCountInOneLoad).get()
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
            docId: doc.id
          }
          ])
          count++
          if (count === fetchCountInOneLoad) {
            setLastDoc(doc)
          }
        })
        if(list[list.length-1].docId !== tempIdList[tempIdList.length-1].docId)
          setList([...list, ...tempIdList])
      }
    }
     fetchData()
  }, [props.isBottom])
  
  const getDate = (d) => {
    const date = new Date(d.toMillis())
    if(date.getMonth()+1<10 && date.getDate()<10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate()
    else if(date.getMonth()+1<10 && date.getDate()>=10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate()
    else if(date.getMonth()+1>=10 && d.getDate()<10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate()
    else if(date.getMonth()+1>=10 && date.getDate()>=10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
  }
  return (
    <div className={styles.main_container} ref={lazyRoot}>
      {props.category === "posts" && <h1 className={styles.title}>실시간 뉴스</h1>}
      {list?.map((doc, index) => {
        return (
          <ThumbnailPost data={doc} key={index} lazyRoot={lazyRoot} />
        )
      })}
    </div>
  )
}
export default PostList