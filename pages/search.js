import React, { useEffect, useState } from "react"
import styles from "styles/search.module.css"
import { firestore as db } from "firebase/firebase"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';

const Search = () => {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [categoryList, setCategoryList] = useState()
  const [localList, setLocalList] = useState()
  const [countryList, setCountryList] = useState()
  const [isSearchMode, setIsSearchMode] = useState(false)
  const onInputChange = (e) => {
    setInput(e.target.value)
    if (e.target.value === "")
      setIsSearchMode(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const category = await db.collection("category").doc("list").get()
      const local = await db.collection("local").doc("list").get()
      const country = await db.collection("country").doc("list").get()
      let temp1 = []; let temp2 = []; let temp3 = []
      for (let i = 0; i < category.data().list.length; i++){
        temp1.push({name: category.data().list[i], id: category.data().idList[i]})
      }
      for (let i = 0; i < local.data().list.length; i++){
        temp2.push({name: local.data().list[i], id: local.data().idList[i]})
      }
      for (let i = 0; i < country.data().list.length; i++){
        temp3.push({name: country.data().list[i], id: country.data().idList[i]})
      }
      setCategoryList(temp1);setLocalList(temp2); setCountryList(temp3);
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearchClick()
    }
  }
  const onSearchClick = () => {
    setIsSearchMode(true)
  }

  if (isLoading) {
    return (<div className={styles.main_container}>Loading</div>)
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.search_container}>
        <SearchIcon style={{fontSize:"medium"}} />
        <input className={styles.search_input} value={input} onChange={onInputChange} onKeyPress={handleOnKeyPress} placeholder="Search" />
        <p className={styles.search_button} onClick={onSearchClick}>검색</p>
      </div>
      <h3 className={styles.title}>모든 카테고리</h3>
      {categoryList?.map((item, index) => {
        return (
          <Link key={index} href={`/category/${item.id}`} passHref >
            <div className={`${styles.item_container} ${styles.category}`}>
              <p>{item.name}</p>
            </div>
          </Link>
        )
      })}
      <h3 className={styles.title}>모든 지역별</h3>
      {localList?.map((item, index) => {
        return (
          <Link key={index} href={`/local/${item.id}`} passHref >
            <div className={`${styles.item_container} ${styles.local}`}>
              <p>{item.name}</p>
            </div>
          </Link>
        )
      })}
      <h3 className={styles.title}>모든 국가별</h3>
      {countryList?.map((item, index) => {
        return (
          <Link key={index} href={`/country/${item.id}`} passHref >
            <div className={`${styles.item_container} ${styles.country}`}>
              <p>{item.name}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Search