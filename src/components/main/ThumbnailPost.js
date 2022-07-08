
import React, { useState, useEffect, useRef } from "react"
import styles from "styles/main/thumbnailPost.module.css"
// import Image from "next/image";
import Image from "hook/Image"
import Link from "next/link"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer"

const ThumbnailPost = (props) => {
  const ref = useRef();
  const [randomNumber, setRandomNumber] = useState()
  const [inViewRef, inView] = useInView({ threshold: 0.3})

  const aniTitle = useAnimation();
  const aniTag = useAnimation();
  const aniCreatedAt = useAnimation();

  if (inView) {
    aniTitle.start({
      opacity: 1, transition:{duration: .3}
    })
    aniTag.start({
      opacity:1, transition:{delay: .4, duration: .3 }
    })
    aniCreatedAt.start({
      opacity:1, transition:{delay: .8, duration: .3 }
    })
  }

  useEffect(() => {
    //Random number from 0~8 (int)
    setRandomNumber(Math.floor(Math.random() * 9))
  }, [])

  return (
    <Link href={`/post/${props.data.docId}`}>
      <div className={styles.main_container} ref={inViewRef}>
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
          <motion.div initial={{ opacity: 0 }} animate={aniTitle}>
            <h2>{props.data.title}</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={aniTag}>
            <h3>{props.data.tag}</h3>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={aniCreatedAt}>
            <h4>{`${props.data.createdAt} | ${props.data.author}`}</h4>
          </motion.div>
        </div>
      </div>
    </Link>
  )
}
export default ThumbnailPost