import React, {useCallback, useEffect, useState} from "react"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router";
import styles from "styles/post/post.module.css"
import Comments from "components/post/Comments"
import OtherNews from "components/post/OtherNews"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import Image from "next/image";
import dynamic from "next/dynamic";
import Skeleton from '@mui/material/Skeleton';
import { motion, useAnimation } from "framer-motion";
import Backdrop from '@mui/material/Backdrop';
import ShareLink from "components/public/ShareLink"
import Alert from '@mui/material/Alert';
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
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

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
      } else {
        setIsLoading(false)
        setHasData(false)
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

  const onArrowBackIconClick = () => {
    router.back()
  }
  const onShareIconClick = () => {
    setShowBackdrop(true)
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }
  const handleCopy = () => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    },3000)
  }
  const onTouchStart = (e) => {
    props.handleTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchEnd = (e) => {
    props.handleTouchEnd(e.changedTouches[0].clientX)
  }
  useEffect(() => {
    if (props.isSwipeToLeft) {
      router.back()
      props.handleSwipeToLeft(false)
    }
  }, [props.isSwipeToLeft])
  
  const onMoreCommentClick = () => {
    router.push(`/comments/${slug}`)
  }

  if (isLoading) {
    return (
      <>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
      </>
    )
  }
  if (!hasData) {
    return <div className={styles.warning}>존재하지 않거나 삭제된 게시물입니다.</div>
  }
  return (
    <div className={styles.main_container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={styles.header_container}>
        <div className={styles.overlay}>
          <motion.div initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1 } }} className={styles.icons}>
            <ArrowBackIcon className={styles.icon} onClick={onArrowBackIconClick} />
            <ShareIcon className={styles.icon} onClick={onShareIconClick}  />
            <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
              <ShareLink url={`https://multicultural-news.netlify.app/post/${slug}`} handleCopy={handleCopy} />
            </Backdrop>
          </motion.div>
          <div className={styles.info_container}>
            <motion.h2 initial={{ opacity: 0, x:-15 }} animate={{ opacity: 1, x:0, transition: { duration: 1.5, delay:0.4} }}>{data.title}</motion.h2>
            <motion.h3 initial={{ opacity: 0, x:-15}} animate={{ opacity: 1, x:0, transition: { duration: 1.5, delay:0.8 } }}>{data.tag}</motion.h3>
            <motion.p initial={{ opacity: 0, x:-15}} animate={{ opacity: 1, x:0, transition: { duration: 1.5, delay:1.2 } }}>{`${data.createdAt} | ${data.author}`}</motion.p>
          </div>
        </div>
        <Image src={data.thumbnail} alt={data.title}placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center"  priority={true}/>
        <motion.div className={showBackdrop ? styles.hide : styles.bookmark_icon_container}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0, transition: { duration: 2, delay: 2.7 } }}>
          <BookmarkBorderIcon className={styles.bookmark_icon} />
        </motion.div>
        <motion.p className={ showBackdrop ? styles.hide : (randomNumber === 0 ? `${styles.category} ${styles.color1}` : randomNumber === 1 ? `${styles.category} ${styles.color2}` :
          randomNumber === 2 ? `${styles.category} ${styles.color3}` : randomNumber === 3 ? `${styles.category} ${styles.color4}` :
            randomNumber === 4 ? `${styles.category} ${styles.color5}` : randomNumber === 5 ? `${styles.category} ${styles.color6}` :
              randomNumber === 6 ? `${styles.category} ${styles.color7}` : randomNumber === 7 ? `${styles.category} ${styles.color8}` : `${styles.category} ${styles.color6}`)
        }
          initial={{ opacity: 0 }} animate={{ opacity: 1, x: 0, transition: { duration: 1.5, delay: 1.8} }}
        >
          {data.category}
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 2, delay: 2.5 } }}
        className={styles.content_container}onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <QuillNoSSRWrapper value={data.text||""} readOnly={true} theme="bubble" />
      </motion.div>
      <div className={styles.comment_container}>
        <h3>댓 글</h3>
        <h4 onClick={onMoreCommentClick}>+ 더보기</h4>
        <Comments num={3} />
      </div>
      <OtherNews />
      <div className={isCopied ? styles.alert_container : `${styles.alert_container} ${styles.alert_hide}`}>
        <Alert severity="success" >Url이 복사되었습니다!</Alert>
      </div>
    </div>
  )
}
export default Post