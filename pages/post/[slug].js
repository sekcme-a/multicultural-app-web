import React, {useEffect, useState} from "react"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { slug } = router.query
  const [hasData, setHasData] = useState(false)
  // const []

  useEffect(() => {
    const fetchData = async () => {
      const doc = await db.collection("posts").doc(slug).get()
      if (doc.data()) {
        setHasData(true)
        console.log(router)
      }
    }
    fetchData()
  }, [])
  
  if (!hasData) {
    <div>존재하지 않거나 삭제된 게시물입니다.</div>
  }
  return (
    <>
    </>
  )
}
export default Post