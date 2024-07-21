import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import "./newPostPage.scss";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input.jsx";
import Textarea from "../../UI/Textarea.jsx";
import DropZone from "../../components/dropZone/DropZone.jsx";
import Selection from "../../UI/Selection.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

export const options = [
  {value: 'shoe', label: '신발장', img: '/bath.png' },
  {value: 'shower_booth', label: '샤워부스', img: '/bath.png'  },
  {value: 'stove', label: '가스레인지', img: '/bath.png' },
  {value: 'closet', label: '붙박이장' , img: '/bath.png'},
  {value: 'fire_alarm', label: '화재경보기' , img: '/bath.png'},
  {value: 'veranda', label: '베란다', img: '/bath.png' },
];

export const safeOptions = [
  {value: 'guard', label: '경비원', img: '/bath.png'},
  {value: 'video_phone', label: '비디오폰', img: '/bath.png'},
  {value: 'intercom', label: '인터폰', img: '/bath.png'},
  {value: 'card_key', label: '카드키', img: '/bath.png'},
  {value: 'cctv', label: 'CCTV', img: '/bath.png'},
  {value: 'safety_door', label: '현관보안', img: '/bath.png'},
  {value: 'window_guard', label: '방범창', img: '/bath.png'},
];

export const petOption = [
  {value: 'yes', label: '가능'},
  {value: 'no', label: '불가능'},
];

export const roomOption = [
  {value: 'apartment', label: '아파트'},
  {value: 'condo', label: '주택'},
  {value: 'officetel', label: '오피스텔'},
  {value: 'one_room', label: '원룸'},
  {value: 'two_room', label: '투룸'},
  {value: 'land', label: '땅'},
];

export const typeOption = [
  {value: 'month_pay', label: '월세'},
  {value: 'year_pay', label: '전세'},
  {value: 'sell', label: '매매'},
];

export const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUD_NAME}/upload`;

function NewPostPage() {
  const {progress, setProgress, location, clearLocation} = useContext(UserProgressContext);
  const [files, setFiles] = useState([]);


  const navigate = useNavigate();
  const [safeOptionsValue, setSafeOptionsValue] = useState([]);
  const [optionsValue, setOptionsValue] = useState([]);


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setProgress('',{...progress, loading: true});
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    let imageUrl = [];
    const optionList = optionsValue.map(value => value.value);
    const safeOptionList = safeOptionsValue.map(value => value.value);

    try {

      if (files.length < 1) {
        toast.error('이미지 한 개 이상을 첨부해야 합니다.');
        return;
        // throw new Error('이미지 한 개 이상을 첨부해야 합니다.');
      }

      //해결 2 Promise all 사용 (병렬적o)
      const response = files.map((file) => {
        const formData = new FormData();
        const config = {
          header: {
            'content-Type': 'multipart/form-data',
          }
        }
        formData.append('file', file);
        formData.append('upload_preset', 'estate');

        return axios.post(cloudinaryUrl, formData, config);

      });

      //promise.all로 콜백 함수에서 반환하는 값들을 배열에 넣어놓고, 비동기 처리가 끝나는 타이밍 감지
      const responseArray = await Promise.all(response);
      console.log('responseArray', responseArray);

      responseArray.map((res) => {
        imageUrl = [...imageUrl, res.data.secure_url];
      });

      //해결 1 (순차적o, 병렬적 x)
      // for (let file of files) {
      //
      //   const formData = new FormData();
      //   const config = {
      //     header: {
      //       'content-Type': 'multipart/form-data',
      //     }
      //   }
      //   formData.append('file', file);
      //   formData.append('upload_preset', 'estate');
      //
      //   //문제해결 : 문제 =  map에서 await가 안되는게 문제였음 -> 순차처리 되는 for ..of로 바꿈
      //   const res = await axios.post(cloudinaryUrl, formData, config);
      //   console.log('res', res.data.secure_url);
      //   imageUrl = [...imageUrl, res.data.secure_url];
      //
      // }

      //문제 발생 =  map에서 await가 안되는게 문제였음
      // files.map(async file => {
      //   const formData = new FormData();
      //   const config = {
      //     header: {
      //       'content-Type': 'multipart/form-data',
      //     }
      //   }
      //   formData.append('file', file);
      //   formData.append('upload_preset', 'estate');
      //
      //   const res = await axios.post(cloudinaryUrl, formData, config);
      //   console.log('res', res.data.secure_url);
      //   // setImageUrl((prev) => [...prev, res.data.secure_url]);
      //   imageUrl = [...imageUrl, res.data.secure_url];
      // });


      console.log('imageUrl', imageUrl);

      // setPost(inputs); // await imageUpload();

      console.log('location.city', location);
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          property: inputs.property,
          type: inputs.type,
          price: Number(inputs.price),
          address: location.address,
          city: location.city,
          bedroom: Number(inputs.bedroom),
          bathroom: Number(inputs.bathroom),
          latitude: location.lat.toString(),
          longitude: location.lng.toString(),
          // coordinates: [location.lat, location.lng],
          images: imageUrl,
          size: Number(inputs.size),
          maintenance: Number(inputs.maintenance),
        },
        postDetail: {
          desc: inputs.description,
          pet: inputs.pet,
          option: optionList,
          safeOption: safeOptionList,
          school: Number(inputs.school),
          bus: Number(inputs.bus),
          direction: inputs.direction,
          parking: Number(inputs.parking),
        },
      });
      toast.success('성공적으로 저장되었습니다.');
      navigate("/read/" + res.data.id);
      clearLocation();

    } catch (err) {
      toast.error(err.response.data.message);

    } finally {
      setProgress('', {...progress, loading: false});
    }
  }, [files, optionsValue, safeOptionsValue]);


  useEffect(() => {
    console.log('location', location);
    setProgress('save');
  }, []);

  const div = <>
    <div className="newPostPage">
      <h2>정보를 상세하게 입력해주세요.</h2>
      <div className="formContainer">
        <div className="wrapper">
          <form id="estate-post-form" onSubmit={handleSubmit}>
            <div className="item">
              <Input label="제목" type="text" id="title" name="title"/>
              <Selection id="property" name="property" label="방종류" options={roomOption} defaultValue={roomOption[0]}/>
              <Selection id="type" name="type" label="타입" options={typeOption} defaultValue={typeOption[0]}/>
            </div>

            <div className="item description">
              <Textarea label="설명" id="description" name="description"></Textarea>
            </div>

            <div className="item">
              <Input label="면적" min={0} id="size" name="size" type="number"/>
              <Input label="가격" id="price" name="price" type="number"/>
              <Input label="관리비" id="maintenance" name="maintenance" type="number"/>
            </div>

            <div className="item">
              <Input label="방 수" min={1} id="bedroom" name="bedroom" type="number"/>
              <Input label="화장실 수" min={1} id="bathroom" name="bathroom" type="number"/>
              <Selection name="pet" id="pet" label="애완동물 입주 가능" options={petOption}/>
            </div>

            <div className="item">
              <Selection
                  isMulti
                  id="option"
                  name="option"
                  label="옵션"
                  options={options}
                  onChange={(e) => setOptionsValue(e)}
              />
              <Selection
                  isMulti
                  id="safeOption"
                  name="safeOption"
                  label="보안/안전시설"
                  options={safeOptions}
                  onChange={(e) => setSafeOptionsValue(e)}
              />
              <Input label="주차" id="parking" min={0} name="parking" type="number"/>
            </div>

            <div className="item">
              <Input label="학교" min={0} id="school" name="school" type="number"/>
              <Input label="대중교통(버스, 지하철)" min={0} id="bus" name="bus" type="number"/>
              <Input label="방향" id="direction" name="direction" type="text"/>
            </div>

            <div className="item imageUpload">
              <span className="label">이미지 업로드</span>
              <DropZone files={files} setFiles={setFiles} multiple={true}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;

  return div;
}

export default NewPostPage;
