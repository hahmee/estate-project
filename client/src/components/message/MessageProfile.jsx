import React from 'react';
import "./message.scss";

function MessageProfile({profile}) {
    return (
        <div>
            <div className="top">
                <div className="user">
                    <img src={profile.avatar || "/noavatar.jpg"} alt="noavatar"/>
                    {profile.username}
                </div>

            </div>

        </div>
    );
}

export default MessageProfile;