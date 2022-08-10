import React from 'react';
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import { FaExclamationCircle } from "react-icons/fa";


const TextError = ({name}) => {
    return (
        <div className={LoginRegisterStyle.loginRegisterError}><FaExclamationCircle size={19} color={'red'}/><span>{name}</span></div>
    );
};

export default TextError;
