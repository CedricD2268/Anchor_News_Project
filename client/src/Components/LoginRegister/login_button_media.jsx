import React, {useEffect} from 'react';
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'

import { useDispatch} from 'react-redux';
import {LoginRx} from "../../Actions";
import {MediaLoginErrorRx} from "../../Actions";
import {AiFillGoogleCircle, BsGoogle, GrGoogle} from "react-icons/all";
import {GoogleOAuthProvider, hasGrantedAnyScopeGoogle, useGoogleLogin, useGoogleOneTapLogin} from "@react-oauth/google";
import { GoogleLogin } from '@react-oauth/google';
import styled from "styled-components";
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from '@react-hook/window-size'


const ButtonDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;


const LoginButtonMedia = ({google_t}) => {
    const dispatch = useDispatch()
    const w_width = useWindowWidth()

    const handleLogin = async (googleData) => {
        const bodyData = {"token": googleData.credential}
        try {
            const response = await fetch('https://njanchor.com/auth/google/verify', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(bodyData)
            });
            const parseRes = await response.json();
            console.log(parseRes)
            if (parseRes.token) {
                dispatch(LoginRx());
            }else{
                dispatch(MediaLoginErrorRx(parseRes));
                console.log(parseRes)
            }

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }


    return (
        <React.Fragment>
            <div className={LoginRegisterStyle.loginRegisterButtons}>
                <div className={LoginRegisterStyle.loginButton}>

                    <ButtonDiv>
                        <GoogleLogin
                            useOneTap
                            // theme={"filled_blue"}
                            type={'standard'}
                            size={'large'}
                            shape={'pill'}
                            width={w_width < 400 ? '250px' : '300px'}
                            onSuccess={async (credentialResponse) => {
                                handleLogin(credentialResponse)
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </ButtonDiv>
                </div>
            </div>


        </React.Fragment>
    );
};

export default LoginButtonMedia;
