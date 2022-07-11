
import React, {useEffect, useState} from "react"
import { withProtected, withPublic } from "src/hook/route";
import styles from "styles/setting/setting.module.css"
import { firestore as db } from "firebase/firebase";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from "next/router";
import Image from "next/image"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Link from "next/link";
const Setting = ({auth}) => {
  const { user, logout } = auth;
  const [name, setName] = useState()
  const [photo, setPhoto] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      if (user.uid) {
        db.collection("users").doc(user.uid).get().then((doc) => {
          setName(doc.data().name)
          setPhoto(doc.data().photo)
          setIsLoading(false)
        })
      }
    }
    fetchData()
  }, [])
  const onTitleClick = () => {
    router.back()
  }
  if(isLoading)
    return <></>
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>계정</p>
      </div>
      <Link href="/setting/profile">
        <div className={styles.item_container}>
          <div className={styles.img_container}>
            <Image src={photo} alt={"유저이미지"} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center" priority />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>{name}</p>
            <p className={styles.info}>공개 프로필 및 정보를 편집합니다.</p>
          </div>
        </div>
      </Link>
      <div className={styles.custom_border} />
      <Link href="/setting/alarm">
        <div className={styles.item_container}>
          <div className={styles.icon_container}>
            <NotificationsNoneIcon />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>알림</p>
            <p className={styles.info}>알림 유무와 빈도수를 설정합니다.</p>
          </div>
        </div>
      </Link>
      <Link href="/setting/bookmark">
        <div className={styles.item_container}>
          <div className={styles.icon_container}>
            <BookmarkBorderIcon />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>북마크</p>
            <p className={styles.info}>내가 저장한 기사.</p>
          </div>
        </div>
      </Link>
      <Link href="/setting/heart">
        <div className={styles.item_container}>
          <div className={styles.icon_container}>
            <ThumbUpOutlinedIcon />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>좋아요</p>
            <p className={styles.info}>내가 좋아요를 누른 기사.</p>
          </div>
        </div>
      </Link>
      <div className={styles.custom_border} />
      <Link href="/setting/appinfo">
        <p className={styles.item_container} onClick={logout}>
          앱 정보
        </p>
      </Link>
      <Link href="/setting/help">
        <p className={styles.item_container} onClick={logout}>
          도움말
        </p>
      </Link>
      <Link href="/setting/tip">
        <p className={styles.item_container} onClick={logout}>
          뉴스 제보
        </p>
      </Link>
      <Link href="/setting/feedback">
        <p className={styles.item_container} onClick={logout}>
          피드백 보내기
        </p>
      </Link>
      <Link href="/login">
        <p className={styles.item_container} onClick={logout}>
          로그아웃
        </p>
      </Link>
    </div>
  )
}
export default withProtected(Setting);