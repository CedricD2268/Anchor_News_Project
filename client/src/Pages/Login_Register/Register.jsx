import React, {Component, useState} from 'react';
import LoginButtonMedia from "../../Components/LoginRegister/login_button_media";
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {LoginRx} from "../../Actions";
import TextError from "../../Components/LoginRegister/text_error";
import ShowHideButton from "../../Components/LoginRegister/show_hide_button";
import update from "react-addons-update";
import CloneLogin from "../../Components/LoginRegister/CloneLogin";

const RegisterForm = () => {

    const [showHide, setShowHide] = useState({a: true, b:true})
    const [serverError, setServerError] = useState('')
    const mediaError = useSelector((state) => state.mediaLoginError);

    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required( "The email field is required")
            .email('Email entered is invalid'),
        password: Yup.string()
            .required('The password field is required')
            .min(3, 'Password is too short!')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters\n\n One Uppercase\n\n One Lowercase\n\n One Number\n\n One Special Case Character"

          ),
        confirmPassword: Yup.string()
            .required()
            .oneOf([Yup.ref("password"), null], "Passwords must match"),

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;
    const dispatch = useDispatch()


    const onSubmit = async (data) => {
        console.log(JSON.stringify(data))
        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await response.json();
            if (parseRes.token) {
                dispatch(LoginRx());
            }else{
                setServerError(parseRes)
            }
        } catch (err) {
            console.error(err.message);

        }
        return false;
    }

    return (
        <div className={LoginRegisterStyle.loginRegisterForm}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={[LoginRegisterStyle.loginRegisterInputBox, LoginRegisterStyle.emailUsernameText].join(' ')}>
                    <label>Email address</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type="email" name="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="input-email-login"
                               aria-describedby="emailHelp" placeholder="Enter Email"/>
                    </div>
                    {errors.email &&<TextError name={errors.email.message}/>}
                </div>
                <div className={[LoginRegisterStyle.loginRegisterInputBox, LoginRegisterStyle.passwordText].join(' ')}>
                    <label htmlFor="input-password-register1">Password</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type={showHide.a ? ("password"): ("text")} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password"
                                aria-describedby="button-addon2"
                               placeholder="Enter password"/>
                        <ShowHideButton Name={showHide.a ? ("Show"): ("Hide")} showFunction={function(){
                            setShowHide(update(showHide, {$merge: {a: !showHide.a}}))
                        }}/>
                    </div>
                    {errors.password &&<TextError name={errors.password.message}/>}
                </div>
                <div className={[LoginRegisterStyle.loginRegisterInputBox, LoginRegisterStyle.passwordText].join(' ')}>
                    <label htmlFor="input-password-register2">Confirm password</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type={showHide.b ? ("password"): ("text")} {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} name="confirmPassword"
                                aria-describedby="Input-Password-New"
                               placeholder="Re-enter password"/>
                        <ShowHideButton Name={showHide.b ? ("Show"): ("Hide")} showFunction={function(){
                            setShowHide(update(showHide, {$merge: {b: !showHide.b}}))
                        }}/>
                    </div>
                    {errors.confirmPassword &&<TextError name={errors.confirmPassword.message}/>}
                    {serverError &&<TextError name={serverError}/>}
                    {mediaError &&<TextError name={mediaError}/>}
                </div>
                <div className={LoginRegisterStyle.registerLoginButton}>
                    <button type={'submit'}>Register</button>
                </div>
                <div className={LoginRegisterStyle.registerLoginButton}>
                    <button type={'button'} onClick={async()=>{
                        const login = await CloneLogin()
                        if (login)
                            dispatch(LoginRx());
                    }}>Clone Login</button>
                </div>
            </form>
        </div>
    );
};

const Register = () =>{
        return (
            <React.Fragment>
                <LoginButtonMedia google_t={"Register in with Google"}/>
                    <div className={LoginRegisterStyle.hrComment}>
                        <hr className={LoginRegisterStyle.hrLine}/>
                            <span>Or you can use</span>
                            <hr className={LoginRegisterStyle.hrLine} />
                    </div>
                <RegisterForm/>
                    <div className={LoginRegisterStyle.RegisterLoginFooter}>
                        <p id="footer-text-one">Already have an account? <Link to='../login'> Sign in</Link></p>
                    </div>
            </React.Fragment>
        )
}

export default Register;