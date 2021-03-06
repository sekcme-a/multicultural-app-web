import React, {useState, useEffect} from "react"
import styles from "styles/main/footer.module.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from "next/router";
import useNavi from "src/hook/customNavigation";
import Link from "next/link"

const Footer = () => {
  const router = useRouter()
  const { clearHistory, isOnPost, popHistory,history, showId, setShowId } = useNavi()

  const onBackClick = () => {
    popHistory()
    console.log(isOnPost)
    if (isOnPost) {
      setShowId(history[history.length-1])
    }
    else router.back()
  }
  const onMenuChange = () => {
    clearHistory()
  }
  return (
    <ul className={styles.main_container}>
      <Link href="/">
        <li className={router.pathname==="/" ? `${styles.item_container} ${styles.selected}`: styles.item_container} onClick={onMenuChange}>
          <HomeOutlinedIcon className={styles.icon} />
          <p>홈</p>
        </li>
      </Link>
      <Link href="/search">
        <li className={router.pathname==="/search" ? `${styles.item_container} ${styles.selected}`: styles.item_container} onClick={onMenuChange}>
          <SearchIcon className={styles.icon} />
          <p>검색</p>
        </li>
      </Link>
      <Link href="/notification/alarm">
        <li className={router.pathname.includes("/notification")? `${styles.item_container} ${styles.selected}` : styles.item_container} onClick={onMenuChange}>
          <NotificationsNoneIcon className={styles.icon}/>
          <p>알림</p>
        </li>
      </Link>
      <Link href="/setting">
        <li className={router.pathname ==="/setting" ? `${styles.item_container} ${styles.selected}`: styles.item_container} onClick={onMenuChange}>
          <PermIdentityIcon className={styles.icon}/>
          <p>설정</p>
        </li>
      </Link>
      <li className={styles.item_container} onClick={onBackClick}>
        <ArrowBackIcon className={styles.icon}/>
        <p>뒤로가기</p>
      </li>
    </ul>
  )
}
export default Footer