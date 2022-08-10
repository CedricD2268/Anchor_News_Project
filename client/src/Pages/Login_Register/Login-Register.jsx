import React, {useEffect,useState} from 'react';
import '../../Assets/scss/Login_Register/login_register.module.css';
import login_register_logo from "../../Assets/Images/website_logo_images/website_logo_3_5.png";
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import {useLocation} from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components';
import Register from "./Register";
import Login from "./Login";
import background from "../../Assets/Images/website_background_images/websiteBackground01.jpeg"
import profileIcon from "../../Components/Icon/ProfileIcon";
import { renderToStaticMarkup } from 'react-dom/server';
import AnchorLogoIcon from "../../Components/Icon/AnchorLogoIcon";



const GlobalStyle = createGlobalStyle`
  body {
    

    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overscroll-behavior: none;
    background-image: url(${(background)});
    background-size: cover;
  }
`


const LoginRegister = ({pageName, pageUrlName}) => {
    const [pageN, setPageN] = useState(pageName);
    const [pageUrlN, setPageUrlN] = useState(pageUrlName);

    const location = useLocation();

    useEffect(()=>{
        setPageN(pageName)
        setPageUrlN(pageUrlName)
    },[location.pathname])



    return (
        <React.Fragment>
            <GlobalStyle/>
                <div className={LoginRegisterStyle.wrapper}>
                <div className={[LoginRegisterStyle.loginRegisterBox, LoginRegisterStyle.loginBox].join(' ')}>
                    <div className={LoginRegisterStyle.loginRegisterHead}>
                        <div className={LoginRegisterStyle.loginRegisterLogo}>
                            <AnchorLogoIcon size={70}/>
                        </div>
                        <div className={LoginRegisterStyle.loginRegisterHeadText}>
                            <span>{pageN}</span>
                        </div>
                    </div>
                    {pageUrlN}
                </div>
            </div>
        </React.Fragment>
    );
};

export default LoginRegister;


