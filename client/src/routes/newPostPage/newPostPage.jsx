import React, {useCallback, useContext, useEffect, useState} from "react";
import "./newPostPage.scss";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import {useNavigate} from "react-router-dom";
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

export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUD_NAME}/upload`;

function NewPostPage() {
  const {progress, setProgress, location, clearLocation, changeDisabled} = useContext(UserProgressContext);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: "",
    property: roomOption[0].value,
    type: typeOption[0].value,
    desc: "",
    size: "",
    price: "",
    maintenance: "",
    bedroom: "",
    bathroom: "",
    pet: "",
    option: [],
    safeOption: [],
    parking: "",
    school: "",
    bus: "",
    direction: "",
  });

  // 모든 입력값 검증
  useEffect(() => {
    const allFieldsFilled = Object.entries(inputs).every(([key, value]) => {
      if (Array.isArray(value)) {
        // 배열의 경우: 하나 이상의 요소가 있어야 함
        return value.length > 0;
      } else {
        // 그 외 (문자열, 숫자 등): 비어있지 않아야 함
        return value !== "" && value !== null && value !== undefined;
      }

    });

    //사진 첨부 했는지
    const isFileAttached = files.length > 0;

    //위치 가져왔는지
    const isLocation = location.lat && location.lng;

    // 모든 값이 채워지면 버튼 활성화
    if (allFieldsFilled && isLocation && isFileAttached) {
      changeDisabled(false);
    } else {
      changeDisabled(true);
    }

  }, [inputs, files, location]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(async (e) => {

    //계속 누르면 계속 올라감
    e.preventDefault();

    // 이미 제출 중이면 함수 종료
    if(progress.disabled) return;

    changeDisabled(true);

    let imageUrl = [];

    try {

      if (files.length < 1) {
        toast.error('이미지 한 개 이상을 첨부해야 합니다.');
        return;
      }

      // 최대 파일 크기: 10MB
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes (10485760 bytes)

      for(const file of files) {
        if(file.size > MAX_FILE_SIZE) {
          toast.error('이미지 크기가 너무 큽니다.');
          return;
        }
      }

      //files들을 CLOUDINARY에 post한다.
      //문제발생: files.map(async file => { 이렇게 해서 post를 각각했는데, map 루프 돌때 await가 순서대로 안된다-
      // 해결 1.  for ..of 으로 순차처리 -> OK
      // 해결 2. Promise all 사용 (병렬적o)
      // //promise.all로 콜백 함수에서 반환하는 값들을 배열에 넣어놓고, 비동기 처리가 끝나는 타이밍 감지
      // const responseArray = await Promise.all(response);
      // 최종 해결 3. 해결 2번 정리한 방법

      //최종 해결 3.
      const response = await Promise.all(
          files.map(async (file) => {
            try {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('upload_preset', 'estate');

              const config = {
                header: { 'content-Type': 'multipart/form-data' },
              };

              const res = await axios.post(CLOUDINARY_URL, formData, config);
              return res.data.secure_url; // 성공한 경우 secure_url 반환
            } catch (error) {
              console.error('이미지 업로드 실패:', error);
              toast.error('일부 이미지 업로드에 실패했습니다.');
              return null; // 실패한 경우 null 반환
            }
          })
      );
      // 결과
      // response = [
      //   "https://.../img1.png",  // 성공
      //   null,                    // 실패
      //   "https://.../img3.png",  // 성공
      //   null,                    // 실패
      //   "https://.../img5.png"   // 성공
      // ];


      // 성공한 이미지 URL만 필터링
      imageUrl = [...imageUrl, ...response.filter(url => url !== null)];
      //해결 2 Promise all 사용 (병렬적o)
      // const response = files.map((file) => {
      //   const formData = new FormData();
      //   const config = {
      //     header: {
      //       'content-Type': 'multipart/form-data',
      //     }
      //   }
      //   formData.append('file', file);
      //   formData.append('upload_preset', 'estate');
      //
      //   return axios.post(CLOUDINARY_URL, formData, config);
      //
      // });
      //
      // //promise.all로 콜백 함수에서 반환하는 값들을 배열에 넣어놓고, 비동기 처리가 끝나는 타이밍 감지
      // const responseArray = await Promise.all(response);
      //
      // responseArray.map((res) => {
      //   imageUrl = [...imageUrl, res.data.secure_url];
      // });

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
      //   // setImageUrl((prev) => [...prev, res.data.secure_url]);
      //   imageUrl = [...imageUrl, res.data.secure_url];
      // });


      // setPost(inputs); // await imageUpload();

      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          property: inputs.property,
          type: inputs.type,
          price: Number(inputs.price),
          address: location.address,
          politicalList: location.politicalList,
          bedroom: Number(inputs.bedroom),
          bathroom: Number(inputs.bathroom),
          latitude: location.lat.toString(),
          longitude: location.lng.toString(),
          images: imageUrl,
          size: Number(inputs.size),
          maintenance: Number(inputs.maintenance),
        },
        postDetail: {
          desc: inputs.desc,
          pet: inputs.pet,
          option: inputs.option.map((data) => data.value),
          safeOption: inputs.safeOption.map((data) => data.value),
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
      changeDisabled(true);//제출버튼 비활성화

    }
  }, [files, progress.disabled]);


  useEffect(() => {

    if(!location.address ||!location.lat || !location.lng) {
      //이 전 페이지로 이동
      navigate("/location");
    }
    setProgress('save');
    changeDisabled(true); //제출 버튼 비활성화
  }, []);

  const div = <>
    <div className="newPostPage">
      <div className="post_title">정보를 상세하게 입력해주세요.</div>
      <div className="post_location">
        <span className="material-symbols-outlined">pin_drop</span>
        <span>{location.address}</span>
      </div>

      <div className="formContainer">
        <div className="wrapper">
          <form id="estate-post-form" onSubmit={handleSubmit}>
            <div className="item">
              <Input label="제목" type="text" id="title" name="title" onChange={handleInputChange}/>
              <Selection id="property" name="property" label="방종류" options={roomOption} defaultValue={roomOption[0]}
                         onChange={(e) =>
                             setInputs((prev) => ({
                               ...prev,
                               property: e.value,
                             }))}
              />
              <Selection id="type" name="type" label="타입" options={typeOption} defaultValue={typeOption[0]}
                         onChange={(e) =>
                             setInputs((prev) => ({
                               ...prev,
                               type: e.value,
                             }))}
              />
            </div>

            <div className="item description">
              <Textarea label="설명" id="desc" name="desc" onChange={handleInputChange}></Textarea>
            </div>

            <div className="item">
              <Input label="면적(평)" min={0} id="size" name="size" type="number" onChange={handleInputChange}/>
              <Input label="가격" id="price" name="price" type="number" onChange={handleInputChange}/>
              <Input label="관리비" id="maintenance" name="maintenance" type="number" onChange={handleInputChange}/>
            </div>

            <div className="item">
              <Input label="방 수" min={1} id="bedroom" name="bedroom" type="number" onChange={handleInputChange}/>
              <Input label="화장실 수" min={1} id="bathroom" name="bathroom" type="number" onChange={handleInputChange}/>
              <Selection name="pet" id="pet" label="애완동물 입주 가능" options={petOption}
                         onChange={(e) =>
                             setInputs((prev) => ({
                               ...prev,
                               pet: e.value,
                             }))}
              />
            </div>

            <div className="item">
              <Selection
                  isMulti
                  id="option"
                  name="option"
                  label="옵션"
                  options={options}
                  onChange={(e) => {
                    setInputs((prev) => ({
                      ...prev,
                      option: e,
                    }));
                  }}
              />
              <Selection
                  isMulti
                  id="safeOption"
                  name="safeOption"
                  label="보안/안전시설"
                  options={safeOptions}
                  onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        safeOption: e,
                      }))}
              />
              <Input label="주차" id="parking" min={0} name="parking" type="number" onChange={handleInputChange}/>
            </div>

            <div className="item">
              <Input label="학교" min={0} id="school" name="school" type="number" onChange={handleInputChange}/>
              <Input label="대중교통(버스, 지하철)" min={0} id="bus" name="bus" type="number" onChange={handleInputChange}/>
              <Input label="방향" id="direction" name="direction" type="text" onChange={handleInputChange}/>
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
