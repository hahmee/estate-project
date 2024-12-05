import React from "react";
import "./profile.scss";

const Profile = ({receiver, isOnline}) => {

    return <div className="profile">
        <div className="profile__header">
            <img
                src={
                    receiver.avatar || "/noavatar.jpg"
                }
                alt="avatar"
                className="profile__avatar"
            />
            <span className={`profile__status${isOnline ? ' --online' : ' --offline'}`}>
                                    {isOnline ? "온라인" : "오프라인"}
                                </span>
        </div>
        <div className="profile__username">
            {receiver.username}
        </div>
    </div>;
}
export default Profile;