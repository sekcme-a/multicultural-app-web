import React from "react"
import NotificationHeader from "src/components/notification/NoticationHeader"
import styles from "styles/notification/notification.module.css"

const Notification = () => {
  return (
    <div className={styles.main_container}>
      <NotificationHeader loc="notification" />
      <div className={styles.no_notification}>공지사항이 없습니다.</div>
    </div>
  )
}
export default Notification