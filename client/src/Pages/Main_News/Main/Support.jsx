import React, {useEffect, useRef, useState} from 'react'
import MainStyle from '../../../Assets/scss/Main_News/Main.module.css';
import {GetOverlayRx, LogoutRx} from "../../../Actions";
import {GrClose} from "react-icons/all";
import VariableStyle from "../../../Assets/scss/VariableTwo.module.css";
import update from "react-addons-update";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";


const Support = () => {

    const form = useRef();
    const overlay = useSelector((state) => state.overlay)
    const profile = useSelector((state) => state.profileView);
    const location = useLocation()
    const dispatch = useDispatch()
    const [toSend, setToSend] = useState({
        name: profile.fullname,
        email: profile.email,
        subject: '',
        message: '',
    });


    const handleChange = (e) => {
        setToSend(update(toSend, {$merge: {[e.target.name]: e.target.value}}));
    };


    const sendEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://njanchor.com/service/sent_email', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(toSend)
            });
            await res.json()
        } catch (err) {
            console.error(err.message)
        }
    };

    useEffect(() => {
        dispatch(GetOverlayRx({
            support: {
                ov: false
            }
        }))
    }, [location.pathname]);


    return (
        <React.Fragment>
            {overlay.support.ov &&
                <div className={VariableStyle.PopUpOverlayTwo} onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    dispatch(GetOverlayRx({support: {ov: false}}))
                }}>
                    <form ref={form} className={MainStyle.SupportBox} onSubmit={sendEmail}>
                        <div className={MainStyle.SupportCloseTitle}>
                            <span>Support</span>
                            <button onClick={()=>{
                                dispatch(GetOverlayRx({
                                    support: {
                                        ov: false
                                    }
                                }))
                            }}><GrClose size={20}/></button>
                        </div>
                        <div>
                            <label>Subject</label>
                            <input type={'text'} placeholder={'Enter subject name'} name={'subject'}
                                   onChange={handleChange}/>
                        </div>
                        <div className={MainStyle.SupportMessageBox}>
                            <label>Message</label>
                            <textarea cols={30} rows={8} placeholder={'Must be at least 300 characters'}
                                      name={'message'} onChange={handleChange}/>
                        </div>
                        <div className={MainStyle.SupportSubmit}>
                            <button type={'submit'} disabled={!(toSend && toSend.message && toSend.subject)}>Submit</button>
                        </div>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}

export default Support