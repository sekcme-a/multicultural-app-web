import React, {useEffect, useState, useRef} from "react"
import styles from "styles/main/header.module.css"
import Image from "next/image"
import logo from "public/logo.png"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';
import { firestore as db } from "firebase/firebase"
import Inko from "inko" 
import { useRouter } from "next/router"

const Header = (props) => {
  const [isSearchClick, setIsSearchClick] = useState(false)
  const [categoryList, setCategoryList] = useState([""])
  let inko = new Inko();
  // const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const onSearchContainerClick = () => {
    setIsSearchClick(true)
  }
  const onSearchContainerBlur = () => {
    setIsSearchClick(false)
  }

  useEffect(() => {
    db.collection("setting").doc("category").get().then((doc) => {
      setCategoryList(doc.data().list)
      setIsLoading(false)
    })
  }, [])


  const onItemClick = (category) => {
    props.handleChange(category)
  }
  if (isLoading) {
    return (
      <></>
    )
  }
  return (
    <div className={styles.header}>
      <div className={styles.logo_search_container}>
        <Link href="/" passHref>
          <a><Image src={logo} width={130} height={24} layout="fixed" priority/></a>
        </Link>
        <div className={styles.search_container} onClick={onSearchContainerClick} onBlur={onSearchContainerBlur}>
          <SearchIcon sx={{fontSize: 15}} />
          <input type="text" className={isSearchClick ? `${styles.search_input} ${styles.search_clicked}`: styles.search_input} placeholder="뉴스 검색" ></input>
        </div>
      </div>
      <ul className={styles.menu_container}>
        <li className={styles.menu_items}>
          <Link href={'/'} passHref>
            <a>
              <p className={router.pathname==='/' ? styles.selected : undefined}>메인</p>
              <div className={router.pathname==='/' ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
            </a>
          </Link>
        </li>
        {categoryList.map((category,index) => {
          return (
              <li key={index} className={styles.menu_items}>
                <Link href={`/category/${inko.ko2en(category)}`} passHref>
                  <a>
                    <p className={router.query.slug===inko.ko2en(category) ? styles.selected : undefined}>{category}</p>
                    <div className={router.query.slug===inko.ko2en(category) ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
                  </a>
                </Link>
              </li>
          )
        })}
      </ul>
    </div>
  )
}
export default Header