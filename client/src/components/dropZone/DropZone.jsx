import React, {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import "./dropZone.scss";
import axios from "axios";
import ThumbNail from "./ThumbNail.jsx";

function DropZone() {

    const [files, setFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        console.log('acceptedFiles', acceptedFiles);
        setFiles(acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        })));
    }, []);

    useEffect(() => {
        console.log('files', files);
    }, [files]);

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({accept: {'image/*': []},onDrop});


    const handleUpload = async() => {
        const url = `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUD_NAME}/upload`;

        files.map(async file => {
            const formData = new FormData();
            const config = {
                header:{
                    'content-Type': 'multipart/form-data',
                }
            }
            formData.append('file', file);
            formData.append('upload_preset', 'estate');

            const res = await axios.post(url, formData, config);

            console.log('res', res.data.url);
        })
    }

    const deleteImage = (file) => {
        const index = files.indexOf(file);
        if (index > -1) {
            setFiles(files.filter((s, i) => (i != index)));
        }

    }


    return (
        <div>
            <div {...getRootProps()} className="container">
                <input {...getInputProps()} />
                <p>이미지를 드래그 & 드롭하거나 여기를 클릭해주세요.</p>
            </div>
            <aside className="thumbnail">
                {
                    files.map((file, idx) => <ThumbNail key={idx} file={file} deleteImage={deleteImage}/>)
                }
            </aside>
        </div>
    );
}

export default DropZone;
