  export const adminMenuItems = [
    {type: "main", title:"기사 관리", child: true, icon: "ModeIcon", level:"admin",},
    {type: "sub", title:"기사 관리", child: false, subtitle: "기사 등록", path: "/newArticle", level:"admin",},
    { type: "sub", title: "기사 관리", child: false, subtitle: "기사 편집", path: "/editArticle", level: "admin", },
    { type: "sub", title: "기사 관리", child: false, subtitle: "주요 기사 관리", path: "/recommand", level: "admin", },
    {type: "main", title:"페이지 관리", child: true, icon: "TagIcon", level:"admin",},
    {type: "sub", title:"페이지 관리", child: false, subtitle: "카테고리 편집", path: "/category", level:"admin",},
    {type: "sub", title:"페이지 관리", child: false, subtitle: "지역별 편집", path: "/local", level:"admin",},
    { type: "sub", title: "페이지 관리", child: false, subtitle: "나라별 편집", path: "/country", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "앱정보 편집", path: "/appInfo", level: "admin", },
    {type: "main", title:"공지사항 관리", child: true, icon: "CampaignIcon", level:"admin",},
    {type: "sub", title:"공지사항 관리", child: false, subtitle: "공지사항 추가", path: "/newAnnouncement", level:"admin",},
    {type: "sub", title:"공지사항 관리", child: false, subtitle: "공지사항 편집", path: "/editAnnouncement", level:"admin",},
  ]