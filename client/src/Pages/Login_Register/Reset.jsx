import React, {useEffect, useState} from 'react';
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm} from "react-hook-form";
import ShowHideButton from "../../Components/LoginRegister/show_hide_button";
import update from "react-addons-update";
import TextError from "../../Components/LoginRegister/text_error";
import {useNavigate, useParams} from "react-router-dom";


const ResetForm = () => {
    const [showHide, setShowHide] = useState({a: true, b:true})
    const {id, token, email} = useParams()

    // form validation rules
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('The password field is required')
            .min(3, 'errer is too short!')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"

          ),
        confirmPassword: Yup.string()
            .required()
            .oneOf([Yup.ref("password"), null], "Passwords must match"),

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const navigate = useNavigate()
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const onSubmit = async(data) => {
        let newData = update(data, {$merge: {token: token, email: email}})
        try {
            const response = await fetch('http://localhost:5000/auth/reset/password', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            const parseRes = await response.json()
            setSuccess(!!parseRes.password)
            setError(!parseRes.password)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    useEffect(() => {
        if (success){
            navigate('../login')
        }
        console.log(id, token)
    }, [success]);


    return (
        <div className={LoginRegisterStyle.loginRegisterForm}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={[LoginRegisterStyle.loginRegisterInputBox, LoginRegisterStyle.passwordText].join(' ')}>
                    <label htmlFor="input-password-register1">New password</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type={showHide.a ? ("password"): ("text")} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password"
                                aria-describedby="button-addon2"
                               placeholder="Enter new password"/>
                        <ShowHideButton Name={showHide.a ? ("Show"): ("Hide")} showFunction={function(){
                            setShowHide(update(showHide, {$merge: {a: !showHide.a}}))
                        }}/>
                    </div>
                    {errors.password &&<TextError name={errors.password.message}/>}
                </div>
                <div className={[LoginRegisterStyle.loginRegisterInputBox, LoginRegisterStyle.passwordText].join(' ')}>
                    <label htmlFor="input-password-register2">Confirm new password</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type={showHide.b ? ("password"): ("text")} {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} name="confirmPassword"
                                aria-describedby="Input-Password-New"
                               placeholder="Re-enter new password"/>
                        <ShowHideButton Name={showHide.b ? ("Show"): ("Hide")} showFunction={function(){
                            setShowHide(update(showHide, {$merge: {b: !showHide.b}}))
                        }}/>
                    </div>
                </div>
                {error &&<TextError name={'Session has expired.'}/>}
                <div className={LoginRegisterStyle.registerLoginButton}>
                    <button>Reset Password</button>
                </div>
            </form>
        </div>
    );
};





const Reset = () => {
    return (
            <React.Fragment>
                    <div className={LoginRegisterStyle.hrComment}>
                        <hr className={LoginRegisterStyle.hrLine}/>
                    </div>
                            <p style={{marginTop: '-10px'}}>Enter your new password below.
                    </p>
                    <ResetForm/>
            </React.Fragment>
    );
};

export default Reset;