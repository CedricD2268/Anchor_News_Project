import React from 'react'
import {ImNotification} from "react-icons/im";
import LoginRegisterStyle from '../../Assets/scss/Login_Register/login_register.module.css'

const CloneLoginInfo  = () =>{



    return(

            <div className={LoginRegisterStyle.cloneBox}>
                <div className={LoginRegisterStyle.cloneBoxInfo}>

                    <span>Logging in as a clone all data (e.g., articles, comments, likes, libraries and avatars)
                        <span style={{color: '#d90429'}}>
                            will be deleted upon logout
                        </span>
                        .Make sure to log in with your own email or sign in with google if you want to save your data.
                    </span>
                    <span>
                        This web application is still in development, some features might change or completely remove.
                        The studio access button is only accessible on desktop for now.
                        Please dont use the website to save sensitive data because upon future update all data might be deleted.
                        Understand login in only to beta test.
                    </span>

                </div>
            </div>


    )

}

export default CloneLoginInfo;