import React, {useEffect, useState} from "react"
import { useRouter } from "next/router";
import styles from "styles/category.module.css"
import PostList from "components/main/PostList"

const Category = (props) => {
  const router = useRouter();
  const { slug } = router.query

  return (                       
    <PostList isBottom={props.isBottom} category={slug} mode="country"></PostList>
  )            
}
export default Category