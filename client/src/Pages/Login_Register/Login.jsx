import React, {useState} from 'react';
import LoginButtonMedia from "../../Components/LoginRegister/login_button_media";
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import {Link, useNavigate,} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import CloneLogin from "../../Components/LoginRegister/CloneLogin";
import {useForm} from "react-hook-form";
import {LoginRx} from "../../Actions";
import TextError from "../../Components/LoginRegister/text_error";
import ShowHideButton from "../../Components/LoginRegister/show_hide_button";
import CloneLoginInfo from "../../Components/LoginRegister/CloneLoginInfo";


const LoginForm= () => {
    const [showHide, setShowHide] = useState(true)

     const mediaError = useSelector((state) => state.mediaLoginError);
    const navigate = useNavigate()

    const [serverError, setServerError] = useState('')
    // form validation rules
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required( "The email field is required")
            .email('Email entered is invalid'),
        password: Yup.string()
            .required('The password field is required')

    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        try {
            const response = await fetch('https://njanchor.com/auth/login', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await response.json()
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
                <div className={LoginRegisterStyle.loginRegisterInputBox}>
                    <label className="form-label">Email address</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type="email" {...register('email')}
                               name="email"
                               className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                               placeholder="Enter email"/>
                    </div>
                    {errors.email &&<TextError name={errors.email.message}/>}
                </div>
                <div className={[LoginRegisterStyle.loginRegisterInputBox, LoginRegisterStyle.passwordText].join(' ')}>
                    <label className="form-label">Password</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type={showHide ?("password"): ("text")} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password" aria-describedby="button-addon2"
                               placeholder="Enter password"/>
                        <ShowHideButton Name={showHide?('Show'): ('Hide')} showFunction={function(){
                            setShowHide(!showHide)
                        }}/>
                    </div>
                    {errors.password &&<TextError name={errors.password.message}/>}
                    {serverError &&<TextError name={serverError}/>}
                    {mediaError &&<TextError name={mediaError}/>}
                </div>
                <div className={LoginRegisterStyle.forgotPassword}>
                    <a onClick={()=>{
                        navigate('identify')
                    }}>Forgot your password</a>
                </div>
                <div className={LoginRegisterStyle.registerLoginButton}>
                    <button type={'submit'}>Login</button>
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

const Login = () => {
    return (
            <React.Fragment>
                <LoginButtonMedia google_t={"Sign in with Google"}/>
                    <div className={LoginRegisterStyle.hrComment}>
                        <hr className={LoginRegisterStyle.hrLine}/>
                            <span>Or you can use</span>
                            <hr className={LoginRegisterStyle.hrLine} />
                    </div>
                    <LoginForm/>
                    <div className={LoginRegisterStyle.RegisterLoginFooter}>
                        <p>Don't have an account? <Link to='../register'> Sign up</Link></p>
                    </div>
                <CloneLoginInfo/>
            </React.Fragment>
    );
};

export default Login;
