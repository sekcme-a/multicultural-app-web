import React, { useState, useEffect } from "react"


const Button = () => {
  const arr = [
    { id: 1, name: "1번입니다." },
    { id: 2, name: "2번입니다." },
    { id: 3, name: "3번입니다." },
  ];
  const [pick, setPick] = useState(arr);
  const [select, setSelect] = useState([]);

  useEffect(() => {
    console.log(select)
  },[select])

  return pick.map((item) => (
    <div className="button_container" key={item.id}>
      <p>id:{item.id}</p>
      <button
        onClick={() => {
          !select.includes(item.id)
            ? setSelect((select) => [...select, item.id])
            : setSelect(select.filter((asdf) => asdf !== item.id));
        }}
        className={
          select.includes(item) ? "button table_btn_s" : "button table_btn_ns"
        }
      >
        선택
      </button>
    </div>
  ));

}
export default Button