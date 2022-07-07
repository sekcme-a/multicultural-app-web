import React, {useState, useEffect, useRef} from "react"
import dynamic from 'next/dynamic'
import {useRouter} from "next/router"
import style from "styles/admin/container.module.css"
import { firestore as db } from "firebase/firebase"
import "react-quill/dist/quill.snow.css";
import { uploadImage } from "firebase/uploadImage"
import Loader from "components/public/Loader"
import useAuth from "src/hook/auth";
import { compressImage } from "src/hook/compressImage"
import { useLeavePageConfirm } from "src/hook/useLeavePageConfirm"
const Editor = dynamic(import('components/public/Editor'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})



const EditArticle = () => {
  // const quillRef = useRef(null)
  const { user } = useAuth();
  const [docId, setDocId] = useState("")
  const router = useRouter()

  useLeavePageConfirm()

  const [textData, setTextData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [tag, setTag] = useState("")
  const [author, setAuthor] = useState("")
  const [importance, setImportance] = useState("")
  const onTitleChange = (e) => { setTitle(e.target.value) }
  const onTagChange = (e) => { setTag(e.target.value) }
  const onAuthorChange = (e) => { setAuthor(e.target.value) }
  const onImportanceChange = (e) => { setImportance(e.target.value) }
  const onDocIdChange = (e) => {setDocId(e.target.value)}

  const onTextChange = (html) => {
    setTextData(html)
  }

  const [categoryList, setCategoryList] = useState([])
  const [selectedCategoryList, setSelectedCategoryList] = useState([])
  const [localList, setLocalList] = useState([])
  const [selectedLocalList, setSelectedLocalList] = useState([])
  const [countryList, setCountryList] = useState([])
  const [selectedCountryList, setSelectedCountryList] = useState([])

  const [previousCategoryList, setPreviousCategoryList] = useState([])
  const [previousLocalList, setPreviousLocalList] = useState([])
  const [previousCountryList, setPreviousCountryList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      await db.collection("setting").doc("category").get().then((doc) => {
        setCategoryList(doc.data()?.list)
      })
      await db.collection("setting").doc("local").get().then((doc) => {
        setLocalList(doc.data()?.list)
      })
      await db.collection("setting").doc("country").get().then((doc) => {
        setCountryList(doc.data()?.list)
      })
      setIsLoading(false)
    }
    try {
      fetchData()
    } catch (e) {
      alert(`데이터를 불러오지 못했습니다 : ${e.message}`)
    }

  }, [])

  const onSubmitClick = async () => {
    try {
      if (checkInput() && user) {
        const postHashMap = {
          title: title,
          thumbnail: thumbnail,
          createdAt: new Date(),
          author: author,
          uid: user.uid,
          category: selectedCategoryList.toString(),
          local: selectedLocalList.toString(),
          country: selectedCountryList.toString(),
          tag: tag,
          importance: parseInt(importance),
          text: textData
        }
        const thumbnailHashMap = {
          title: title,
          thumbnail: thumbnail,
          createdAt: new Date(),
          author: author,
          uid: user.uid,
          category: selectedCategoryList.toString(),
          local: selectedLocalList.toString(),
          country: selectedCountryList.toString(),
          tag: tag,
        }
        const batch = db.batch();
        previousCategoryList.forEach((category) => {
          if(category!=="")
            batch.delete(db.collection(category).doc(docId))
        })
        if (previousLocalList.length !== 0) {
          previousLocalList.forEach((local) => {
            if(local!=="")
              batch.delete(db.collection(local).doc(docId))
          })
        }
        if (previousCountryList.length !== 0) {
          previousCountryList.forEach((country) => {
            if(country!=="")
              batch.delete(db.collection(country).doc(docId))
          })
        }
        selectedCategoryList.forEach((category) => {
          batch.set(db.collection(category).doc(docId), thumbnailHashMap);
        })
        if (selectedLocalList.length !== 0) {
          selectedLocalList.forEach((local) => {
            if(local!=="")
              batch.set(db.collection(local).doc(docId), thumbnailHashMap)
          })
        }
        if (selectedCountryList.length !== 0) {
          selectedCountryList.forEach((country) => {
            if(country!=="")
              batch.set(db.collection(country).doc(docId), thumbnailHashMap)
          })
        }
        batch.set(db.collection("posts").doc(docId), postHashMap)
        batch.set(db.collection("count").doc(docId), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
        await batch.commit();
        alert("성공적으로 업로드되었습니다!")
        router.push(`/rhksflwk/home`)
      }
    } catch (e) {
      alert(`업로드 실패 : ${e.message}`)
    }
  }

  const onImgChange = async (e) => {
    let img
    if (e.target.files[0] !== undefined) {
      if (checkIsImage(e.target.files[0].name)) {
        if (!checkIsImageSize(e.target.files[0].size))
          img = await compressImage(e.target.files[0])
        else
          img = e.target.files[0]
        const thumbnailUrl = await uploadImage(img, `thumbnails/${Date.now()}`)
        setThumbnail(thumbnailUrl)
      }
    }

  }

  //필수항목 작성 확인
  const checkInput = () => {
    if (title === "") alert("제목은 필수항목입니다.")
    else if (thumbnail==="") alert("썸네일은 필수항목입니다.")
    else if (selectedCategoryList.length===0) alert("적어도 하나의 카테고리를 선택해야합니다.")
    else if (tag=== "") alert("태그는 필수항목입니다.")
    else if (author==="") alert("작성자는 필수항목입니다.")
    else if (isNaN(parseInt(importance)) || parseInt(importance)>5||parseInt(importance)<0) alert("중요도는 0~5 사이여야 합니다.")
    else if (textData===undefined) alert("글은 필수항목입니다.")
    else return true
    return false;
  }

  //업로드한게 이미지가 맞는지 확인
  const checkIsImage = (file) => {
    const pathpoint = file.lastIndexOf('.')
    const filepoint = file.substring(pathpoint+1,file.length)
    const filetype = filepoint.toLowerCase();
    if (filetype == 'jpg' || filetype == 'png' || filetype == 'git' || filetype == 'jpeg' || filetype == 'bmp') {
      return true;
    } else {
      alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")
      return false;
    }
  }

  //이미지의 크기가 2MB이하인지 확인 후, 아니라면 압축할지 물어본뒤 압축진행.
  const checkIsImageSize = (img) => {
    const maxSize = 2 * 1024 * 1024; //2MB
    if (img > maxSize) {
      return false;
    }
    else
      return true
  }

  const onPreviewClick = () => {
  }

  const onSearchClick = () => {
    db.collection("posts").doc(docId).get().then((doc) => {
      if (doc.data()) {
        setTitle(doc.data().title)
        setThumbnail(doc.data().thumbnail)
        setSelectedCategoryList(doc.data().category.split(","))
        setPreviousCategoryList(doc.data().category.split(","))
        if (doc.data().local !== "") {
          setSelectedLocalList(doc.data().local.split(","))
          setPreviousLocalList(doc.data().local.split(","))
        }
        if (doc.data().country !== "") {
          setSelectedCountryList(doc.data().country.split(","))
          setPreviousCountryList(doc.data().country.split(","))
        }
        setTag(doc.data().tag)
        setAuthor(doc.data().author)
        setImportance(doc.data().importance)
        setTextData(doc.data().text)
      } else alert("존재하지 않는 기사 Id 입니다.")
    })
  }

  const onDeleteClick = async () => {
    try {
    const batch = db.batch();
    previousCategoryList.forEach((category) => {
      if(category!=="")
        batch.delete(db.collection(category).doc(docId))
    })
    previousLocalList.forEach((local) => {
      if(local!=="")
        batch.delete(db.collection(local).doc(docId))
    })
    previousCountryList.forEach((country) => {
      if(country!=="")
      batch.delete(db.collection(country).doc(docId))
    })
      batch.delete(db.collection("posts").doc(docId))
      batch.delete(db.collection("count").doc(docId))
      await batch.commit()
      alert("성공적으로 삭제되었습니다!")
      router.push(`/rhksflwk/home`)
    } catch (e) {
      alert(`삭제 실패 : ${e.message}`)
    }
  }
  
  if (isLoading)
    return <Loader />
  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>기사 ID</h4>
        <p className={style.warning}>기사 ID는 기사의 URL을 통해 확인할 수 있습니다.</p>
        <p>기사 ID : <input type="text" value={docId} onChange={onDocIdChange} size="60" required />
          <text className={style.search} onClick={onSearchClick}>조회</text>
        </p>
      </div>
      <div className={style.container}>
        <h4>제목</h4>
        <p className={style.warning}>*필수</p>
        <p>제목 문구 : <input type="text" value={title} onChange={onTitleChange} size="60" required/></p>
      </div>
      <div className={style.container}>
        <h4>썸네일 이미지</h4>
        <p className={style.warning}>*필수 *이미지의 크기가 2MB보다 클 경우 자동으로 압축됩니다.</p>
        <p>이미지 선택 : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*"/></p>
        <img className={style.thumbnail} src={thumbnail}></img>
      </div>
      <div className={style.container}>
        <h4>카테고리 선택</h4>
        <p className={style.warning}>*필수 중복선택가능</p>
        {
          categoryList?.map((data, index) => {
          return (
            <button key={index} onClick={() => {
              !selectedCategoryList.includes(data)
                ? setSelectedCategoryList((selectedCategoryList)=>[...selectedCategoryList, data])
                : setSelectedCategoryList(selectedCategoryList.filter((cate)=>cate!==data))
              }}
              className={
                selectedCategoryList.includes(data) ? `${style.categoryButton} ${style.selected}` : style.categoryButton 
              }
            >
              {data}
            </button>
          )
        })}
      </div>
      <div className={style.container}>
        <h4>지역별</h4>
        <p className={style.warning}>지역 설정시 지역별 페이지에도 기사 추가됨, 중복선택가능</p>
        {
          localList?.map((data, index) => {
          return (
            <button key={index} onClick={() => {
              !selectedLocalList.includes(data)
                ? setSelectedLocalList((selectedLocalList)=>[...selectedLocalList, data])
                : setSelectedLocalList(selectedLocalList.filter((cate)=>cate!==data))
              }}
              className={
                selectedLocalList.includes(data) ? `${style.categoryButton} ${style.selected}` : style.categoryButton 
              }
            >
              {data}
            </button>
          )
        })}
      </div>
      <div className={style.container}>
        <h4>나라별</h4>
        <p className={style.warning}>나라 설정시 나라별 페이지에도 기사 추가됨, 중복선택가능</p>
        {
          countryList?.map((data, index) => {
          return (
            <button key={index} onClick={() => {
              !selectedCountryList.includes(data)
                ? setSelectedCountryList((selectedCountryList)=>[...selectedCountryList, data])
                : setSelectedCountryList(selectedCountryList.filter((cate)=>cate!==data))
              }}
              className={
                selectedCountryList.includes(data) ? `${style.categoryButton} ${style.selected}` : style.categoryButton 
              }
            >
              {data}
            </button>
          )
        })}
      </div>
      <div className={style.container}>
        <h4>태그</h4>
        <p className={style.warning}>*필수 형식 : #태그1 #태그2 #태그3</p>
        <p>기사 태그 : <input type="text" value={tag} onChange={onTagChange} size="100" required/></p>
      </div>
      <div className={style.container}>
        <h4>작성자</h4>
        <p className={style.warning}>*필수</p>
        <p>작성자 : <input type="text" value={author} onChange={onAuthorChange} size="100" required/></p>
      </div>
      <div className={style.container}>
        <h4>중요도</h4>
        <p className={style.warning}>*필수 유저가 설정한 중요도에 따라 알림 전송 0~5, 높을수록 중요함, 중요도 0 : 알림 전송안함</p>
        <p>기사 중요도 : <input type="text" value={importance} onChange={onImportanceChange} size="100" required/></p>
      </div>
      <div className={`${style.container} ${style.quillContainer}`}>
        <Editor docId={docId} handleChange={onTextChange} data={textData} />
        <div onClick={onPreviewClick} className={style.previewButton}>미리보기</div>
      </div>
      <div className={`${style.container} ${style.previewQuillContainer}`}>
        <QuillNoSSRWrapper value={textData||""} readOnly={true} className={style.quill} theme="bubble" />
      </div>
      <div className={style.submitButton} onClick={onSubmitClick}>
        기사 수정
      </div>
      <div className={style.deleteButton} onClick={onDeleteClick}>
        기사 삭제
      </div>
    </div>
  )
}
export default EditArticle;