import React, { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input.jsx";
import Select from "../../UI/Select.jsx";
import Textarea from "../../UI/Textarea.jsx";
import Dropzone from "react-dropzone";
import DropZone from "../../components/dropZone/DropZone.jsx";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/read/"+res.data.id)
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  let div = <>
    <div className="newPostPage">
      <h2>Add New Post</h2>
      <div className="formContainer">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item imageUpload">
              <span className="label">이미지 업로드</span>
              <DropZone/>
            </div>

            <div className="item">
              <Input label="제목" type="text" id="title"/>


              <Select name="property" label="방종류">
                <option value="apartment">아파트</option>
                <option value="house">주택</option>
                <option value="officetel">오피스텔</option>
                <option value="oneroom">원룸</option>
                <option value="tworoom">투룸</option>
                <option value="land">땅</option>
              </Select>


              <Select name="type" label="타입">
                <option value="month" defaultChecked>
                  월세
                </option>
                <option value="year">전세</option>
                <option value="buy">매매</option>
              </Select>


            </div>

            <div className="item description">
              <Textarea onChange={setValue} value={value} label="설명"></Textarea>
              {/*<label htmlFor="desc">Description</label>*/}
              {/*<ReactQuill theme="snow" onChange={setValue} value={value}/>*/}
            </div>


            <div className="item">
              {/*<Input label="도시" id="city" name="city" type="text"/>*/}
              <Input label="면적" min={0} id="size" name="size" type="number"/>
              <Input label="가격" id="price" name="price" type="number"/>
              <Input label="관리비" id="price" name="price" type="number"/>

            </div>

            {/*<Input label="Latitude" id="latitude" name="latitude" type="text"/>*/}


            {/*<Input label="Longitude" id="longitude" name="longitude" type="text"/>*/}

            {/*<label htmlFor="type">Type</label>*/}
            {/*<select name="type">*/}
            {/*  <option value="rent" defaultChecked>*/}
            {/*    Rent*/}
            {/*  </option>*/}
            {/*  <option value="buy">Buy</option>*/}
            {/*</select>*/}

            <div className="item">


              {/*<Select name="utilities" label="Utilities Policy">*/}
              {/*  <option value="owner">Owner is responsible</option>*/}
              {/*  <option value="tenant">Tenant is responsible</option>*/}
              {/*  <option value="shared">Shared</option>*/}
              {/*</Select>*/}


              <Input min={1} id="bedroom" name="bedroom" type="number" label="방 수"/>
              <Input label="화장실 수" min={1} id="bathroom" name="bathroom" type="number"/>
              <Select name="pet" label="애완동물 입주 가능">
                <option value="allowed">가능</option>
                <option value="not-allowed">불가능</option>
              </Select>

            </div>
            {/*<Input*/}
            {/*    label="옵션"*/}
            {/*    id="income"*/}
            {/*    name="income"*/}
            {/*    type="text"*/}
            {/*/>*/}

            <div className="item">
              <Select name="pet" label="옵션">
                <option value="allowed">신발장</option>
                <option value="not-allowed">샤워부스</option>
                <option value="not-allowed">가스레인지</option>
                <option value="not-allowed">붙박이장</option>
                <option value="not-allowed">화재경보기</option>
                <option value="not-allowed">베란다</option>
              </Select>

              <Select name="pet" label="보안/안전시설">
                <option value="allowed">경비원</option>
                <option value="not-allowed">비디오폰</option>
                <option value="not-allowed">인터폰</option>
                <option value="not-allowed">카드키</option>
                <option value="not-allowed">CCTV</option>
                <option value="not-allowed">현관보안</option>
                <option value="not-allowed">방범창</option>
              </Select>

              <Input label="주차" id="address" name="address" type="text"/>

            </div>

            <div className="item">
              <Input label="학교" min={0} id="school" name="school" type="number"/>
              <Input label="대중교통(버스, 지하철)" min={0} id="bus" name="bus" type="number"/>
              <Input label="방향" min={0} id="restaurant" name="restaurant" type="number"/>
            </div>


            {/*<button className="sendButton">Add</button>*/}
            {/*{error && <span>error</span>}*/}


            {/*<div className="item">*/}
            {/*  {images.map((image, index) => (*/}
            {/*      <img src={image} key={index} alt="image"/>*/}
            {/*  ))}*/}
            {/*  <UploadWidget*/}
            {/*      uwConfig={{*/}
            {/*        multiple: true,*/}
            {/*        cloudName: process.env.VITE_CLOUD_NAME,*/}
            {/*        uploadPreset: "estate",*/}
            {/*        folder: "posts",*/}
            {/*      }}*/}
            {/*      setState={setImages}*/}
            {/*  />*/}
            {/*</div>`*/}


          </form>
        </div>
      </div>
    </div>
  </>;
  return div;
}

export default NewPostPage;
