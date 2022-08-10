import React, {useEffect, useState} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import StudioStyle from '../../Assets/scss/Main_News/Studio.module.css';
import styled from "styled-components";
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'
import {CropImageRx} from '../../Actions';
import {useDispatch} from "react-redux";
import imageCompression from "browser-image-compression";

const CropperCss = styled.div.attrs(props => ({
    className: props.className
}))`
  max-width: ${(props) => props.width};
  div {
    img {
      max-height: ${(props) => props.height};
    }
  }
`;

const Cropper = ({objectName, objectReduxName, aspectRatio, onFileChange, Width, Height, cropHeight, cropWidth, articleId}) => {
    const dispatch = useDispatch()
    const [file, setFile] = useState(onFileChange)
    const [Image, setImage] = useState(null)
    const cropInc= useState({
        unit: 'px', // default, can be 'px' or '%'
        x: 25,
        y: 25,
        width: cropWidth,
        height: cropHeight
    })
    const [crop, setCrop] = useState(cropInc);

    const onChangeImage = (e) => {
        setImage(e.currentTarget)
    }
    const closeCropper = () => {
        setFile(null)
        setCrop(cropInc)
    }

    const getCroppedImg = async () => {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = Image.naturalWidth / Image.width;
        const scaleY = Image.naturalHeight / Image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            Image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
        // const base64Image = canvas.toDataURL('image/jpeg', 1);
        const base64Image = new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                      //reject(new Error('Canvas is empty'));
                      console.error('Canvas is empty');
                      return;
                    }
                    blob.name = 'croppedImage.jpeg';
                    const croppedImageUrl = window.URL.createObjectURL(blob);
                    resolve(croppedImageUrl);
                },
                'image/jpeg',
                1
            );
        });




        const imageToFile = await base64Image
        fetch(imageToFile)
            .then(res => res.blob())
            .then(async blob => {
                const file = new File([blob], "File name", {type: "image/png"})
                const data = new FormData()
                // data.append('permission', 'false')
                data.append('image', file)
                data.append('articleId', articleId)
                data.append('name', objectName)
                try {
                    const res = await fetch('http://localhost:5000/studio/upload/image', {
                        method: "POST",
                        credentials: 'include',
                        body: data
                    });
                    await res.json()
                } catch (err) {
                    console.error(err.message)
                }
            })
        if (objectReduxName === 'cropOne')
            dispatch(CropImageRx({cropOne: await base64Image}))
        if (objectReduxName === 'cropTwo')
            dispatch(CropImageRx({cropTwo: await base64Image}))
        if (objectReduxName === 'cropThree')
            dispatch(CropImageRx({cropThree: await base64Image}))
        setCrop(cropInc)
        setFile(null)
    }

    useEffect(() => {
        setFile(onFileChange)
    }, [onFileChange])

    return (
        <React.Fragment>
                {file && (
                    <div className={VariableStyle.PopUpOverlayTwo}>
                        <CropperCss width={Width} height={Height} className={StudioStyle.Cropper}>
                            <ReactCrop crop={crop} aspect={aspectRatio} onChange={setCrop}>
                                <img src={file} alt={"File"} onLoad={onChangeImage}/>
                            </ReactCrop>
                            <div className={StudioStyle.CropperButtons}>
                                <button type={'button'} onClick={getCroppedImg}>Save crop image</button>
                                <button type={'button'} onClick={closeCropper}>Cancel</button>
                            </div>
                            {/*<img src={file} alt={"File Image"} />*/}
                        </CropperCss>
                    </div>
                )}
        </React.Fragment>
    );
};

Cropper.defaultProps = {
    id: 'null',
    aspectRatio: 16/9,
    onFileChange: null,
    Width: '670px',
    Height: '520px',
    cropHeight: 66.5,
    cropWidth: 200
};


export default Cropper;