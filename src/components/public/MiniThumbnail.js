import React, { useEffect, useState } from "react"
import styles from "styles/public/miniThumbnail.module.css"

const MiniThumbnail = (props) => {
  console.log(props)
  return (
    <div className={styles.main_container}>
      <h1>{props.data.data.title}</h1>
      <h2>{props.data.data.tag}</h2>
      
    </div>
  )
}
export default MiniThumbnail