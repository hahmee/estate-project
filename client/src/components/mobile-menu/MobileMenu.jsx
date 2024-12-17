import React from "react";
import "./mobileMenu.scss";
import {useNavigate} from "react-router-dom";

function MobileMenu({isHidden})  {
    const navigate = useNavigate();

    const menuItem = [
        {title: '검색', icon: `search`, url: '/'},
        {title: '위시리스트', icon: 'favorite',url:'/wish'},
        {title: '포스팅', icon: 'add',url:'/location'},
        {title: '메시지', icon: 'chat_bubble',url:'/messages'},
        {title: '프로필', icon: 'account_circle',url:'profile'},
    ];

    return (
        <div className={`mobile-menu ${isHidden ? "mobile-menu--hidden" : ""}`}>
            {
                menuItem.map((c, idx) => <div key={idx} className="mobile-menu__item" onClick={()=>navigate(c.url)}>
                    <span className="mobile-menu__icon material-symbols-outlined">{c.icon}</span>
                    <span className="mobile-menu__title">{c.title}</span>
                </div>)
            }
        </div>
    );
}

export default MobileMenu;