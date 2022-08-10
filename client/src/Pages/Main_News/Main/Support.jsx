import React, {useEffect, useRef, useState} from 'react'
import MainStyle from '../../../Assets/scss/Main_News/Main.module.css';
import {GetOverlayRx} from "../../../Actions";
import {GrClose} from "react-icons/all";
import VariableStyle from "../../../Assets/scss/VariableTwo.module.css";
import emailjs from '@emailjs/browser';
import update from "react-addons-update";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";


const Support = () => {

    const form = useRef();
    const overlay = useSelector((state) => state.overlay)
    const location = useLocation()
    const dispatch = useDispatch()
    const [toSend, setToSend] = useState({
        name: 'KarateMan',
        email: 'hell@gmail.com',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setToSend(update(toSend, {$merge: {[e.target.name]: e.target.value}}));
    };


      const sendEmail = (e) => {
          e.preventDefault();

          emailjs.send(process.env.REACT_APP_EMAILJS_SERVICE_ID, process.env.REACT_APP_EMAILJS_TEMPLATE_ID, toSend, process.env.REACT_APP_EMAILJS_PUBLIC_KEY)
              .then((result) => {
                  console.log(result.text);
              }, (error) => {
                  console.log(error.text);
              });
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
                            <button type={'submit'}>Submit</button>
                        </div>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}

export default Support