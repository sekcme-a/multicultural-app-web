import React from "react"
import HoverPost from "src/components/post/HoverPost"
import useNavi from "src/hook/customNavigation"
import ThumbnailPost from "src/components/main/ThumbnailPost"
import styles from "styles/main/postList.module.css"
import MiniThumbnail from "src/components/main/MiniThumbnail"

const MiniPostList = (props) => {
  const { setTouchStartXY, setTouchEndXY, isOnPost, history } = useNavi()
  const lazyRoot = React.useRef(null)
  
  const onTouchStart = (e) => {
    setTouchStartXY(e.targetTouches[0].clientX, e.targetTouches[0].clientY)
  }
  const onTouchEnd = (e) => {
    setTouchEndXY(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  }

  return (
    <div className={styles.main_container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {props.category === "posts" && <h1 className={styles.title}>실시간 뉴스</h1>}
      {props.data?.map((doc, index) => {
        return (
          <>
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
          </>
        )
      })}
      {isOnPost && <HoverPost id={history[history.length-1]} />}
    </div>
  )
}
export default MiniPostList