import React, {useEffect, useState} from 'react';
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm} from "react-hook-form";
import TextError from "../../Components/LoginRegister/text_error";
import {useDispatch} from "react-redux";
import {LoginRx} from "../../Actions";
import {BsCheckCircleFill} from "react-icons/all";


const IdentificationForm= () => {
    // form validation rules
    const dispatch = useDispatch()
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required( "Email field is required.")
            .email('Email entered is invalid.'),

    });



    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, watch, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

    const watchEmail = watch("email", '');

    const  onSubmit = async(data) => {
        try {
            const response = await fetch('https://njanchor.com/auth/identification', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await response.json()
            setSuccess(!!parseRes.email)
            setError(!parseRes.email)
            setErrorMessage(parseRes)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    useEffect(() => {
        setSuccess(false)
    }, [watchEmail]);


    return (
        <div className={LoginRegisterStyle.loginRegisterForm}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={LoginRegisterStyle.loginRegisterInputBox} style={{marginTop: '-20px'}}>
                    <label htmlFor="input-email-login" className="form-label">Email</label>
                    <div className={LoginRegisterStyle.loginRegisterText}>
                        <input type="email" {...register('email')}  name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                               placeholder="Enter email"/>
                    </div>
                    {errors.email && <TextError name={errors.email.message}/>}
                    {error && <TextError name={errorMessage}/>}
                    {success && (
                        <div style={{
                            display: "flex",
                            flexDirection: 'row',
                            gap: '4px',
                            alignItems: 'center',
                            fontSize: '15px',
                            color: 'green'
                        }}>
                           <BsCheckCircleFill size={20} color={'green'}/> Email sent. Please check your email!
                        </div>
                    )}
                </div>
                <div className={LoginRegisterStyle.registerLoginButton}>
                    <button>{success?
                        'Resend link': 'Send link'
                    }</button>
                </div>
            </form>
        </div>
    )
}

const Identification = () => {
    return (
        <React.Fragment>
            <div className={LoginRegisterStyle.hrComment} >
                <hr className={LoginRegisterStyle.hrLine}/>
            </div>
            <p style={{marginTop: '-10px'}}>Enter the email address associated with your account and we'll send you a link to reset your password.</p>
            <IdentificationForm/>
        </React.Fragment>
    );
};

export default Identification;