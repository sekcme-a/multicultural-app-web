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

const ThumbnailPost = (props) => {
  const [randomNumber, setRandomNumber] = useState()
  const [id, setId] = useState("")
  const [isOpenThisPost, setIsOpenThisPost] = useState()
  const { history, pushHistory, isOnPost} = useNavi()
  useEffect(() => {
    //Random number from 0~8 (int)
    setRandomNumber(Math.floor(Math.random() * 9))
  }, [])
  useEffect(() => {
    if(props.id) setId(props.id)
    else setId(props.data.docId)
  }, [])

  const onThumbnailClick = () => {
    setIsOpenThisPost(true)
    pushHistory(id)
  }
  return (
      <div className={styles.main_container} onClick={onThumbnailClick}>
        <div className={styles.header_body_container}>
          <div className={styles.overlay}>
            <p className={randomNumber === 0 ? `${styles.category} ${styles.color1}` : randomNumber === 1 ? `${styles.category} ${styles.color2}` : 
              randomNumber === 2 ? `${styles.category} ${styles.color3}` : randomNumber === 3 ? `${styles.category} ${styles.color4}` :
              randomNumber === 4 ? `${styles.category} ${styles.color5}` : randomNumber === 5 ? `${styles.category} ${styles.color6}` :
              randomNumber === 6 ? `${styles.category} ${styles.color7}` : randomNumber === 7 ? `${styles.category} ${styles.color8}` : `${styles.category} ${styles.color6}`
            }>
              {props.data.category}
            </p>
            <BookmarkBorderIcon className={styles.icon} />
          </div>
          <Image src={props.data.thumbnail} alt={props.data.title} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center" priority={true} />
        </div>
        <div className={styles.footer_container}>
          <h2>{props.data.title}</h2>
          <h3>{props.data.tag}</h3>
          <h4>{`${props.data.createdAt} | ${props.data.author}`}</h4>
        </div>
      </div>
  )
}
export default ThumbnailPost
