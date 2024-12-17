import React from "react";
import "./profile.scss";

const Profile = ({receiver, isOnline}) => {

    return (<div className="chatProfile">
        <div className="chatProfile__header">
            <img src={receiver.avatar || "/noavatar.jpg"} alt="avatar" className="chatProfile__avatar"/>
            <span className={`chatProfile__status${isOnline ? ' chatProfile__status--online' : ' chatProfile__status--offline'}`}></span>
        </div>
        <div className="chatProfile__username">
            {receiver.username}
        </div>
    </div>);

}
export default Profile;