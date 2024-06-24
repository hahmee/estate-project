import {Link, useLoaderData, useNavigate} from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest.js";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {savedPostStore} from "../../lib/savedPostStore.js";

function Card({ card, savedList }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(card.isSaved);
  const [item, setItem] = useState(card);
  const save = savedPostStore((state) => state.save);
  const fetch = savedPostStore((state) => state.fetch);

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
      await save(item.id);// await apiRequest.post("/users/save", { postId: item.id });
      await fetch();
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  return (
      <div className="card">
        <Link to={`/read/${item.id}`} className="imageContainer">
          <img src={item.images[0]} alt="image"/>
        </Link>
        <div className="textContainer">
          <h2 className="title">
          <Link to={`/read/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="pin" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="bed" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="bath" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon"  style={{
              backgroundColor: saved ? "#fece51" : "white",
            }} onClick={handleSave}>
              <img src="/save.png" alt="save" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
