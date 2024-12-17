import React, {useCallback, useContext, useEffect, useState} from 'react';
import "./updatePage.scss";
import Input from "../../UI/Input.jsx";
import Selection from "../../UI/Selection.jsx";
import Textarea from "../../UI/Textarea.jsx";
import DropZone from "../../components/dropZone/DropZone.jsx";
import {CLOUDINARY_URL, options, petOption, roomOption, safeOptions, typeOption} from "../newPostPage/newPostPage.jsx";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import apiRequest from "../../lib/apiRequest.js";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import {toast} from "react-toastify";

function UpdatePage() {
    const post = useLoaderData().postResponse.data;
    const [files, setFiles] = useState([]);
    const [defaultImage, setDefaultImage] = useState(post.images);
    const navigate = useNavigate();
    const {progress, setProgress, saveLocation, changeDisabled} = useContext(UserProgressContext);
    const { id } = useParams();
    const [inputs, setInputs] = useState({
        title: post.title,
        property: post.property,
        type: post.type,
        desc: post.postDetail.desc,
        size: post.size,
        price: post.price,
        maintenance: post.maintenance,
        bedroom: post.bedroom,
        bathroom: post.bathroom,
        pet: post.postDetail.pet,
        option: options.filter(option => post.postDetail.option.includes(option.value)),
        safeOption: safeOptions.filter(option => post.postDetail.safeOption.includes(option.value)),
        parking: post.postDetail.parking,
        school: post.postDetail.school,
        bus: post.postDetail.bus,
        direction: post.postDetail.direction,
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
        const isFileAttached = defaultImage.length + files.length > 0;

        // 모든 값이 채워지면 버튼 활성화
        if (allFieldsFilled && isFileAttached) {
            changeDisabled(false);
        } else {
            changeDisabled(true);
        }

    }, [inputs, files]);

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setProgress('', {...progress, loading: true});

        let imageUrl = [...defaultImage];

        try {
            //defaultImage에서 삭제된 것들 cloud에서 지우기
            // cloudinary.v2.uploader.destroy(public_id, options).then(callback);

            if (imageUrl.length + files.length < 1) {
                toast.error('이미지 한 개 이상을 첨부해야 합니다.');
                return;
            }

            //해결 2 Promise all 사용 (병렬적o)
            const response = files?.map((file) => {
                const formData = new FormData();
                const config = {
                    header: {
                        'content-Type': 'multipart/form-data',
                    }
                }
                formData.append('file', file);
                formData.append('upload_preset', 'estate');

                return axios.post(CLOUDINARY_URL, formData, config);

            });

            //promise.all로 콜백 함수에서 반환하는 값들을 배열에 넣어놓고, 비동기 처리가 끝나는 타이밍 감지
            const responseArray = await Promise.all(response);

            responseArray.map((res) => {
                imageUrl = [...imageUrl, res.data.secure_url];
            });

            const res = await apiRequest.put("/posts/" + id, {
                postData: {
                    title: inputs.title,
                    property: inputs.property,
                    type: inputs.type,
                    price: Number(inputs.price),
                    // address: location.address, 수정필요x
                    // politicalList: location.politicalList,수정필요x
                    bedroom: Number(inputs.bedroom),
                    bathroom: Number(inputs.bathroom),
                    // latitude: location.lat.toString(),
                    // longitude: location.lng.toString(),
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
            toast.success('성공적으로 수정되었습니다.');
            navigate("/read/" + res.data);

        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            setProgress('', {...progress, loading: false});
            changeDisabled(true);//제출버튼 비활성화
        }
    }, [files, defaultImage, inputs]);

    useEffect(() => {
        setProgress('save');

        //버튼 활성화
        changeDisabled(false);

        saveLocation({
            latitude: post.latitude,
            longitude: post.longitude,
            politicalList: post.politicalList,
            address: post.address,
        });

    }, []);

    const div = <>
        <div className="newPostPage">
            <div className="post_title">수정해주세요.</div>
            <div className="post_location">
                <span className="material-symbols-outlined">pin_drop</span>
                <span>{post.address}</span>
            </div>
            <div className="formContainer">
                <div className="wrapper">
                    <form id="estate-post-form" onSubmit={handleSubmit}>
                        <div className="item">
                            <Input label="제목" type="text" id="title" name="title" defaultValue={inputs.title} onChange={handleInputChange}/>
                            <Selection id="property" name="property" label="방종류" options={roomOption}
                                       onChange={(e) =>
                                           setInputs((prev) => ({
                                               ...prev,
                                               property: e.value,
                                           }))}
                                       defaultValue={roomOption.find((option) => option.value === inputs.property)}/>
                            <Selection id="type" name="type" label="타입" options={typeOption}
                                       defaultValue={typeOption.find(option => option.value === inputs.type)}
                                       onChange={(e) =>
                                           setInputs((prev) => ({
                                               ...prev,
                                               type: e.value,
                                           }))}
                            />
                        </div>

                        <div className="item description">
                            <Textarea label="설명" id="desc" name="desc"
                                      defaultValue={inputs.desc}
                                      onChange={handleInputChange}
                            ></Textarea>
                        </div>

                        <div className="item">
                            <Input label="면적(평)" min={0} id="size" name="size" type="number" defaultValue={inputs.size}
                                   onChange={handleInputChange}/>
                            <Input label="가격" id="price" name="price" type="number" defaultValue={inputs.price}
                                   onChange={handleInputChange}/>
                            <Input label="관리비" id="maintenance" name="maintenance" type="number"
                                   defaultValue={inputs.maintenance} onChange={handleInputChange}/>
                        </div>

                        <div className="item">
                            <Input label="방 수" min={1} id="bedroom" name="bedroom" type="number"
                                   defaultValue={inputs.bedroom} onChange={handleInputChange}/>
                            <Input label="화장실 수" min={1} id="bathroom" name="bathroom" type="number"
                                   defaultValue={inputs.bathroom} onChange={handleInputChange}/>
                            <Selection name="pet" id="pet" label="애완동물 입주 가능" options={petOption}
                                       onChange={(e) =>
                                           setInputs((prev) => ({
                                               ...prev,
                                               pet: e.value,
                                           }))}
                                       defaultValue={petOption.find(option => option.value === inputs.pet)}/>
                        </div>

                        <div className="item">
                            <Selection
                                isMulti
                                id="option"
                                name="option"
                                label="옵션"
                                options={options}
                                value={inputs.option}
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
                                value={inputs.safeOption}
                                // value={safeOptionsValue}
                                // onChange={(e) => setSafeOptionsValue(e)}
                                onChange={(e) =>
                                    setInputs((prev) => ({
                                        ...prev,
                                        safeOption: e,
                                    }))}
                            />
                            <Input label="주차" id="parking" min={0} name="parking" type="number"
                                   defaultValue={inputs.parking} onChange={handleInputChange}/>
                        </div>

                        <div className="item">
                            <Input label="학교" min={0} id="school" name="school" type="number"
                                   defaultValue={inputs.school} onChange={handleInputChange}/>
                            <Input label="대중교통(버스, 지하철)" min={0} id="bus" name="bus" type="number"
                                   defaultValue={inputs.bus} onChange={handleInputChange}/>
                            <Input label="방향" id="direction" name="direction" type="text"
                                   defaultValue={inputs.direction} onChange={handleInputChange}/>
                        </div>

                        <div className="item imageUpload">
                            <span className="label">이미지 업로드</span>
                            <DropZone files={files} setFiles={setFiles} multiple={true} defaultImage={defaultImage} setDefaultImage={setDefaultImage}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>;

    return div;
}

export default UpdatePage;