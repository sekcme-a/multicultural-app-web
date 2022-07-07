import styles from "styles/main/mainNews.module.css"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCards, Pagination, Navigation } from "swiper";
import { firestore as db } from "firebase/firebase"
import Link from "next/link";
import Image from "next/image";

const MainNews = () => {
  const [list, setList] = useState()
  useEffect(() => {
    const fetchData = async () => {
    let tempIdList = []
    const doc = await db.collection("setting").doc("recommand").get()
      if (doc.exists) {
        const idList = doc.data().list
        console.log(idList)
        idList.map((docId) => {
          db.collection("posts").doc(docId).get().then((doc) => {
            tempIdList = ([
              ...tempIdList,
              {
                author: doc.data().author,
                category: doc.data().category,
                createdAt: getDate(doc.data().createdAt),
                tag: doc.data().tag,
                thumbnail: doc.data().thumbnail,
                title: doc.data().title,
                docId: doc.id
              }
            ])
            setList(tempIdList)
          })
        })
      } else {
        //시간순으로 정렬해 최근 5개의 기사 사용.
        setTimeout(async () => {
          const posts = await db.collection("posts").orderBy("createdAt", 'desc').limit(5).get()
          posts.docs.map((doc) => {
            tempIdList = ([
              ...tempIdList,
              {
                author: doc.data().author,
                category: doc.data().category,
                createdAt: getDate(doc.data().createdAt),
                tag: doc.data().tag,
                thumbnail: doc.data().thumbnail,
                title: doc.data().title,
                docId: doc.id
              }
            ])
          })
          setList(tempIdList)
        },0)
      }
    }
    fetchData()
  }, [])
  
  const getDate = (d) => {
    const date = new Date(d.toMillis())
    if(date.getMonth()+1<10 && date.getDate()<10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate()
    else if(date.getMonth()+1<10 && date.getDate()>=10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate()
    else if(date.getMonth()+1>=10 && d.getDate()<10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate()
    else if(date.getMonth()+1>=10 && date.getDate()>=10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
  }
  return (
    <div className={styles.main_container}>
      <h1>주요 뉴스</h1>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Pagination, Navigation]}
        className={styles.swiper}
        pagination={true}
      >
        {list?.map((doc, index) => {
          return (
            <SwiperSlide className={styles.swiper_slide} key={index}>
              <Link href={`/post/${doc.docId}`}>
                <div className={styles.swiper_container}>
                  <div className={styles.overlay}>
                    <h2>{doc.title}</h2>
                    <h3>{doc.tag}</h3>
                    <h4>{`${doc.createdAt} | ${doc.author}`}</h4>
                  </div>
                  <Image src={doc.thumbnail} alt="메인 배경 이미지" layout="fill" objectFit="cover" objectPosition="center"/>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
export default MainNews