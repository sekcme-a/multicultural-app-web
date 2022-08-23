import React, { useState, useEffect } from "react"
import styles from "styles/main/thumbnailPost.module.css"
// import Image from "next/image";
import Image from "hook/Image"
import Link from "next/link"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer"
import HoverPost from "src/components/post/HoverPost";
import useNavi from "src/hook/customNavigation";
import useBookmarkLike from 'src/hook/bookmarkLike';
import useAuth from 'src/hook/auth';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Alert from "src/components/public/Alert"
import Backdrop from '@mui/material/Backdrop';
import ShareLink from "components/public/ShareLink"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
const ThumbnailPost = (props) => {
  const [randomNumber, setRandomNumber] = useState()
  const [id, setId] = useState("")
  // const [isOpenThisPost, setIsOpenThisPost] = useState()
  const { history, pushHistory, isOnPost} = useNavi()
  const { bookmarkList, isBookmarked, deleteBookmark, pushBookmark, isLiked, deleteLike, pushLike } = useBookmarkLike()
  const [isTimeOut, setIsTimeOut] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [alarmText, setAlarmText] = useState("")
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [alarmMode, setAlarmMode] = useState("success")
  const [subtitle, setSubtitle] = useState("")
  const router = useRouter()
  
  const { user } = useAuth()
  // useEffect(() => {
  //   //Random number from 0~8 (int)
  //   setRandomNumber(Math.floor(Math.random() * 9))
  // }, [])
  useEffect(() => {
    if(props.id) setId(props.id)
    else setId(props.data.docId)
    if(props.data.subtitle.includes("&nbsp;"))
      console.log("asdf")
    let temp = props.data.subtitle
    while (temp.includes("&nbsp;"))
      temp = temp.replace("&nbsp;", "")
    setSubtitle(temp)
  }, [props.id, props.data.docId])

  const onThumbnailClick = () => {
    // setIsOpenThisPost(true)
    pushHistory(id)
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
      if (isBookmarked(id)) {
        deleteBookmark(user.uid, id)
        setAlarmMode("success")
        setAlarmText("북마크가 삭제되었습니다.")
        setIsShow(true)
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      else {
        pushBookmark(user.uid, id)
        setAlarmText("북마크가 추가되었습니다.")
        setAlarmMode("success")
        setIsShow(true)
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      setIsTimeOut(true)
      setTimeout(()=>{setIsTimeOut(false)},1000)
    }
  }
  const onLikeClick = () => {
    if (user === null) {
      setAlarmText("로그인 후 사용해주세요.")
      setAlarmMode("warning")
      setIsShow(true)
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
    else if (!isTimeOut) {
      if (isLiked(id)) {
        deleteLike(user.uid, id)
        setAlarmText("좋아요를 취소합니다.")
        setAlarmMode("success")
        try {
          db.collection("posts").doc(id).collection('lvc').doc("count").get().then((doc) => {
            if (doc.exists)
              db.collection("posts").doc(id).collection('lvc').doc("count").update({likesCount: doc.data().likesCount-1})
          })
        } catch (e) {
          console.log(e)
        }
        setIsShow(true)
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      else {
        pushLike(user.uid, id)
        setAlarmText("이 기사를 좋아합니다.")
        setAlarmMode("success")
        setIsShow(true)
        try {
          db.collection("posts").doc(id).collection('lvc').doc("count").get().then((doc) => {
            if (doc.exists)
              db.collection("posts").doc(id).collection('lvc').doc("count").update({likesCount: doc.data().likesCount+1})
          })
        } catch (e) {
          console.log(e)
        }
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      setIsTimeOut(true)
      setTimeout(()=>{setIsTimeOut(false)},1000)
    }
  }

  const onShareClick = () => {
    if (navigator.share) {
    navigator.share({
      title: "한국다문화뉴스",
      text: props.title,
      url: `https://multicultural-news.netlify.app/post/${history[history.length-1]}`,
    })
  } else {
    setShowBackdrop(true)
  }
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }
  const handleCopy = () => {
    setIsShow(true)
    setAlarmText("Url이 복사되었습니다!")
    setTimeout(() => {
      setIsShow(false)
    },2000)
  }

  return (
    <div className={styles.main_container} >
      <Card sx={{ width: "100%", maxWidth: 500, marginTop: "20px", marginLeft:'10px', marginRight:"10px" }}>
        <CardHeader
          title={props.data.title}
          subheader={`${props.data.createdAt} | ${props.data.author}`}
          onClick={onThumbnailClick}
        />
        <CardMedia
          component="img"
          height="194"
          image={props.data.thumbnail.replace("http://","https://")}
          alt={props.data.title}
          onClick={onThumbnailClick}
        />
        <CardContent onClick={onThumbnailClick} style={{ padding: "8px" }}>
          <Typography variant="body2" color="#3f729b">
            {props.data.tag}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${subtitle}...`}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="bookmark" onClick={onBookmarkClick}>
            {
            isBookmarked(id) ?
              <BookmarkBorderIcon style={{ color: "rgb(255, 134, 154)" }} />
            :
              <BookmarkBorderIcon />
            }
          </IconButton>
          <IconButton aria-label="like" onClick={onLikeClick}>
            {
            isLiked(id) ?
              <ThumbUpOffAltIcon style={{ color: "rgb(255, 134, 154)" }} />
            :
              <ThumbUpOffAltIcon />
            }
          </IconButton>
          <IconButton aria-label="share" onClick={onShareClick}>
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Alert mode={alarmMode} isShow={isShow} text={alarmText} />
      <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
        <ShareLink url={`https://multicultural-news.netlify.app/post/${id}`} handleCopy={handleCopy} />
      </Backdrop>
    </div>
  )
}
export default ThumbnailPost
