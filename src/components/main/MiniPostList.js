import React, {useEffect} from "react"
import HoverPost from "src/components/post/HoverPost"
import useNavi from "src/hook/customNavigation"
import ThumbnailPost from "src/components/main/ThumbnailPost"
import styles from "styles/main/postList.module.css"
import MiniThumbnail from "src/components/main/MiniThumbnail"
import { useRouter } from "next/router"

const MiniPostList = (props) => {
  const { setTouchStartXY, setTouchEndXY, isOnPost, history,setIsSwipeToRight, isSwipeToRight, isSwipeToLeft, setIsSwipeToLeft } = useNavi()
  const lazyRoot = React.useRef(null)
  const router = useRouter()
  useEffect(() => {
    if (isSwipeToRight&& !isOnPost) {
      if(router.pathname.includes("/search"))
        router.push("/notification/alarm")
      else if(router.pathname.includes("/notification/alarm"))
        router.push("/notification/notification")
      else if (router.pathname.includes("notification/notification"))
        router.push("/setting")
      setIsSwipeToRight(false)
    }
  },[isSwipeToRight])
  useEffect(() => {
    if (isSwipeToLeft && !isOnPost) {
      if(router.pathname.includes("/setting"))
        router.push("/notification/notification")
      else if(router.pathname.includes("/notification/notification"))
        router.push("/notification/alarm")
      else if (router.pathname.includes("/notification/alarm"))
        router.push("/search")
      else if(router.pathname.includes("/search"))
        router.push("/")
      setIsSwipeToLeft(false)
    }
  },[isSwipeToLeft])
  
  const onTouchStart = (e) => {
    setTouchStartXY(e.targetTouches[0].clientX, e.targetTouches[0].clientY)
  }
  const onTouchEnd = (e) => {
    setTouchEndXY(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  }


  return (
    <div className={styles.main_container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {props.category === "posts" && <h1 className={styles.title}>실시간 뉴스</h1>}
      {!isOnPost && props.data?.map((doc, index) => {
        return (
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
        )
      })}
      {isOnPost && <HoverPost id={history[history.length-1]} />}
      {props.noTransparent===undefined && <div className={styles.transparent_container} />}
    </div>
  )
}
export default MiniPostList