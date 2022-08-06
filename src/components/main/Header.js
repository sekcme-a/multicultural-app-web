import React, {useEffect, useState, useRef} from "react"
import styles from "styles/main/header.module.css"
import Image from "next/image"
import logo from "public/logo.png"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import useNavi from "src/hook/customNavigation"

const Header = (props) => {
  const [isSearchClick, setIsSearchClick] = useState(false)
  const [categoryList, setCategoryList] = useState([""])
  const [localList, setLocalList] = useState([""])
  const [countryList, setCountryList] = useState([""])
  // const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isSwipeToLeft, isSwipeToRight, setIsSwipeToLeft, setIsSwipeToRight, isOnPost } = useNavi()
  const onSearchContainerClick = () => {
    router.push('/search')
  }
  const onSearchContainerBlur = () => {
    setIsSearchClick(false)
  }

  useEffect(() => {
    let temp = []
    db.collection("category").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setCategoryList(temp)
    })
    let temp2=[]
    db.collection("local").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp2.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setLocalList(temp2)
    })
    let temp3=[]
    db.collection("country").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp3.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setCountryList(temp3)
    })
    setIsLoading(false)
  }, [])


  //좌우 슬라이드 시 메뉴 변경
  useEffect(() => {
    if (isSwipeToRight && !isOnPost) {
      if (router.pathname === "/")
        router.push(`/local/${localList[0].id}`)
      else if(router.pathname.includes("local"))
        router.push(`/country/${countryList[0].id}`)
      else if(router.pathname.includes("country"))
        router.push(`/category/${categoryList[0].id}`)
      else {
        for (let i = 0; i < categoryList.length - 1; i++) {
          if (categoryList[i].id === router.query.slug)
            router.push(`/category/${categoryList[i + 1].id}`)
        }
      }
      setIsSwipeToRight(false)
    }
    
  }, [isSwipeToRight])
  useEffect(() => {
    if (isSwipeToLeft && !isOnPost) {
      if (router.query.slug === categoryList[0].id) 
        router.push(`/country/${countryList[0].id}`)
      else if(router.pathname.includes("country"))
        router.push(`/local/${localList[0].id}`)
      else if(router.pathname.includes("local"))
        router.push('/')
      else {
        for (let i = categoryList.length - 1; i >= 0; i--){
          if(categoryList[i].id===router.query.slug)
            router.push(`/category/${categoryList[i-1].id}`)
        }
      }
    }
    setIsSwipeToLeft(false)
  },[isSwipeToLeft])




  if (isLoading) {
    return (
      <></>
    )
  }
  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo_search_container}>
          <Link href="/" passHref scroll={false}>
            <a><Image src={logo} width={150} height={27} layout="fixed" priority/></a>
          </Link>
          <div className={styles.search_container} onClick={onSearchContainerClick}>
            <SearchIcon sx={{fontSize: 15}} />
          </div>
        </div>
        <ul className={styles.menu_container}>
          <li className={styles.menu_items}>
            <Link href={'/'} passHref scroll={false}>
              <a>
                <p className={router.pathname==='/' ? styles.selected : undefined}>메인</p>
                <div className={router.pathname==='/' ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          {/* <li className={styles.menu_items}>
            <Link href={`/local/${localList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("local")  ? styles.selected : undefined}>지역별</p>
                <div className={router.pathname.includes("local") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li> */}
          <li className={styles.menu_items}>
            <Link href={`/country/${countryList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("country") ? styles.selected : undefined}>국가별</p>
                <div className={router.pathname.includes("country") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          {categoryList?.map((category,index) => {
            return (
              <li key={index} className={styles.menu_items}>
                <Link href={`/category/${category.id}`} passHref scroll={false}>
                  <a>
                    <p className={router.query.slug===category.id ? styles.selected : undefined}>{category.name}</p>
                    <div className={router.query.slug===category.id ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      {/* {router.pathname.includes("local")&&
        <ul className={styles.sub_header_container}>
          {localList?.map((local,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/local/${local.id}`} passHref>
                  <a>
                    <p className={router.query.slug===local.id ? styles.sub_selected : undefined}>{local.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      } */}
      {router.pathname.includes("country")&&
        <ul className={styles.sub_header_container}>
          {countryList?.map((country,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/country/${country.id}`} passHref>
                  <a>
                    <p className={router.query.slug===country.id ? styles.sub_selected : undefined}>{country.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      }
    </>
  )
}
export default Header