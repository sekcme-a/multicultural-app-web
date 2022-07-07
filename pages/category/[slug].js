import React from "react"
import { useRouter } from "next/router";
import styles from "styles/category.module.css"

const Category = () => {
  const router = useRouter();
  const { slug } = router.query
  return (
    <div className={styles.main_container}>
      
    </div>
  )
}
export default Category