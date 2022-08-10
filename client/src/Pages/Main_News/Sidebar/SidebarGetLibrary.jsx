import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import VariableStyle from "../../../Assets/scss/VariableTwo.module.css";
import SideMenuStyle from "../../../Assets/scss/Main_News/Sidebar.module.css";
import {GetOverlayRx, LoginRx, ViewProfileRx} from "../../../Actions";
import {BsCheckCircleFill, GrClose, HiOutlineFolderOpen} from "react-icons/all";
import {VscFolderLibrary} from "react-icons/vsc";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import update from "react-addons-update";
import TextError from "../../../Components/LoginRegister/text_error";
import {useNavigate} from "react-router-dom";

const SidebarGetLibrary = () => {
    const profile = useSelector((state) => state.profileView);
    const dispatch = useDispatch()
    const overlay = useSelector((state) => state.overlay)
    const [array, setArray] = useState()
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        collectionName: Yup.string()
            .required("This field is required")
            .max(120)
    });

    const formOptions = {resolver: yupResolver(validationSchema)};

    // get functions to build form with useForm() hook
    const {register: register, handleSubmit: handleSubmit, formState: {errors}, reset: reset} = useForm(formOptions);


    const onSubmit = async (data) => {
        let newData;
        if (overlay.sidebarCreate.buttonName === 'Create'){
            newData = update(data,{$merge: {name : 'InsertCollection'}})
        }
        if (overlay.sidebarCreate.buttonName === 'Edit'){
            newData = update(data,{$merge: {name : 'UpdateCollection', collectionId: overlay.sidebarCreate.collectionId }})
        }
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/collection', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            const parseRes = await response.json()
            if (!parseRes.error && overlay.sidebarCreate.buttonName !== 'Edit'){
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                }, 2000);
            }
            reset({
                collectionName: ''
            })
            dispatch(ViewProfileRx({collection: parseRes}))
            if (overlay.sidebarCreate.buttonName === 'Edit'){
                dispatch(GetOverlayRx({sidebarCreate: {ov: false, title: '', listState: false}}))
                navigate(`feed/library/collection/${data.collectionName}/${overlay.sidebarCreate.collectionId}`)
            }
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }


    const onClickCollectionList = async (data) => {
        const newData  = update(data, {$merge:{name: 'InsertCollectionList', articlePublishedId:  overlay.sidebarCreate.articleId}})
        try {
            if (overlay.sidebarCreate.title === 'Save in library') {
                const res = await fetch('http://localhost:5000/home/mainfunction/collection_list', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: 'include',
                    body: JSON.stringify(newData)
                });
                 await res.json()
            }
            dispatch(GetOverlayRx({sidebarCreate: {ov: false, title: '', listState: false}}))
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    useEffect(() => {
        setArray((profile && profile.collection) ? profile.collection: [])

    }, [profile.collection]);

    useEffect(() => {
        reset({
            collectionName: overlay.sidebarCreate.collectionName
        })
    }, [overlay.sidebarCreate.ov]);


    return (
        <React.Fragment>
            { overlay.sidebarCreate.ov &&
                <div onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    dispatch(GetOverlayRx({sidebarCreate: {ov: false, title: '', listState: false}}))}
                } className={VariableStyle.PopUpOverlayTwo}>
                    <div className={SideMenuStyle.GetLibrary}>
                        <div className={SideMenuStyle.GetLibraryTitleClose}>
                            <span>{overlay.sidebarCreate.title}</span>
                            <button onClick={()=>{
                                dispatch(GetOverlayRx({sidebarCreate: {ov: false, title: '', listState: false}}))
                            }
                            }><GrClose size={21}/></button>
                        </div>
                        <form className={SideMenuStyle.GetLibraryCreateBox} onSubmit={handleSubmit(onSubmit)}>
                            {overlay.sidebarCreate.listState && (
                                <label className="form-label">Create new collection</label>
                            )}
                            <div className={SideMenuStyle.GetLibraryCreateInput}>

                                <input placeholder={'Enter collection name'}
                                       defaultValue={''} {...register('collectionName')}
                                       className={`form-control ${errors.collectionName ? 'is-invalid' : ''}`}
                                       name="collectionName"/>
                                <button type={'submit'} disabled={success}>{overlay.sidebarCreate.buttonName}</button>
                            </div>
                            {errors.collectionName && <TextError name={errors.collectionName.message}/>}
                            {success &&
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '4px',
                                    alignItems: 'center',
                                    color: 'green'
                                }}>
                                    <BsCheckCircleFill size={20} color={'green'}/>Collection created successfully.</div>
                            }
                        </form>
                        {overlay.sidebarCreate.listState && (
                            <div className={SideMenuStyle.GetLibraryFooter}>
                                <label>
                                    {(array && array.length) ?
                                        'Select in current library list...':
                                        'Currently have no library list'
                                    }
                                </label>
                                <div
                                    className={array && array.length > 6 ? SideMenuStyle.GetLibraryBoxTwo : SideMenuStyle.GetLibraryBoxOne}>
                                    {array && array.map((element) => {
                                        return (
                                            <button onClick={()=>{
                                                onClickCollectionList({collectionId: element.collection_id})
                                            }}><HiOutlineFolderOpen size={20} />{element.collection_name}</button>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

export default SidebarGetLibrary;