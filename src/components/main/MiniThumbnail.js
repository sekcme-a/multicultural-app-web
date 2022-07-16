import React, { useEffect, useState } from "react"
import Image from "hook/Image"
import styles from "styles/main/miniThumbnail.module.css"

const MiniThumbnail = (props) => {
  return (
    <div className={styles.main_container}>
      <div className={styles.content_container}>
        <h2>{`[${props.data.category}]`}</h2>
        <h3>{props.data.title}</h3>
        <h4>{props.data.tag}</h4>
        <h5>{props.data.author}</h5>
      </div>
      <div className={styles.img_container}>
        <Image src={props.data.thumbnail} quality={50} alt={props.data.title} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center" priority={true} />
      </div>
    </div>
  )
}
export default MiniThumbnail