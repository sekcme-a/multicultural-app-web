  export const adminMenuItems = [
    {type: "main", title:"기사 관리", child: true, icon: "ModeIcon", level:"admin",},
    {type: "sub", title:"기사 관리", child: false, subtitle: "기사 등록", path: "/newArticle", level:"admin",},
    { type: "sub", title: "기사 관리", child: false, subtitle: "기사 편집", path: "/editArticle", level: "admin", },
    {type: "main", title:"페이지 관리", child: true, icon: "TagIcon", level:"admin",},
    {type: "sub", title:"페이지 관리", child: false, subtitle: "카테고리 편집", path: "/category", level:"admin",},
    {type: "sub", title:"페이지 관리", child: false, subtitle: "지역별 편집", path: "/local", level:"admin",},
    {type: "sub", title:"페이지 관리", child: false, subtitle: "나라별 편집", path: "/country", level:"admin",},
  ]