import React, {useEffect, useState, useRef} from "react"
import styles from "styles/main/header.module.css"
import Image from "next/image"
import logo from "public/logo.png"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';
import { firestore as db } from "firebase/firebase"

const Header = (props) => {
  const [isSearchClick, setIsSearchClick] = useState(false)
  const [categoryList, setCategoryList] = useState([""])
  // const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const onSearchContainerClick = () => {
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
          <Image src={logo} width={120} height={22} layout="fixed" priority/>
        </Link>
        <div className={styles.search_container} onClick={onSearchContainerClick}>
          <SearchIcon sx={{fontSize: 15}} />
          <input type="text" className={styles.search_input} placeholder="뉴스 검색"></input>
        </div>
      </div>
      <div className={styles.menu_container}>
        {categoryList.map((category,index) => {
          return (
            <div key={index} className={styles.menu_items} onClick={()=>onItemClick(category)}>
              <p className={props.selectedCategory===category && styles.selected}>{category}</p>
              <div className={props.selectedCategory===category ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Header