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
import PostList from "src/components/main/PostList";
import MiniPostList from "src/components/main/MiniPostList";

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
    let result = []
    result = await searchFor("posts", "keyword", input, 30)
    const res = await searchData()
    for (let i = 0; i < res.list.length; i++){
      const doc = await db.collection("posts").doc(res.list[i].toString()).get()
      if (doc.exists) {
        result.push({
          id: doc.id,
          title: doc.data().title,
          thumbnail: doc.data().thumbnail,
          tag: doc.data().tag,
          category: doc.data().category,
          author: doc.data().author,
        })
      }
    }

    // result.push(res)
    setResultList(result)
    setIsLoading(false)
  }

  const searchData = () => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        try {
          fetch('/api/search', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ input: input }),
          })
            .then((res) => res.json())
            .then((userData) => {
              resolve(userData)
            })
        } catch (e) {
          resolve(e.message)
        }
      },300)
    })
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
              {/* {resultList.length !== 0 && resultList.map((data, index) => {
                return (
                  // <MiniThumbnail data={data} />
                  <>
                  <ThumbnailPost data={data.data} key={index} id={data.id} />
                  </>
                )
              })} */}
                {/* <PostList list={resultList} mode="custom" category="custom"/> */}
                <MiniPostList data={resultList} />
              </>
            }
          </>
        ) :
        (
        <>
          <h3 className={styles.title}>모든 카테고리</h3>
          <div className={styles.list_container}>
            {categoryList?.map((item, index) => {
              return (
                <Link key={index} href={`/category/${item.id}`} passHref >
                  <div className={`${styles.item_container} ${styles.category}`}>
                    <p>{item.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <h3 className={styles.title}>모든 언어별</h3>
          <div className={styles.list_container}>
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
          </>
        )}
    </div>
  )
}

export default Search