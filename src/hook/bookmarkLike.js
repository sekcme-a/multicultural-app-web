import { createContext, useState, useContext, useEffect } from "react"
import { firestore as db } from "firebase/firebase"

const bookmarkLikeContext = createContext()

export default function useBookmarkLike() {
  return useContext(bookmarkLikeContext)
}

export function BookmarkLikeProvider(props) {
  const [bookmarkList, setBookmarkList] = useState([])
  const [likeList, setLikeList] = useState([])

  const pushBookmark = (uid, id) => {
    const temp = bookmarkList
    temp.push(id)
    setBookmarkList(temp)
    try {
      db.collection("users").doc(uid).update({bookmark: temp})
      return true
    } catch (e) {
      return false
    }
  }

  const deleteBookmark = (uid,id) => {
    const isId = (value) => {
      return value!==id
    }
    const temp = bookmarkList
    const temp2 = temp.filter(isId)
    // console.log(temp2)
    setBookmarkList(temp2)
    try {
      db.collection("users").doc(uid).update({bookmark: temp2})
      return true
    } catch (e) {
      return false
    }
  }

  const isBookmarked = (id) => {
    // console.log(bookmarkList)
    return bookmarkList.includes(id)
  }

  const value = {
    bookmarkList,
    likeList,
    pushBookmark,
    deleteBookmark,
    setBookmarkList,
    isBookmarked,
  }

  return <bookmarkLikeContext.Provider value={value} {...props} />
}