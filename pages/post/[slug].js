import React, {useEffect, useState} from "react"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router";
import styles from "styles/post.module.css"
import Comments from "components/post/Comments"
import OtherNews from "components/post/OtherNews"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import Image from "next/image";
import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})


const Post = (props) => {
  const router = useRouter();
  const { slug } = router.query
  const [hasData, setHasData] = useState(false)
  const [data, setData] = useState({})
  const [randomNumber, setRandomNumber] = useState()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    //Random number from 0~8 (int)
    setRandomNumber(Math.floor(Math.random() * 9))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const doc = await db.collection("posts").doc(slug).get()
      if (doc.data()) {
        setHasData(true)
        setData({
          category: doc.data().category,
          title: doc.data().title,
          text: doc.data().text,
          tag: doc.data().tag,
          author: doc.data().author,
          createdAt: getDate(doc.data().createdAt),
          thumbnail: doc.data().thumbnail,
        })
        setIsLoading(false)
        console.log(data)
      }
    }
    fetchData()
  }, [])

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
  if (isLoading) {
    return <></>
  }
  if (!hasData) {
    <div>존재하지 않거나 삭제된 게시물입니다.</div>
  }
  return (
    <div className={styles.main_container}>
      <div className={styles.header_container}>
        <div className={styles.overlay}>
          <div className={styles.icons}>
            <ArrowBackIcon className={styles.icon}/>
            <ShareIcon className={styles.icon}/>
          </div>
          <div className={styles.info_container}>
            <h2>{data.title}</h2>
            <h3>{data.tag}</h3>
            <p>{`${data.createdAt} | ${data.author}`}</p>
          </div>
        </div>
        <Image src={data.thumbnail} alt={data.title} layout="fill" objectFit="cover" objectPosition="center"  priority={true}/>
        <div className={styles.bookmark_icon_container} ><BookmarkBorderIcon className={styles.bookmark_icon} /></div>
            <p className={randomNumber === 0 ? `${styles.category} ${styles.color1}` : randomNumber === 1 ? `${styles.category} ${styles.color2}` : 
              randomNumber === 2 ? `${styles.category} ${styles.color3}` : randomNumber === 3 ? `${styles.category} ${styles.color4}` :
              randomNumber === 4 ? `${styles.category} ${styles.color5}` : randomNumber === 5 ? `${styles.category} ${styles.color6}` :
              randomNumber === 6 ? `${styles.category} ${styles.color7}` : randomNumber === 7 ? `${styles.category} ${styles.color8}` : `${styles.category} ${styles.color6}`
            }>
              {data.category}
        </p>
      </div>
      <div className={styles.content_container}>
        <QuillNoSSRWrapper value={data.text||""} readOnly={true} theme="bubble" />
      </div>
      <Comments />
      <OtherNews />
    </div>
  )
}
export default Post