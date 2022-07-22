import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import useBookmarkLike from 'src/hook/bookmarkLike';
import useAuth from 'src/hook/auth';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


export default function ControlledOpenSpeedDial(props) {
  const [open, setOpen] = useState(false);
  const { bookmarkList, isBookmarked, deleteBookmark ,pushBookmark } = useBookmarkLike()
  const { user } = useAuth()
  const [actions, setActions] = useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    const noBookmarkNoLike = [
    { icon: <ThumbUpOutlinedIcon />, name: 'like' },
    { icon: <BookmarkBorderIcon />, name: 'bookmark' },
    {icon: <PictureAsPdfIcon />, name: 'pdf'},
    { icon: <ShareIcon />, name: 'share' },
    ];
    const yesBookmarkNoLike = [
      { icon: <ThumbUpOutlinedIcon />, name: 'like' },
      { icon: <BookmarkIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'bookmark' },
      {icon: <PictureAsPdfIcon />, name: 'pdf'},
      { icon: <ShareIcon />, name: 'share' },
    ]
    const noBookmarkYesLike = [
      { icon: <ThumbUpIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'like' },
      { icon: <BookmarkBorderIcon />, name: 'bookmark' },
      {icon: <PictureAsPdfIcon />, name: 'pdf'},
      { icon: <ShareIcon />, name: 'share' },
    ]
    const yesBookmarkYesLike = [
      { icon: <ThumbUpIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'like' },
      { icon: <BookmarkIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'bookmark' },
      {icon: <PictureAsPdfIcon />, name: 'pdf'},
      { icon: <ShareIcon />, name: 'share' },
    ]
    if(!isBookmarked(props.id) && true)
      setActions(noBookmarkNoLike)
    else if(isBookmarked(props.id)&& true)
      setActions(yesBookmarkNoLike)
    else if(!isBookmarked(props.id)&&true)
      setActions(noBookmarkYesLike)
    else
      setActions(yesBookmarkYesLike)
  },[bookmarkList.length])
  const handleClick = (name) => {
    if (name==="share") {
      props.handleShowBackdrop(true)
    } else if (name === "pdf") {
      props.downloadPdf()
    } else if (name === "bookmark") {
      console.log(isBookmarked(props.id))
      if (isBookmarked(props.id))
        deleteBookmark(user.uid, props.id)
      else
        pushBookmark(user.uid, props.id)
    }
    setOpen(false)
  }

  return (
    // <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, zIndex: 999999999999 }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'fixed', bottom: 70, right: 10}}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        zindex="999999999999"
      >
      {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={()=>handleClick(action.name)}
            />
        ))}
      </SpeedDial>
    // </Box>
  );
}
