import React, { useState, useEffect } from "react"
import styles from "styles/main/thumbnailPost.module.css"
import Image from "next/image";
import Link from "next/link"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const ThumbnailPost = (props) => {
  const [randomNumber, setRandomNumber] = useState()
  useEffect(() => {
    //Random number from 0~8 (int)
    setRandomNumber(Math.floor(Math.random() * 9))
  },[])
  return (
    <Link href={`/post/${props.data.docId}`}>
      <div className={styles.main_container}>
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
          <Image src={props.data.thumbnail} alt={props.data.title} layout="fill" objectFit="cover" objectPosition="center" priority loading="eager"/>
        </div>
        <div className={styles.footer_container}>
          <h2>{props.data.title}</h2>
          <h3>{props.data.tag}</h3>
          <h4>{`${props.data.createdAt} | ${props.data.author}`}</h4>
        </div>
      </div>
    </Link>
  )
}
export default ThumbnailPost