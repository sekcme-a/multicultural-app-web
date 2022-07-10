import React, { useEffect, useState } from "react"
import styles from "styles/search.module.css"
import { firestore as db } from "firebase/firebase"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';
import MiniThumbnail from "src/components/public/MiniThumbnail"
import ThumbnailPost from "src/components/main/ThumbnailPost"
import { searchFor } from "firebase/search";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Search = () => {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [categoryList, setCategoryList] = useState()
  const [localList, setLocalList] = useState()
  const [countryList, setCountryList] = useState()
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [resultList, setResultList] = useState([])
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
  const onSearchClick = async () => {
    setIsSearchMode(true)
    setIsLoading(true)
    const result = await searchFor("posts", "keyword", input, 30)
    for (let i = 0; i < result.length; i++){
      result[i].data.createdAt = getDate(result[i].data.createdAt)
    }
    setResultList(result)
    setIsLoading(false)
  }
  const getDate = (d) => {
    const date = new Date(d.toMillis())
    if(date.getMonth()+1<10 && date.getDate()<10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1<10 && date.getDate()>=10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && d.getDate()<10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && date.getDate()>=10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  }
  if (isLoading&&isSearchMode===false) {
    return (
      <div className={styles.skeleton_container}>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={35} />
        <Skeleton animation="wave" variant="text" width={80} height={20} style={{marginTop: 10}} />
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="text" width={80} height={20} style={{marginTop: 10}} />
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>

        {/* <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={118} /> */}
      </div>
    )
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.search_container}>
        <SearchIcon style={{fontSize:"medium"}} />
        <input className={styles.search_input} value={input} onChange={onInputChange} onKeyPress={handleOnKeyPress} placeholder="Search" />
        <p className={styles.search_button} onClick={onSearchClick}>검색</p>
      </div>
      {isSearchMode ?
        (
          <>
            {isLoading ?
              <div className={styles.skeleton_search_container}>
                <Skeleton animation="wave" variant="text" width={80} height={20} style={{marginTop: 10}} />
                <Skeleton animation="wave" variant="rectangular" width="100%" height={170} style={{marginTop: 10}} />
                <Skeleton animation="wave" variant="text" width={250} style={{marginTop: 3}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="rectangular" width="100%" height={260} style={{marginTop: 10}} />
                <Skeleton animation="wave" variant="text" width={250} style={{marginTop: 3}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
              </div>
              :
              <>
              <h3 className={styles.title}>{`${resultList.length}개의 검색결과`}</h3>
              {resultList.length !== 0 && resultList.map((data, index) => {
                return (
                  // <MiniThumbnail data={data} />
                  <ThumbnailPost data={data.data} />
                )
              })}
              </>
            }
          </>
        ) :
        (
        <>
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
          </>
        )}
    </div>
  )
}

export default Search