import { createContext, useState, useContext, useEffect } from "react"
import { firestore as db } from "firebase/firebase"

const bookmarkLikeContext = createContext()

export default function useBookmarkLike() {
  return useContext(bookmarkLikeContext)
}

export function BookmarkLikeProvider(props) {
  const [bookmarkList, setBookmarkList] = useState([])
  const [likeList, setLikeList] = useState([])
  const [triggerReload, setTriggerReload] = useState(true)

  const pushBookmark = (uid, id) => {
    const temp = bookmarkList
    temp.push(id)
    setBookmarkList(temp)
    try {
      db.collection("users").doc(uid).update({bookmark: temp})
      setTriggerReload(!triggerReload)
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
      db.collection("users").doc(uid).update({ bookmark: temp2 })
      setTriggerReload(!triggerReload)
      return true
    } catch (e) {
      return false
    }
  }

  const getBookmarkList = (uid) => {
    if (uid !== undefined) {
      db.collection("users").doc(uid).get().then((doc) => {
        setBookmarkList(doc.data().bookmark)
      })
    } 
  }

  const isBookmarked = (id) => {
    // console.log(bookmarkList)
    return bookmarkList.includes(id)
  }

  const value = {
    bookmarkList,
    likeList,
    triggerReload,
    pushBookmark,
    deleteBookmark,
    setBookmarkList,
    isBookmarked,
    getBookmarkList
  }

  return <bookmarkLikeContext.Provider value={value} {...props} />
}