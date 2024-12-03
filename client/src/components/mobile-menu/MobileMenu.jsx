import React from "react";
import "./mobileMenu.scss";

function MobileMenu({isHidden})  {

    const menuItem = [
        {title: '검색', icon: `search`, navigate: ''},
        {title: '위시리스트', icon: 'favorite'},
        {title: '포스팅', icon: 'add'},
        {title: '메시지', icon: 'chat_bubble'},
        {title: '프로필', icon: 'account_circle'},
    ];

    return (
        <div className={`mobile-menu ${isHidden ? "mobile-menu--hidden" : ""}`}>
            {
                menuItem.map((c, idx) => <div key={idx} className="mobile-menu__item">
                    <span className="mobile-menu__icon material-symbols-outlined">{c.icon}</span>
                    <span className="mobile-menu__title">{c.title}</span>
                </div>)

            }
        </div>
    );
}

export default MobileMenu;