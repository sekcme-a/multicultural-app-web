import React, {useCallback, useEffect, useState, useRef} from "react"
import { firestore as db } from "firebase/firebase"
import Router, { useRouter } from "next/router";
import styles from "styles/post/hoverPost.module.css"
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
import { useWindowDimensions } from "src/hook/useWindowDimensions";
import useNavi from "src/hook/customNavigation";
import Alert from "src/components/public/Alert"
import SpeedDial from "src/components/public/SpeedDial"
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import useAuth from "src/hook/auth";
import useBookmarkLike from 'src/hook/bookmarkLike';
// import { triggerBase64Download } from 'common-base64-downloader-react';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})

const HoverPost = (props) => {
  const printRef = useRef()
  const [hasData, setHasData] = useState(false)
  const [data, setData] = useState({})
  const [randomNumber, setRandomNumber] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const handleIsShow = (bool) => { setIsShow(bool) }
  const [alarmText, setAlarmText] = useState("")
  const handleAlarmText = (text) => { setAlarmText(text) }
  const [alarmMode, setAlarmMode] = useState("success")
  const handleAlarmMode = (mode) => {setAlarmMode(mode)}
  const router = useRouter();
  const { history, popHistory, isOnPost, pushHistory, showId, setShowId, isSwipeToLeft, setIsSwipeToLeft } = useNavi()
  const { user } = useAuth()
  const { bookmarkList, isBookmarked, deleteBookmark ,pushBookmark } = useBookmarkLike()
  const { height, width } = useWindowDimensions()
  const [isTimeOut, setIsTimeOut] = useState(false)
  useEffect(() => {
    //Random number from 0~8 (int)
    setRandomNumber(Math.floor(Math.random() * 9))
  }, [])

  //조회수 추가
  useEffect(() => {
    try {
      db.collection("lvc").doc(showId).get().then((doc) => {
        if(doc.exists)
          db.collection('lvc').doc(showId).update({viewsCount: doc.data().viewsCount+1})
      })
    } catch (e) {
      
    }
  },[showId])

  useEffect(() => {
    const handler = (url) => {
      if (isOnPost) {
        onBack()
        window.history.pushState(null, '', url)
        throw "Route Canceled";
      }
    };

    Router.events.on("routeChangeStart", handler);

    return () => {
      Router.events.off("routeChangeStart", handler);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const doc = await db.collection("posts").doc(showId).get()
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
    if(showId!=="")
      fetchData()
  }, [showId])

  useEffect(() => {
    setShowId(props.id)
  },[])

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

  useEffect(() => {
    if (isSwipeToLeft) {
      onBack()
      setIsSwipeToLeft(false)
    }
  },[isSwipeToLeft])

  const onBack = () => {
    popHistory()
    if (isOnPost) {
      setShowId(history[history.length - 1])
    }
    else router.back()
  }
  const onShareIconClick = () => {
    setShowBackdrop(true)
  }
  const handleShowBackdrop = (bool) => {
    setShowBackdrop(bool)
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }
  const handleCopy = () => {
    setIsShow(true)
    setAlarmText("Url이 복사되었습니다!")
    setAlarmMode("success")
    setTimeout(() => {
      setIsShow(false)
    },2000)
  }
  

  const downloadPdf = async() => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
  			var doc = new jsPDF('p', 'mm', 'a4'); 
			var imgData = canvas.toDataURL('image/png');
			var imgWidth = 210;
			var pageHeight = 295;
			var imgHeight = canvas.height * imgWidth / canvas.width;
			var heightLeft = imgHeight;
			var position = 0;
			doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); 
			heightLeft -= pageHeight;
			while (heightLeft >= 0) {
				position = heightLeft - imgHeight;
				doc.addPage();
				doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			  }
			doc.save(`${data.title}.pdf`); 
  }
  const onBookmarkClick = () => {
    if (user === null) {
      setAlarmText("로그인 후 사용해주세요.")
      setAlarmMode("warning")
      setIsShow(true)
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
    else if (!isTimeOut) {
      if (isBookmarked(showId)) {
        deleteBookmark(user.uid, showId)
        handleAlarmText("북마크가 삭제되었습니다.")
        setAlarmMode("success")
        handleIsShow(true)
        setTimeout(() => {
          handleIsShow(false)
        }, 2000)
      }
      else {
        pushBookmark(user.uid, showId)
        handleAlarmText("북마크가 추가되었습니다.")
        setAlarmMode("success")
        handleIsShow(true)
        setTimeout(() => {
          handleIsShow(false)
        }, 2000)
      }
      setIsTimeOut(true)
      setTimeout(()=>{setIsTimeOut(false)},2000)
    }

  }

  if (isLoading) {
    return (
      <div className={styles.main_container}>
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
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
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
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
      </div>
    )
  }
  if (!hasData) {
    return <div className={styles.warning}>존재하지 않거나 삭제된 게시물입니다.</div>
  }
  return (
    <>
    <div className={styles.main_container} style={{ minHeight: height }} ref={printRef}>
      <div>
        <div className={styles.header_container}>
          <div className={styles.overlay}>
            <motion.div initial={{ opacity: 0}} animate={{ opacity: 1, transition: { duration: .5 } }} className={styles.icons}>
              <ArrowBackIcon className={styles.icon} onClick={onBack} />
              <ShareIcon className={styles.icon} onClick={onShareIconClick}  />
              <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
                <ShareLink url={`https://multicultural-news.netlify.app/post/${history[history.length-1]}`} handleCopy={handleCopy} />
              </Backdrop>
            </motion.div>
            <div className={styles.info_container}>
              <motion.h2 initial={{ opacity: 0, x:-15 }} animate={{ opacity: 1, x:0, transition: { duration: 1.0, delay:0.1} }}>{data.title}</motion.h2>
              <motion.h3 initial={{ opacity: 0, x:-15}} animate={{ opacity: 1, x:0, transition: { duration: 1.0, delay:0.3 } }}>{data.tag}</motion.h3>
              <motion.p initial={{ opacity: 0, x:-15}} animate={{ opacity: 1, x:0, transition: { duration: 1.0, delay:0.5 } }}>{`${data.createdAt} | ${data.author}`}</motion.p>
            </div>
          </div>
          <Image src={data.thumbnail} alt={data.title}placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center"  priority={true}/>
          <motion.div className={showBackdrop ? styles.hide : styles.bookmark_icon_container}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0, transition: { duration: 1.0, delay: 0.8 } }}
              onClick={onBookmarkClick}
            >
              {isBookmarked(showId) ? <BookmarkBorderIcon className={styles.bookmark_icon} style={{color: "rgb(255, 134, 154)"}} /> : <BookmarkBorderIcon className={styles.bookmark_icon} />}
          </motion.div>
          <motion.p className={ showBackdrop ? styles.hide : (randomNumber === 0 ? `${styles.category} ${styles.color1}` : randomNumber === 1 ? `${styles.category} ${styles.color2}` :
            randomNumber === 2 ? `${styles.category} ${styles.color3}` : randomNumber === 3 ? `${styles.category} ${styles.color4}` :
              randomNumber === 4 ? `${styles.category} ${styles.color5}` : randomNumber === 5 ? `${styles.category} ${styles.color6}` :
                randomNumber === 6 ? `${styles.category} ${styles.color7}` : randomNumber === 7 ? `${styles.category} ${styles.color8}` : `${styles.category} ${styles.color6}`)
          }
            initial={{ opacity: 0 }} animate={{ opacity: 1, x: 0, transition: { duration: 1.0, delay: 1.2} }}
          >
            {data.category}
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.0, delay: 1.2 } }}
          className={styles.content_container}>
          <QuillNoSSRWrapper value={data.text||""} readOnly={true} theme="bubble" />
        </motion.div>
        <div className={styles.transparent_container} />
      </div>
      <Comments id={showId} />
      <OtherNews />
    </div>
      <SpeedDial id={showId} handleShowBackdrop={handleShowBackdrop} downloadPdf={downloadPdf} handleAlarmMode={handleAlarmMode} handleIsShow={handleIsShow} handleAlarmText={handleAlarmText} />
      <Alert mode={alarmMode} isShow={isShow} text={alarmText} />
    </>
  )
}
export default HoverPost