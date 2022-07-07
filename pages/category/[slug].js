import React, {useEffect, useState} from "react"
import { useRouter } from "next/router";
import styles from "styles/category.module.css"
import PostList from "components/main/PostList"

const Category = (props) => {
  const router = useRouter();
  const { slug } = router.query
  useEffect(() => {
    console.log(props.isBottom)
  },[])
  return (
    // <PostList></PostList>
    <></>
  )
}
export default Category