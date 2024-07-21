import {Link, useLoaderData, useNavigate} from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest.js";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {savedPostStore} from "../../lib/savedPostStore.js";
import {currencyFormatter} from "../../util/formatting.js";

function Card({ card }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(card.isSaved);
  const save = savedPostStore((state) => state.save);
  const savePostsFetch = savedPostStore((state) => state.fetch);
  const setCurrentSavedPost = savedPostStore((state) => state.setCurrentSavedPost);

  useEffect(() => {
    setSaved(card.isSaved);
  }, [card]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await save(card._id.$oid);// await apiRequest.post("/users/save", { postId: item.id });
      setCurrentSavedPost(card);
      await savePostsFetch();

    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  if(!card) return (<div>빈칸입니다.</div>);

  return (
      <div className="card">
        <Link to={`/read/${card._id.$oid}`} className="imageContainer">
          <img src={card.images[0]} alt="image"/>
        </Link>
        <div className="textContainer">
          <h2 className="title">
            <Link to={`/read/${card._id.$oid}`}>{card.title}</Link>
          </h2>
          <p className="address">
            <img src="/pin.png" alt="pin"/>
            <span>{card.address}</span>
          </p>
          <p className="price">{currencyFormatter.format(card.price)}</p>
          <div className="bottom">
            <div className="features">
              <div className="feature">
                <img src="/bed.png" alt="bed"/>
                <span>{card.bedroom} bedroom</span>
              </div>
              <div className="feature">
                <img src="/bath.png" alt="bath"/>
                <span>{card.bathroom} bathroom</span>
              </div>
            </div>
            <div className="icons">
              <div className="icon" style={{
                backgroundColor: saved ? "#fece51" : "white",
              }} onClick={handleSave}>
                <img src="/save.png" alt="save"/>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Card;
