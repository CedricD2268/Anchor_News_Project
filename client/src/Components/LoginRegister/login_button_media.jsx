import React from 'react';
import google_login from "../../Assets/Icons/SocialMedia/google_2.png";
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'
import GoogleLogin from 'react-google-login';
import { useDispatch} from 'react-redux';
import {LoginRx} from "../../Actions";
import {MediaLoginErrorRx} from "../../Actions";
import {AiFillGoogleCircle, BsGoogle, GrGoogle} from "react-icons/all";


const LoginButtonMedia = ({google_t}) => {
    const dispatch = useDispatch()
    const handleFailure = (result) => {
        console.log(result);
    };
    // const handleLogin = (googleData) => {
    //     console.log(googleData.tokenId);
    // };

    const handleLogin = async (googleData) => {
        const bodyData = {"token": googleData.tokenId}
        try {
            const response = await fetch('http://localhost:5000/auth/google/verify', {
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
                    <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                 render={renderProps => (
                                     <button type={'button'} onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                     <AiFillGoogleCircle size={27} />
                                         <span>{google_t}</span>
                                     </button>
                                 )}
                                 buttonText={"Log in with Google"}
                                 onSuccess={handleLogin}
                                 onFailure={handleFailure}
                                 cookiePolicy={"single_host_origin"}>
                    </GoogleLogin>
                </div>
            </div>


        </React.Fragment>
    );
};

export default LoginButtonMedia;
