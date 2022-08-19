import React, {useEffect, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css';
import UserFace from '../../../Assets/Images/UserFaces/user.png'
import {GetOverlayRx, ViewProfileRx} from "../../../Actions";
import {useDispatch} from "react-redux";
import VariableStyle from "../../../Assets/scss/VariableTwo.module.css";
import {useLocation} from "react-router-dom";


const CroppieUser = () => {
    const dispatch = useDispatch()
    const location = useLocation()

    const [ setImage] = useState()

    let editor = "";
    const [picture, setPicture] = useState({
        cropperOpen: false,
        img: null,
        zoom: 1.5,
        croppedImg: UserFace
    });
    const handleSlider = () => {
        let i = document.querySelector('.' + SettingStyle.ImageSlider + ' input')
        setPicture({
            ...picture,
            zoom: i.value
        });
    };

    const setEditorRef = (ed) => {
        editor = ed;
    };

    const handleSave = async (e) => {
        if (setEditorRef) {
            const canvasScaled = editor.getImageScaledToCanvas();
            const croppedImg = canvasScaled.toDataURL("image/jpeg", 1);
            await fetch(croppedImg)
                .then(res => res.blob())
                .then(async blob => {
                    const file = new File([blob], "File name", {type: "image/jpeg"})
                    const data = new FormData()
                    data.append('image', file)
                    try {
                        const res = await fetch('https://njanchor.com/home/get/promise-image-url', {
                            method: "POST",
                            credentials: 'include',
                            boundary: 'MyBoundary',
                            body: data
                        });
                        const parseRes = await res.json();
                        if (parseRes && parseRes.error){
                            dispatch(ViewProfileRx({profileImageError: parseRes.error}))
                            return
                        }
                        dispatch(ViewProfileRx({profileImageError: false}))
                        dispatch(ViewProfileRx(parseRes))

                    } catch (err) {
                        console.error(err.message);
                    }
                })
            setPicture({
                ...picture,
                img: null,
                cropperOpen: false,
                croppedImg: croppedImg
            });
        }
    };


    const handleCancel = () => {
        setPicture({
            ...picture,
            cropperOpen: false
        });
    };

    const handleFileChange = (e) => {
        let url = URL.createObjectURL(e.target.files[0]);
        setPicture({
            ...picture,
            img: url,
            cropperOpen: true
        });
    };

    const buttonX = () =>{
        document.addEventListener('click', function (e) {
            const ids = document.querySelector("#SettingInputUpload");
            if (ids) {
                if (ids.contains(e.target)) {
                    ids.onchange = function (e) {
                        handleFileChange(e)
                    }
                    ids.onclick = function () {
                        this.value = null;
                    };
                }
            }
        })
    }


    useEffect(() => {
        buttonX();
    }, []);

    useEffect(() => {
        handleCancel()
    }, [location.pathname]);


    return (
        <div>
            {picture.cropperOpen && (
                <div className={VariableStyle.PopUpOverlayTwo} onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    handleCancel()
                }}>
                    <div className={SettingStyle.Croppier}>
                        <div className={SettingStyle.ImageCrop}>
                            <AvatarEditor
                                ref={setEditorRef}
                                image={picture.img}
                                width={150}
                                height={150}
                                border={50}
                                borderRadius={100}
                                color={[0, 35, 41, 0.58]} // RGBA
                                rotate={0}
                                scale={picture.zoom}
                            />
                        </div>
                        <div className={SettingStyle.ImageSlider}>
                            <input
                                type="range"
                                min={1}
                                max={5}
                                step={0.03}
                                value={picture.zoom}
                                onChange={handleSlider}
                            />
                        </div>
                        <div className={SettingStyle.ImageCropSave}>
                            <button onClick={handleSave}>Save as profile picture</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};


export default CroppieUser;


