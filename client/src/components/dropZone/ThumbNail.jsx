import React, {useState} from 'react';
import "./thumnail.scss";

function ThumbNail({file,deleteImage}) {
    const [isHover, setIsHover] = useState(false);

    return (
        <div className="thumnailElement" onMouseEnter={()=> {setIsHover(true)}} onMouseLeave={()=> { setIsHover(false)}} >
            <div onClick={()=>deleteImage(file)} className={isHover ? "delete visible" : "delete"}>
                삭제
            </div>
            <span>
             <img src={file.preview || file} alt="image" />
            </span>
        </div>
    );
}

export default ThumbNail;