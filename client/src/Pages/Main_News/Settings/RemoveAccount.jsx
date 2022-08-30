import React, {useEffect, useState} from 'react';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css';
import RemoveUser from "../../../Components/Icon/RemoveUser";
import {GetOverlayRx, LogoutRx} from "../../../Actions";
import {useDispatch, useSelector} from "react-redux";
import Logout from "../../../Components/LoginRegister/Logout";
import VariableStyle from "../../../Assets/scss/VariableTwo.module.css";
import {useLocation} from "react-router-dom";

const RemoveAccount = () => {

    const dispatch = useDispatch();
    const location = useLocation()
    const overlay = useSelector((state) => state.overlay)

    const DeleteAccount = async () => {
        try {
            const res = await fetch('https://njanchor.com/home/delete', {
                method: "GET",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
            });
            const parseRes = await res.json()
            if (parseRes === true) {
                await Logout()
                dispatch(LogoutRx())
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        dispatch(GetOverlayRx({removeAccount: {ov: false}}))
    }, [location.pathname]);


    return (
        <React.Fragment>
            {overlay.removeAccount.ov &&
                <div onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    dispatch(GetOverlayRx({removeAccount: {ov: false}}))
                }
                } className={VariableStyle.PopUpOverlayTwo}>
                    <div className={SettingStyle.RemovePopUp}>
                        <div>
                            <RemoveUser size={50}/> <span>Are you sure you want to remove your account ?</span>
                        </div>
                        <div>
                            <button onClick={DeleteAccount}>
                                Yes Delete Account
                            </button>
                            <button onClick={()=>{
                                dispatch(GetOverlayRx({removeAccount: {ov: false}}))
                            }
                            }>
                                No Retain Account
                            </button>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    );
};


export default RemoveAccount;


