import React, {useState, useEffect, useCallback, useRef} from "react";
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css'
import {MdOutlineModeEditOutline} from "react-icons/md";
import {FaCheckCircle, FaRegTrashAlt} from "react-icons/fa";
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import TextError from "../../../Components/LoginRegister/text_error";
import {GetOverlayRx, ViewProfileRx} from "../../../Actions";
import {useDispatch, useSelector} from "react-redux";
import GoogleLogin from "react-google-login";
import {BiCheck, RiCloseCircleFill} from "react-icons/all";
import {BsFillCheckCircleFill} from "react-icons/bs";
import SavedIcon from "../../../Components/Icon/SavedIcon";
import DeleteUserIcon from "../../../Components/Icon/DeleteUserIcon";
import GoogleIcon from "../../../Components/Icon/GoogleIcon";
import BellIcon from "../../../Components/Icon/BellIcon";
import userface from "../../../Assets/Images/UserFaces/user3.png"
import LoadingSpinnerTwoIcon from "../../../Components/Icon/LoadingSpinnerTwoIcon";
import LoadingSpinnerIcon from "../../../Components/Icon/LoadingSpinnerIcon";
import update from "react-addons-update";


const Profile = () => {
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profileView);
    const [notifOff, setNotifOff] = useState('');
    const [error, setError] = useState('');
    const [Input, setInput] = useState({name: '', username: ''})
    const [load, setLoad] = useState({a:false, b: false})
    const [submit, setSubmit] = useState({a:false, b: false})
    const [errorSubmit, setErrorSubmit] = useState({a:false, b: false})
    const [toggle, setToggle] = useState()


    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('The name field is required')

    });

    const validationSchemaTwo = Yup.object().shape({
        username: Yup.string()
            .required('The username field is required'),

    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const formOptionsTwo = { resolver: yupResolver(validationSchemaTwo) };
    const { register, handleSubmit, formState: { errors }, reset } = useForm(formOptions)
    const { register:register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm(formOptionsTwo)


    const onSubmitName = async (data) => {
        setLoad(update(load,{$merge: {a: true}}))
        try {
            const res = await fetch('http://localhost:5000/home/update/profile', {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
            setTimeout(() => {
                setLoad(update(load, {$merge: {a: false}}))
                if (parseRes.error) {
                    setErrorSubmit(update(errorSubmit, {$merge: {a: true}}))
                    setError(parseRes)
                } else {
                    setSubmit(update(submit, {$merge: {a: true}}))
                    dispatch(ViewProfileRx(parseRes))
                    setError('')
                }
            setTimeout(() => {
                setErrorSubmit(update(errorSubmit, {$merge: {a: false}}))
                setSubmit(update(submit,{$merge: {a: false}}))
            }, 2000)
        }, 1500)

        } catch (err) {
            console.error(err.message)
        }
        return false
    }

    const handleCheckBoxChange = async(e) => {
        const data = {notification: e.target.checked};
        try {
            const res = await fetch('http://localhost:5000/home/update/profile', {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
            dispatch(ViewProfileRx(parseRes))
        } catch (err) {
            console.error(err.message)
        }
    }

    const onSubmitUsername = async (data) => {
        setLoad(update(load,{$merge: {b: true}}))
        try {
            const res = await fetch('http://localhost:5000/home/update/profile', {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
            setTimeout(() => {
                setLoad(update(load, {$merge: {b: false}}))
                if (parseRes.error) {
                    setErrorSubmit(update(errorSubmit, {$merge: {b: true}}))
                    setError(parseRes)
                } else {
                    setSubmit(update(submit, {$merge: {b: true}}))
                    setError('')
                    dispatch(ViewProfileRx(parseRes))
                }
            setTimeout(() => {
                setErrorSubmit(update(errorSubmit, {$merge: {b: false}}))
                setSubmit(update(submit,{$merge: {b: false}}))
            }, 2000)
        }, 1500)

        } catch (err) {
            console.error(err.message)
        }
        return false;
    }

    const ViewProfile = async () => {
        try {
            const res = await fetch('http://localhost:5000/home/view/profile', {
                method: "GET",
                credentials: 'include',
            });
            const responseOne = await res.json()
            dispatch(ViewProfileRx(responseOne))
            setNotifOff(responseOne.notif)
        } catch (err) {
            console.error(err.message)
        }
    }

    const HandleAccountChange = async (googleData) => {
        const bodyData = {"token": googleData.tokenId}
        try {
            const res= await fetch('http://localhost:5000/home/update/account_media', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(bodyData)
            });
            const parseRes = await res.json();
            if (parseRes.error){
                setError(parseRes)
            }else{
                dispatch(ViewProfileRx(parseRes))
            }

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }


    const RemoveProfileImage = async () => {
        try {
            const res = await fetch('http://localhost:5000/home/delete_profile_image', {
                method: "GET",
                credentials: 'include',
            });
            const parseRes = await res.json();
            if (!parseRes.error) {
                dispatch(ViewProfileRx(parseRes))
            }
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const HandleFailure = () => {
        console.log("GOOGLE LOGIN NOT WORKING")
    }

    useEffect(() => {
        ViewProfile();
    }, []);


    return (
        <div>
            <div className={SettingStyle.Header}>Profile</div>
            <div className={SettingStyle.MainPortfolio}>
                <div className={SettingStyle.MainPortfolioA}>
                    <div className={SettingStyle.MainPortfolioAone}>
                        <img src={profile.avatarlocation ? profile.avatarlocation : userface }/>
                    </div>
                    <div className={SettingStyle.MainPortfolioAtwo}>
                        <label>
                            <MdOutlineModeEditOutline size={20} style={{paddingRight: 5}}/> <span></span>
                            <input
                                id ='SettingInputUpload'
                                className={SettingStyle.MainPortfolioUpload}
                                   accept="image/*"
                                   type='file'
                            />
                        </label>
                        <button type='button' onClick={RemoveProfileImage}><FaRegTrashAlt size={19} style={{paddingRight: 9}}/><span></span></button>
                    </div>

                </div>
                {profile.profileImageError &&
                    <TextError name={profile.profileImageError}/>
                }
                <hr/>
                <div className={SettingStyle.MainPortfolioB}>
                    <div className={SettingStyle.MainPortfolioBOne}>
                        <form onSubmit={handleSubmit(onSubmitName)} className={SettingStyle.MainPortfolioBOneA}>
                            <label>Full name</label>
                            <div className={SettingStyle.MainPortfolioBOneAInput}>
                                <input type="name" {...register('name')}
                                       name="name"
                                       defaultValue={profile.fullname ? profile.fullname : ''}
                                       placeholder='Enter name'
                                />
                                <button type={'submit'} disabled={(load.a || submit.a)}>
                                    {load.a ?
                                        <LoadingSpinnerIcon size={23}/> :
                                        submit.a ?
                                            <FaCheckCircle size={21} color={'#0d5e32'}/> : errorSubmit.a ?
                                            <RiCloseCircleFill size={22} color={'red'}/> :
                                            <SavedIcon size={22}/>
                                    }
                                </button>

                            </div>
                            {errors.name &&<TextError name={errors.name.message}/>}
                            {error.errorFull &&<TextError name={error.errorFull}/>}
                        </form>
                        <form onSubmit={handleSubmit2(onSubmitUsername)} className={SettingStyle.MainPortfolioBOneA}>
                            <label>Username</label>
                            <div className={SettingStyle.MainPortfolioBOneAInput}>
                                <input type="username" {...register2('username')}
                                       name="username"
                                       className={`form-control ${errors2.username ? 'is-invalid' : ''}`}
                                       placeholder='Enter new username'
                                       defaultValue={profile.username}/>
                                <button type={'submit'} disabled={(load.b || submit.b)}>
                                    {load.b ?
                                        <LoadingSpinnerIcon size={23}/> :
                                        submit.b ?
                                            <FaCheckCircle size={21} color={'#0d5e32'}/> :
                                            <SavedIcon size={22}/>
                                    }
                                </button>
                            </div>
                            {errors2.username &&<TextError name={errors2.username.message}/>}
                            {error.errorUsername &&<TextError name={error.errorUsername}/>}
                        </form>
                    </div>
                    <hr/>
                    <div className={SettingStyle.MainPortfolioBOne}>
                        <div className={SettingStyle.MainPortfolioBOneA}>
                            <label>Email address</label>
                            <input  value={profile.email} disabled/>
                        </div>
                    </div>
                    <hr/>
                </div>
                <div className={SettingStyle.MainPortfolioC}>
                    <div className={SettingStyle.HeaderFlex}><BellIcon size={28}/>
                        <h2>Notifications</h2></div>
                    <div>
                        <span>Turn on notification to receive newsletters, promotions and news from The New Jersey Times
                            Company.</span>
                        <div className={SettingStyle.toggleWrapper}>
                            <label className={SettingStyle.toggle} htmlFor="uniqueCheckboxID">
                                <input type="checkbox"  onChange={handleCheckBoxChange}  defaultChecked={profile.notif} className={SettingStyle.toggleInput} id="uniqueCheckboxID"/>
                                <span className={SettingStyle.toggleTrack}>
				                <span className={SettingStyle.toggleIndicator}>
                                <span className={SettingStyle.checkMark}>
                                    <BiCheck size={20} color={'white'}/>
                                </span>
                                </span>
                            </span>
                            </label>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className={SettingStyle.MainPortfolioC}>
                    <div className={SettingStyle.HeaderFlex}><GoogleIcon size={28}/><h2>Login with
                        Google</h2></div>
                    <div className={SettingStyle.MainPortfolioCTwo}>
                        <span> Connecting with Google will allows us to populate your account information.</span>
                        <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                     render={renderProps => (
                                         <button
                                             className={profile.medianame !== 'google' ?  SettingStyle.MainPortfolioCButtonOne  : SettingStyle.MainPortfolioCButtonThree}
                                             // className={SettingStyle.MainPortfolioCButtonThree}
                                             type='button'
                                             disabled={profile.medianame !== 'google' ? false : true}
                                             // disabled={true}
                                             onClick={renderProps.onClick}
                                             // disabled={renderProps.disabled}
                                         >
                                             {profile.medianame !== 'google' ? `Connect` : (<React.Fragment>Connected&nbsp; <BsFillCheckCircleFill size={19} color={'white'}/></React.Fragment>)}

                                         </button>
                                     )}
                                     buttonText={"Log in with Google"}
                                     onSuccess={HandleAccountChange}
                                     onFailure={HandleFailure}
                                     cookiePolicy={"single_host_origin"}>
                        </GoogleLogin>

                    </div>
                    {error.errorGoogle &&<TextError name={error.errorGoogle}/>}
                </div>
                <hr/>
                <div className={SettingStyle.MainPortfolioC}>
                    <div className={SettingStyle.HeaderFlex}><DeleteUserIcon size={28}/><h2>Delete Account</h2></div>
                    <div className={SettingStyle.MainPortfolioCThree}>
                        <span> Deleting your account will purge all data related to us (Not Google account info if connected).
                            </span>
                        <button type='button' onClick={()=>{
                            dispatch(GetOverlayRx({removeAccount: {ov: true}}))
                        }}>
                            Remove Account
                        </button>
                    </div>
                </div>
                <hr/>
            </div>

        </div>

    );
};

export default Profile;
