import React, {useState, useEffect} from "react"
import styles from "styles/main/footer.module.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";
import Link from "next/link"

const Footer = () => {
  const router = useRouter()

  const onBackClick = () => {
    router.back()
  }
  return (
    <ul className={styles.main_container}>
      <Link href="/">
        <li className={router.pathname==="/" ? `${styles.item_container} ${styles.selected}`: styles.item_container}>
          <HomeOutlinedIcon className={styles.icon} />
          <p>홈</p>
        </li>
      </Link>
      <Link href="/notification">
        <li className={router.pathname === "/notification" ? `${styles.item_container} ${styles.selected}` : styles.item_container}>
          <NotificationsNoneIcon className={styles.icon}/>
          <p>알림</p>
        </li>
      </Link>
      <Link href="/setting">
        <li className={router.pathname ==="/setting" ? `${styles.item_container} ${styles.selected}`: styles.item_container}>
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