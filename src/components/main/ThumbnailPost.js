import React, { useState, useEffect } from "react"
import styles from "styles/main/thumbnailPost.module.css"
// import Image from "next/image";
import Image from "hook/Image"
import Link from "next/link"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
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

const ThumbnailPost = (props) => {
  const [randomNumber, setRandomNumber] = useState()
  const [id, setId] = useState("")
  // const [isOpenThisPost, setIsOpenThisPost] = useState()
  const { history, pushHistory, isOnPost} = useNavi()
  const { bookmarkList, isBookmarked, deleteBookmark, pushBookmark } = useBookmarkLike()
  
  const { user } = useAuth()
  useEffect(() => {
    //Random number from 0~8 (int)
    setRandomNumber(Math.floor(Math.random() * 9))
  }, [])
  useEffect(() => {
    if(props.id) setId(props.id)
    else setId(props.data.docId)
  }, [])

  const onThumbnailClick = () => {
    // setIsOpenThisPost(true)
    pushHistory(id)
  }

  return (
      // <div className={styles.main_container} onClick={onThumbnailClick}>
      //   <div className={styles.header_body_container}>
      //     <div className={styles.overlay}>
      //       <p className={randomNumber === 0 ? `${styles.category} ${styles.color1}` : randomNumber === 1 ? `${styles.category} ${styles.color2}` : 
      //         randomNumber === 2 ? `${styles.category} ${styles.color3}` : randomNumber === 3 ? `${styles.category} ${styles.color4}` :
      //         randomNumber === 4 ? `${styles.category} ${styles.color5}` : randomNumber === 5 ? `${styles.category} ${styles.color6}` :
      //         randomNumber === 6 ? `${styles.category} ${styles.color7}` : randomNumber === 7 ? `${styles.category} ${styles.color8}` : `${styles.category} ${styles.color6}`
      //       }>
      //         {props.data.category}
      //     </p>
      //       {
      //         isBookmarked(id) ?
      //           <BookmarkBorderIcon className={styles.icon} style={{ color: "rgb(255, 134, 154)" }} />
      //         :
      //           <BookmarkBorderIcon className={styles.icon}/>
      //         }
      //     </div>
      //     <Image src={props.data.thumbnail} quality={20} alt={props.data.title} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center" priority={true} />
      //   </div>
      //   <div className={styles.footer_container}>
      //     <h2>{props.data.title}</h2>
      //     <h3>{props.data.tag}</h3>
      //     <h4>{`${props.data.createdAt} | ${props.data.author}`}</h4>
      //   </div>
      // </div>
    <div className={styles.main_container} onClick={onThumbnailClick}>
      <Card sx={{ maxWidth: 400, marginTop: "20px" }}>
      {/* <Card sx={{ maxWidth: 400, marginTop: "20px", border: "1px solid rgb(192, 192, 192)" }}> */}
        <CardHeader
          title={props.data.title}
          subheader={`${props.data.createdAt} | ${props.data.author}`}
          
        />
        <CardMedia
          component="img"
          height="194"
          image={props.data.thumbnail}
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This impressive paella is a perfect party dish and a fun meal to cook
            together with your guests. Add 1 cup of frozen peas along with the mussels,
            if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  )
}
export default ThumbnailPost
