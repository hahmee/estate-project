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
    const post = useLoaderData();
    const [files, setFiles] = useState([]);
    const [optionsValue, setOptionsValue] = useState(options.filter(option => post.postDetail.option.includes(option.value)));
    const [safeOptionsValue, setSafeOptionsValue] = useState(safeOptions.filter(option => post.postDetail.safeOption.includes(option.value)));
    const [defaultImage, setDefaultImage] = useState(post.images);
    const navigate = useNavigate();
    const {progress, setProgress, saveLocation} = useContext(UserProgressContext);
    const { id } = useParams();


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setProgress('',{...progress, loading: true});

        const formData = new FormData(e.target);
        const inputs = Object.fromEntries(formData);
        const optionList = optionsValue.map(value => value.value);
        const safeOptionList = safeOptionsValue.map(value => value.value);
        let imageUrl = [...defaultImage];

        try {
            //defaultImage에서 삭제된 것들 cloud에서 지우기
            // cloudinary.v2.uploader.destroy(public_id, options).then(callback);

            if (imageUrl.length + files.length < 1) {
                //throw new Error('이미지 한 개 이상을 첨부해야 합니다.');
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
                    bedroom: Number(inputs.bedroom),
                    bathroom: Number(inputs.bathroom),
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
            toast.success('성공적으로 수정되었습니다.');
            navigate("/read/" + res.data);

        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            setProgress('', {...progress, loading: false});
        }
    }, [files, optionsValue, safeOptionsValue, defaultImage]);

    useEffect(() => {
        setProgress('save');

        saveLocation({
            latitude: post.latitude,
            longitude: post.longitude,
            politicalList: post.politicalList,
            address: post.address,
        });

    }, []);

    const div = <>
        <div className="newPostPage">
            <h2>수정해주세요</h2>
            <div className="formContainer">
                <div className="wrapper">
                    <form id="estate-post-form" onSubmit={handleSubmit}>
                        <div className="item">
                            <Input label="제목" type="text" id="title" name="title" defaultValue={post.title}/>
                            <Selection id="property" name="property" label="방종류" options={roomOption}
                                       defaultValue={roomOption.find((option) => option.value === post.property)}/>
                            <Selection id="type" name="type" label="타입" options={typeOption}
                                       defaultValue={typeOption.find(option => option.value === post.type)}/>
                        </div>

                        <div className="item description">
                            <Textarea label="설명" id="description" name="description"
                                      defaultValue={post.postDetail.desc}></Textarea>
                        </div>

                        <div className="item">
                            <Input label="면적(평)" min={0} id="size" name="size" type="number"
                                   defaultValue={post.size}/>
                            <Input label="가격" id="price" name="price" type="number" defaultValue={post.price}/>
                            <Input label="관리비" id="maintenance" name="maintenance" type="number"
                                   defaultValue={post.maintenance}/>
                        </div>

                        <div className="item">
                            <Input label="방 수" min={1} id="bedroom" name="bedroom" type="number"
                                   defaultValue={post.bedroom}/>
                            <Input label="화장실 수" min={1} id="bathroom" name="bathroom" type="number"
                                   defaultValue={post.bathroom}/>
                            <Selection name="pet" id="pet" label="애완동물 입주 가능" options={petOption}
                                       defaultValue={petOption.find(option => option.value === post.postDetail.pet)}/>
                        </div>

                        <div className="item">
                            <Selection
                                isMulti
                                id="option"
                                name="option"
                                label="옵션"
                                options={options}
                                value={optionsValue}
                                onChange={(e) => setOptionsValue(e)}
                            />
                            <Selection
                                isMulti
                                id="safeOption"
                                name="safeOption"
                                label="보안/안전시설"
                                options={safeOptions}
                                value={safeOptionsValue}
                                onChange={(e) => setSafeOptionsValue(e)}
                            />
                            <Input label="주차" id="parking" min={0} name="parking" type="number"
                                   defaultValue={post.postDetail.parking}/>
                        </div>

                        <div className="item">
                            <Input label="학교" min={0} id="school" name="school" type="number"
                                   defaultValue={post.postDetail.school}/>
                            <Input label="대중교통(버스, 지하철)" min={0} id="bus" name="bus" type="number"
                                   defaultValue={post.postDetail.bus}/>
                            <Input label="방향" id="direction" name="direction" type="text"
                                   defaultValue={post.postDetail.direction}/>
                        </div>

                        <div className="item imageUpload">
                            <span className="label">이미지 업로드</span>
                            <DropZone files={files} setFiles={setFiles} multiple={true} defaultImage={defaultImage}
                                      setDefaultImage={setDefaultImage}/>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    </>;

    return div;
}

export default UpdatePage;