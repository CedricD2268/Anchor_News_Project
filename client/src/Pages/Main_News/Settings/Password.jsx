import React, {useEffect, useState} from 'react';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css';
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import TextError from "../../../Components/LoginRegister/text_error";
import {AiFillEye, AiFillEyeInvisible, BsCheckCircleFill} from "react-icons/all";
import update from "react-addons-update";
import PasswordTwoIcon from "../../../Components/Icon/PasswordTwoIcon";
import {LogoutRx, ViewProfileRx} from "../../../Actions";
import {useDispatch, useSelector} from "react-redux";
import Logout from "../../../Components/LoginRegister/Logout";
import {useNavigate} from "react-router-dom";


const Password = () => {

    const [passwordShown, setPasswordShown] = useState({a: false, b: false, c: false});
    const profile = useSelector((state) => state.profileView);
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required("*Field is required"),

        newPassword: Yup.string()
            .required('*Field is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        rePassword: Yup.string()
            .required('*Field is required')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    // get functions to build form with useForm() hook
    const {register, handleSubmit, formState, reset} = useForm(formOptions);
    const {errors} = formState;

    const onSubmit = async (data) => {
        const newData = update(data, {$merge: {email: profile.email}})
        try {
            const res= await fetch('https://njanchor.com/home/update/password', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            const parseRes = await res.json();
            setSuccess(parseRes.success ? true : false)
            setErrorMessage(parseRes.success ? '': parseRes)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }



    return (
        <div>
            <div className={SettingStyle.Header}><PasswordTwoIcon size={60}/> Change password</div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <p style={{fontSize: 18}}> Please provide a strong password to prevent unauthorized access to your
                        account. </p>
                    <ul style={{marginTop: '-8px', marginLeft: '-6px'}}>
                        <li>Minimum length of 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One special character</li>
                    </ul>
                </div>
                <div className={SettingStyle.Password}>
                    <div className={SettingStyle.PasswordDiv}>
                        <label>Current Password</label>
                        <div className={SettingStyle.PasswordInputBox}>
                            <input type={passwordShown.a ? "text" : "password"}
                                   {...register('password')}
                                   name="password"
                                   className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                   placeholder={'Type current password here'}/>
                            <button type='button' onClick={()=>{
                                setPasswordShown(update(passwordShown, {$merge: {a : !passwordShown.a}}))
                            }
                            }>{passwordShown.a ? (<AiFillEye color={'#ccd5ae'} size={20}/>) : (<AiFillEyeInvisible color={'#ccd5ae'} size={20}/>)}</button>
                        </div>
                        {errors.password && <TextError name={errors.password.message}/>}
                        <a href={'http://localhost:3000/accounts/login/identify'} style={{color: '#0077b6', cursor: 'pointer'}} onClick={async() => {
                            await Logout();
                            dispatch(LogoutRx());
                            // navigate('https://www.google.com/')
                        }}>Forgot your password?</a>
                    </div>
                    <div className={SettingStyle.PasswordDiv}>
                        <label>New Password</label>
                        <div className={SettingStyle.PasswordInputBox}>
                            <input type={passwordShown.b ? "text" : "password"}
                                   {...register('newPassword')}
                                   name="newPassword"
                                   className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                   placeholder={'Type new password here'}/>
                            <button type='button' onClick={()=>{
                                setPasswordShown(update(passwordShown, {$merge: {b : !passwordShown.b}}))
                            }

                            }>{passwordShown.b ? (<AiFillEye color={'#ccd5ae'} size={20}/>) : (<AiFillEyeInvisible color={'#ccd5ae'} size={20}/>)} </button>
                        </div>
                        {errors.newPassword && <TextError name={errors.newPassword.message}/>}
                    </div>
                    <div className={SettingStyle.PasswordDiv}>
                        <label>Re-enter Password</label>
                        <div className={SettingStyle.PasswordInputBox}>
                            <input type={passwordShown.c ? "text" : "password"}
                                   {...register('rePassword')}
                                   name="rePassword"
                                   className={`form-control ${errors.rePassword ? 'is-invalid' : ''}`}
                                   placeholder={'Re-type new password here'}/>
                            <button type='button' onClick={()=>{
                                setPasswordShown(update(passwordShown, {$merge: {c : !passwordShown.c}}))
                            }
                            }>{passwordShown.c ? (<AiFillEye color={'#ccd5ae'} size={20}/>) : (<AiFillEyeInvisible color={'#ccd5ae'} size={20}/>)}</button>
                        </div>
                        {errors.rePassword && <TextError name={errors.rePassword.message}/>}
                        {errorMessage && <TextError name={errorMessage}/>}
                        {success &&
                            <div style={{display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', color: 'green'}}>
                                <BsCheckCircleFill size={20} color={'green'}/> Password changed successfully
                            </div>
                        }
                    </div>
                </div>
                <hr/>
                <div className={SettingStyle.MainPortfolioF}>
                    <button type='submit'>Save password changes</button>
                </div>
            </form>
        </div>

    );
};

export default Password;
