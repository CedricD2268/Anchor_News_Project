import React, {useEffect, useLayoutEffect, useState, useRef} from 'react'
import styles from "../../Assets/scss/Main_News/Base.module.css"
import StudioStyle from '../../Assets/scss/Main_News/Studio.module.css'
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'
import { ImUpload2, ImNotification} from "react-icons/im"
import {FaCheckCircle} from "react-icons/fa";
import SettingStyle from "../../Assets/scss/Main_News/Settings.module.css"
import NavbarAvatar from "../../Components/MainStudio/NavbarAvatar"
import EditorTinyMce from "./EditorTinyMce"
import 'react-lazy-load-image-component/src/effects/blur.css'
import Cropper from "../../Components/MainStudio/Cropper"
import {CropImageRx} from '../../Actions'
import {useDispatch, useSelector} from "react-redux"
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import TextError from "../../Components/LoginRegister/text_error"
import update from 'react-addons-update';
import InputFieldSave from "../../Components/MainStudio/InputFieldSave"
import Spinner from "../../Components/Icon/LoadingSpinnerIcon"
import Footer from "../Main_News/Footer/Footer";
import SidebarTwo from "../Main_News/Sidebar/SidebarTwo";
import {useNavigate, useParams} from "react-router-dom";
import {GiSave, MdArticle, MdDoubleArrow, RiArticleFill} from "react-icons/all";
import imageCompression from "browser-image-compression";
import styled from "styled-components";
import GetHeadlineColor from '../../Components/MainStudio/GetHeadlineColor';
import LoadingSpinnerIcon from "../../Components/Icon/LoadingSpinnerIcon";
import TitleEditorIcon from "../../Components/Icon/TitleEditorIcon";
import BodyEditorIcon from "../../Components/Icon/BodyEditorIcon";
import UploadEditorIcon from "../../Components/Icon/UploadEditorIcon.jsx";
import LoadingIconThree from "../../Components/Icon/LoadingIconThree";


const HeadlineColorDiv = styled.div`
  background: linear-gradient(270deg, #354f52 calc(50% - 1px), ${(props) => props.background} 50%);
  span {
    color: ${(props) => props.color} ;
  }
`;

const Hr = styled.hr`
  box-shadow: none;
  width: 100%;
  //border-top: 4px double #354f52;
  background-color: #2f3e46;
  color: transparent;
  height: 4px;
  border-radius: 2px;
  border: none;
`;

const EditorStudio = () => {
    const navigate = useNavigate()
    const {articleId} = useParams()
    const dispatch = useDispatch()
    const imageResult = useSelector((state) => state.imageCrop)
    const getBody = useSelector((state) => state.getBody)
    const overlay = useSelector((state) => state.overlay)
    const isMountedTwo = useRef({a: false, b: false, c: false, d: false});
    const isInput = useRef([{a: false}, {b: false}, {c: false}, {d: false}]);
    const [isMounted, setIsMounted] = useState(false)
    const [cropOne, setCropOne] = useState(null)
    const [cropTwo, setCropTwo] = useState(null)
    const [cropThree, setCropThree] = useState(null)
    const [Input, setInput] = useState({title: '', body: '', description: '', imageDescription: ''})
    const [debounce, setDebounce] = useState(Input)
    const [checkInput, setCheckInput] = useState({a: false, b: false, c: false, d: false})
    const [cropName, setCropName] = useState([
        [{cropOne: null}, {name: 'image'}],
        [{cropTwo: null}, {name: 'imageL'}],
        [{cropThree: null}, {name: 'imageW'}]])
    const [editorBody, setEditorBody] = useState('')
    const [submitError, setSubmitError] = useState()
    const [submitDebounce, setSubmitDebounce] = useState(false)
    const [error, setError] = useState({title: '', body: '', description: '', imageDescription: ''})
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('The title field is required'),
        description: Yup.string()
            .required('The description field is required')
    });

    const formOptions = {resolver: yupResolver(validationSchema)}
    // get functions to build form with useForm() hook
    const {register, handleSubmit, formState, reset} = useForm(formOptions)
    const {errors} = formState

    const handleImageUpload = async (image) => {
        const imageFile = image;
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1450,
            useWebWorker: true
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            return compressedFile
        } catch (error) {
            console.log(error);
        }
    }

    const onChangeOneImage = async (e) => {
        if (!e.target.files[0]) return

        const newImage = handleImageUpload(e.target.files[0])
        setCropOne(URL.createObjectURL(await newImage))
        e.target.value = null
    }

    const onChangeTwoImage = async (e) => {
        if (!e.target.files[0]) return
        const newImage = handleImageUpload(e.target.files[0])
        setCropTwo(URL.createObjectURL(await newImage))
        e.target.value = null
    }

    const onChangeThreeImage = async (e) => {
        if (!e.target.files[0]) return
        const newImage = handleImageUpload(e.target.files[0])
        setCropThree(URL.createObjectURL(await newImage))
        e.target.value = null
    }

    const titleOnChange = (e) => {
        setInput({...Input, title: e.target.value})
    }

    const descriptionOnChange = (e) => {
        setInput({...Input, description: e.target.value})
    }

    const ImageDescriptionOnChange = (e) => {
        setInput({...Input, imageDescription: e.target.value})
    }

    const cancelOnClick = async (name, object) => {
        const data = new FormData()
        data.append('remove', true)
        data.append('articleId', articleId)
        data.append('name', name)
        try {
            const res = await fetch('https://njanchor.com/studio/upload/image', {
                method: "POST",
                credentials: 'include',
                body: data
            });
             await res.json()
        } catch (err) {
            console.error(err.message)
        }
        dispatch(CropImageRx(object))
    }

    const onSubmit = async () => {
        for (const img of Object.keys(imageResult)) {
            if (imageResult[img] === null) {
                setSubmitError('All uploads require an image.')
                return
            }
        }
        if ((Input && !Input.title) && (editorBody && !editorBody.title)){
            setSubmitError('Article requires a title before publishing. Please add a title and try to submit again.')
                return
        }
        if ((Input && !Input.description) && (editorBody && !editorBody.description)){
            setSubmitError('Article requires an article description preview before publishing. Please add a description and try to submit again.')
                return
        }
        setSubmitDebounce(true)
        const data = {'articleId': articleId}
        let url = 'https://njanchor.com/studio/publish/article'
        try {
            if (editorBody.inreviewdate)
                url = 'https://njanchor.com/studio/update_publish/article'
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
            setTimeout(() => {
                if (parseRes)
                    setSubmitDebounce(false)
                if (parseRes.error) {
                    setSubmitError(parseRes.error)
                    return
                }
                if (editorBody.typename === 'Opinion' || editorBody.inreviewdate) {
                    navigate(`/studio/home/published`)
                    return
                }
                navigate(`/studio/home/inreview`)
            }, 1000);
        } catch (err) {
            console.error(err.message)
        }
        return false
    }

    const UpdateText = async (name, text) => {
        const data = {
            'articleId': articleId,
            'name': name,
            'text': Object.values(text)[0]
        }
        try {
            const res = await fetch('https://njanchor.com/studio/update/article_text', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
             const response = await res.json()
            if (response && response.error){
                setError(update(error, {$merge: {[response.name]: response.error}}))
                return
            }
            setError(update(error, {$merge: {[name]: ''}}))
        } catch (err) {
            console.error(err.message)
        }

    }

    const CheckSuccess = (object)=>{
        // checkInput[object] ? (<Spinner size={30}/>) :
        //     isMountedTwo.current[object] ? (<FaCheckCircle size={23} color={'green'}/>) : ''

        if (checkInput && checkInput[object]){
           return(<Spinner size={30}/>)
        }else{
            if (isMountedTwo.current && isMountedTwo.current[object]){
                return(<FaCheckCircle size={23} color={'#84a98c'}/>)
            }else{
                return ('')
            }
        }
    }

    const UpdateBody = async () => {
        const data = {'body': getBody.BodyOne, 'articleId': articleId}
        try {
            const res = await fetch('https://njanchor.com/studio/update/body', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            await res.json()
        } catch (err) {
            console.error(err.message)
        }
    }

    const BodyOnLoad = async () => {
        const data = {
            'articleId': articleId,
            'name': 'viewArticleById'
        }
        try {
            const res = await fetch('https://njanchor.com/studio/view/article', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()

            dispatch(CropImageRx({cropOne: parseRes.image}))
            dispatch(CropImageRx({cropTwo: parseRes.imagel}))
            dispatch(CropImageRx({cropThree: parseRes.imagew}))
            setEditorBody(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true)
            return
        }
        setDebounce(update(Input, {$merge: {body: getBody.BodyOne}}))
        if (Input.title !== debounce.title)
            isInput.current = [{title: Input.title}, {a: true}, {a: false}]
        if (getBody.BodyOne !== debounce.body)
            isInput.current = [{body: Input.body}, {b: true}, {b: false}]
        if (Input.description !== debounce.description)
            isInput.current = [{description: Input.description}, {c: true}, {c: false}]
        if (Input.imageDescription !== debounce.imageDescription)
            isInput.current = [{imageDescription: Input.imageDescription}, {d: true}, {d: false}]
        isMountedTwo.current = {a: false, b: false, c: false, d: false}
        setTimeout(() => {
            isMountedTwo.current = update(isMountedTwo.current, {$merge: isInput.current[1]})
            setCheckInput(update(checkInput, {$merge: isInput.current[1]}))
            setTimeout(() => {
                setCheckInput(update(checkInput, {$merge: isInput.current[2]}))
                if (Object.keys(isInput.current[0])[0] === 'body') {
                    UpdateBody()
                } else {
                    UpdateText(Object.keys(isInput.current[0])[0], isInput.current[0])
                }
            }, 300)
        }, 500)
    }, [Input, getBody.BodyOne])

    useEffect(() => {
        BodyOnLoad()
    }, [])

    return (



        <div className={StudioStyle.EditorBody}>
            <div className={styles.wrapper} >
                <SidebarTwo OverlayRX={overlay.sidebarFour} Home={false} Radius={'6px'}/>
            </div>
            <div>
                <Cropper objectName={cropName[0][1].name} objectReduxName={Object.keys(cropName[0][0])[0]}
                         onFileChange={cropOne} aspectRatio={3 / 1} articleId={articleId}/>
                <Cropper objectName={cropName[1][1].name} objectReduxName={Object.keys(cropName[1][0])[0]}
                         onFileChange={cropTwo} aspectRatio={0.67 / 1} cropHeight={50} cropWidth={33.5}
                         articleId={articleId}/>
                <Cropper objectName={cropName[2][1].name} objectReduxName={Object.keys(cropName[2][0])[0]}
                         onFileChange={cropThree} aspectRatio={2.15 / 1} cropHeight={23} cropWidth={50}
                         articleId={articleId}/>
            </div>
            <div className={submitDebounce ? VariableStyle.PopUpOverlayTwo: ''}>
                {submitDebounce &&
                    <div className={StudioStyle.EditorSubmitOverlay}>
                        <LoadingIconThree size={230}/>
                    </div>
                }
            </div>
            <div className={[styles.wrapper, StudioStyle.Editor].join(' ')}>
                <div className={StudioStyle.EditorHeader}>
                    <div className={StudioStyle.EditorHeaderName}>
                        <span>Studio Editor</span><span> AutoSave</span>
                    </div>
                    <div className={StudioStyle.EditorHeaderNavbar}>
                        <div className={StudioStyle.HomeStudioButton}> <button onClick={()=>{
                            window.location.href = "/studio/home/my-home"
                        }}>Anchor Studio</button></div>
                        <NavbarAvatar SubscribeButtonVisibility={false} AvatarNameVisibility={true} Color={'white'}
                                      ClearFunc={[{sidebarFour: !overlay.sidebarFour}, {sidebarFour: false}]}/>
                    </div>
                </div>
                <div className={StudioStyle.ArticleHeader}>
                    <HeadlineColorDiv
                        className={StudioStyle.ArticleHeaderNameColor}
                        background={
                        editorBody && editorBody.typename ?
                            GetHeadlineColor({target: editorBody.typename, option: 'partialBackground'}).background:
                            GetHeadlineColor({target: 'Opinion', option: 'partialBackground'}).background}
                        color={
                        editorBody && editorBody.typename ?
                            GetHeadlineColor({target: editorBody.typename, option: 'partialBackground'}).color:
                            GetHeadlineColor({target: 'Opinion', option: 'partialBackground'}).color
                        }
                    >
                        <span>{editorBody.typename}</span>
                        <span style={{marginLeft: 'auto', color: 'white'}}>{editorBody.topicname}</span>
                    </HeadlineColorDiv>
                    <div className={StudioStyle.ArticleName}>
                        <div className={StudioStyle.ArticleNameLogo}>
                            <TitleEditorIcon size={30}/>
                            <span>Title</span>
                        </div>
                        <InputFieldSave
                            Height={'45px'}
                            Width={'100%'}
                            Border={'1px solid lightgrey'}
                            BorderFocusColor={'black'}
                            BorderRadius={'4px'}
                            DefaultValue={editorBody.title}
                            Onchange={titleOnChange}
                            ClassName={'form-control'}
                            PlaceHolder={'Untitled document......'}
                            Icon={CheckSuccess('a')}
                        />
                        {error.title && <TextError name={error.title}/>}
                    </div>
                </div>
                <div className={StudioStyle.ArticleImagePreview}>
                    <div className={StudioStyle.ArticleImagePreviewButtons}>
                        {imageResult.cropOne && (
                            <button type={'button'} onClick={() => {
                                cancelOnClick(cropName[0][1].name, cropName[0][0])
                            }}>Remove Image</button>
                        )}
                    </div>
                    <div className={StudioStyle.ArticleImagePreviewBox}
                         style={{maxWidth: '900px', maxHeight: '300px', marginTop: '-45px', overflow: 'hidden'}}>
                        {imageResult.cropOne ? (
                            <img src={imageResult.cropOne} alt={'image preview'}/>
                        ) : (
                            <React.Fragment>
                                <div className={StudioStyle.PreviewBoxDummy}/>
                                <div>
                                    <UploadEditorIcon size={100} color={'#f1faee'}/>
                                    <label>
                                        <span>Upload Article Image</span>
                                        <input
                                            className={SettingStyle.MainPortfolioUpload}
                                            accept="image/*"
                                            type='file'
                                            onChange={onChangeOneImage}
                                            placeholder={'gf'}
                                        />
                                    </label>
                                </div>
                                <div className={StudioStyle.PreviewBoxDummy}/>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div className={StudioStyle.ArticleName}>
                    <div className={StudioStyle.ArticleNameLogo}>
                        <TitleEditorIcon size={30}/>
                        <span>Image Description <span
                            style={{color: 'slategrey', fontSize: '16.5px'}}>Optional*</span></span>
                    </div>
                    <InputFieldSave
                        Height={'45px'}
                        Width={'100%'}
                        Border={'1px solid lightgrey'}
                        BorderFocusColor={'black'}
                        BorderRadius={'4px'}
                        DefaultValue={editorBody.imagedescription}
                        Onchange={ImageDescriptionOnChange}
                        ClassName={'form-control'}
                        PlaceHolder={'Untitled image description......'}
                        Icon={CheckSuccess('d')}
                    />
                    {error.imageDescription && <TextError name={error.imageDescription}/>}
                </div>
                <div className={StudioStyle.CkEditor}>
                    <div className={StudioStyle.CkEditorHeader}>
                        <div>
                            <BodyEditorIcon size={30}/>
                            <h2>Article Body</h2>
                        </div>

                        <div>
                            {CheckSuccess('c')}
                            <GiSave size={23}/>
                        </div>
                    </div>
                    <EditorTinyMce DefaultValue={editorBody.body}/>
                </div>
                <Hr/>
                <div className={StudioStyle.ArticleName}>
                    <div className={StudioStyle.ArticleNameLogo}>
                        <TitleEditorIcon size={30}/>
                        <span>Description Preview</span>
                    </div>
                    <InputFieldSave
                        Height={'45px'}
                        Width={'100%'}
                        Border={'1px solid lightgrey'}
                        BorderFocusColor={'black'}
                        BorderRadius={'4px'}
                        DefaultValue={editorBody.description}
                        Onchange={descriptionOnChange}
                        ClassName={'form-control'}
                        PlaceHolder={'Untitled description document......'}
                        Icon={CheckSuccess('c')}
                    />
                    {error.description && <TextError name={error.description}/>}
                </div>
                <div className={StudioStyle.ArticleImagesBox}>
                    <div className={StudioStyle.ArticleImagePreview} style={{width: '100%', height: '450px'}}>
                        <div className={StudioStyle.ArticleImagePreviewButtons}>
                            {imageResult.cropTwo && (
                                <button type={'button'} onClick={() => {
                                    cancelOnClick(cropName[1][1].name, cropName[1][0])
                                }}>Remove Image</button>
                            )}
                        </div>
                        <div className={StudioStyle.ArticleImagePreviewBox}
                             style={{width: '270px', height: '360px', marginTop: '-30px'}}>
                            {imageResult.cropTwo ? (
                                <img src={imageResult.cropTwo} alt={'image preview'}/>
                            ) : (
                                <div>
                                    <UploadEditorIcon size={70} color={'#f1faee'}/>
                                    <label>
                                        <span>Upload Portrait Preview</span>
                                        <input
                                            className={SettingStyle.MainPortfolioUpload}
                                            accept="image/*"
                                            type='file'
                                            onChange={onChangeTwoImage}
                                        />
                                    </label>
                                </div>

                            )}
                        </div>
                    </div>
                    <div className={StudioStyle.ArticleImagePreview} style={{width: '100%', height: '450px'}}>
                        <div className={StudioStyle.ArticleImagePreviewButtons}>
                            {imageResult.cropThree && (
                                <button type={'button'} type={'button'} onClick={() => {
                                    cancelOnClick(cropName[2][1].name, cropName[2][0])
                                }}>Remove Image</button>
                            )}
                        </div>
                        <div className={StudioStyle.ArticleImagePreviewBox}
                             style={{width: '380px', height: '180px', marginTop: '-30px'}}>
                            {imageResult.cropThree ? (
                                <img src={imageResult.cropThree} alt={'image preview'}/>
                            ) : (
                                <div>
                                    <UploadEditorIcon size={70} color={'#f1faee'}/>
                                    <label>
                                        <span>Upload Landscape Preview</span>
                                        <input
                                            className={SettingStyle.MainPortfolioUpload}
                                            accept="image/*"
                                            type='file'
                                            onChange={onChangeThreeImage}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Hr/>
                <div className={StudioStyle.PublishNotice}>
                    <div><h3>Important Notice! </h3> <ImNotification size={22} color={'#fb8500'}/></div>
                    <ul>
                        <li>
                            <p>Uploading a <span style={{color: '#9c6644'}}>Landscape Preview</span> image will be used
                                as the default image for the article save-in studio.</p>
                        </li>
                        <li><p>Unfortunately only <span style={{color: '#9c6644'}}>Opinion</span> type articles are
                            allow to be publish and without admin review. Non-Opinion articles can still be edited and be saved on your
                            Studio.</p>
                        </li>
                        <li>
                            <p>Upon submitting, any images that contain Gore, Nudity, or an Offensive material will be
                                not permitted. </p>
                        </li>
                    </ul>
                </div>

                <Hr/>

                {submitError &&
                    <div className={VariableStyle.ErrorDiv}>
                        <TextError name={submitError}/>
                    </div>
                }
                <div className={StudioStyle.ArticlePublishButton}>
                    <button type='submit' onClick={onSubmit} disabled={submitDebounce}>
                        {submitDebounce ?
                            <LoadingSpinnerIcon size={27} color={'#dcdcdd'} />:
                            <React.Fragment>
                                {editorBody.inreviewdate === null ?
                                    (<React.Fragment>{editorBody.typename === 'Opinion' ? (
                                            <React.Fragment>Publish Article </React.Fragment>) :
                                        (<React.Fragment>Submit Article For Review </React.Fragment>)
                                    }
                                    </React.Fragment>) : (<React.Fragment>Publish Article</React.Fragment>)
                                }
                                <MdDoubleArrow size={23}/>
                            </React.Fragment>
                        }
                    </button>
                </div>
                <Footer/>
            </div>

        </div>


    );
};
export default EditorStudio;