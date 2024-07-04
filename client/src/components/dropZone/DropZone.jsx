import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import "./dropZone.scss";

import ThumbNail from "./ThumbNail.jsx";

function DropZone({files, setFiles, multiple= false, defaultImage=null, setDefaultImage=null}) { //
    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        })));
    }, [files]);

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({accept: {'image/*': []},onDrop, multiple :multiple});


    const deleteImage = (file) => {
        const index = files.indexOf(file);
        if (index > -1) {
            // setFiles(files.filter((s, i) => (i != index)));
            setFiles((prev) => prev.filter((s, i) => (i != index)));
        }
    }

    const deleteDefaultImage = (file) => {
        const index = defaultImage.indexOf(file);
        if (index > -1) {
            setDefaultImage(defaultImage.filter((s, i) => (i != index)));
        }

    };

    return (
        <div>
            <div {...getRootProps()} className="container">
                <input {...getInputProps()} />
                <span className="material-symbols-outlined">cloud_upload</span>
                <span>이미지를 드래그 & 드롭하거나 여기를 클릭해주세요.</span>
            </div>
            {
                multiple &&
                <aside className="thumbnail">
                    {
                        defaultImage?.map((image, idx) => <ThumbNail key={idx} file={image} deleteImage={deleteDefaultImage}/>)
                    }
                    {
                        files.map((file, idx) => <ThumbNail key={idx} file={file} deleteImage={deleteImage}/>)
                    }
                </aside>
            }

        </div>
    );
}

export default DropZone;
