import React from "react"
import { withPublic } from "src/hook/route";
import styles from 'styles/login.module.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Image from "next/image";
import logo from "public/logo.png"
import { GoogleLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import { motion } from "framer-motion";
import { useRouter} from "next/router"

const Login = ({auth}) => {
  const { user, loginWithGoogle, loginWithFacebook, error } = auth;
  const router = useRouter()

  const onBackButtonClick = () => {
    router.back()
  }
  
  return (
    <div className={styles.main_container}>
      <div className={styles.header_container}>
        <div className={styles.icon_container} onClick={onBackButtonClick}><ArrowBackIosIcon style={{fontSize: "15px"}}/></div>
          <p onClick={onBackButtonClick}>뒤로가기</p>
      </div>
      <div className={styles.content_container}>
        <motion.h1 className={styles.main_text} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1 },y:0 }}>Lorem ipsum dolort</motion.h1>
        <motion.h2 className={styles.main_text} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1,  },y:0 }}>consectetur adipiscing elit</motion.h2>
        <motion.div className={styles.logo_container} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1, },y:0 }}>
          <Image src={logo} alt={"한국다문화뉴스 로고"} layout="fill" objectFit="cover" objectPosition="center"/>
        </motion.div>
        <motion.h3 className={styles.login_text} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}>LOGIN</motion.h3>
        <motion.h4 className={styles.social_text} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}>소셜 로그인으로 간편하게 로그인하세요!</motion.h4>
        <motion.h4 className={styles.social_text2} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}>Log in easily with social login!</motion.h4>
        <motion.div className={styles.button_container} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5} }}>
          <GoogleLoginButton onClick={()=>loginWithGoogle()}><span>구글로 로그인</span></GoogleLoginButton>
        </motion.div>
        <motion.div className={styles.button_container2} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay:0.5 } }}>
          <FacebookLoginButton onClick={()=>loginWithFacebook()}><span>페이스북으로 로그인</span></FacebookLoginButton>
        </motion.div>
      </div>
      {/* {error && <h1>{error}</h1>}
      <button onClick={loginWithGoogle}>Google</button>
      <button onClick={loginWithFacebook}>Facebook</button>
      <h1>{user?.uid}</h1> */}
    </div>
  )
}
export default withPublic(Login);