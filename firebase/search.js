import { firestore as db } from "firebase/firebase"

export const searchFor = async (collectionName, field, input, maxResultCount) => {
  return new Promise(async function (resolve, reject) {
    let temp = []
    try {
      await db.collection(collectionName).where(field, 'array-contains', input).limit(maxResultCount).get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          temp.push({
            id: doc.id,
            title: doc.data().title,
            thumbnail: doc.data().thumbnail,
            tag: doc.data().tag,
            category: doc.data().category,
            author: doc.data().author,
          })
        })
      })
      resolve(temp)
    } catch (e) {
      reject(new Error(e.message))
    }
  })
}