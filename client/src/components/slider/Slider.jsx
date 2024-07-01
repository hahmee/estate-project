import { useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="slider">


      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow" onClick={() => changeSlide("left")}>
            <img src="/arrow.png" alt="arrow" />
          </div>
          <div className="imgContainer">
            <img src={images[imageIndex]} alt="image" />
          </div>
          <div className="arrow" onClick={() => changeSlide("right")}>
            <img src="/arrow.png" className="right" alt="arrow" />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigImage">
        {/*<img src={images[0]} alt="image" onClick={() => setImageIndex(0)} />*/}
        <img src="https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="image" onClick={() => setImageIndex(0)}/>
      </div>
      <div className="smallImages">
        <img
            src="https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>
        <img
            src="https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>

        <img
            src="https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>

        <img
            src="https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"/>

      </div>
      {/*  /!*{images.slice(1).map((image, index) => (*!/*/}
      {/*  /!*  <img*!/*/}
      {/*  /!*    src={image}*!/*/}
      {/*  /!*    alt="image"*!/*/}
      {/*  /!*    key={index}*!/*/}
      {/*  /!*    onClick={() => setImageIndex(index + 1)}*!/*/}
      {/*  /!*  />*!/*/}
      {/*  /!*))}*!/*/}
      {/*</div>*/}
    </div>
  );
}

export default Slider;
