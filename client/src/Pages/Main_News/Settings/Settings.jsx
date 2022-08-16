import React, {useEffect, useRef, useState} from 'react';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css';
import ProfileIcon from "../../../Components/Icon/ProfileIcon";
import PasswordIcon from "../../../Components/Icon/PasswordIcon";
import BillingIcon from "../../../Components/Icon/BillingIcon";
import SubscriptionIcon from "../../../Components/Icon/SubscriptionIcon";
import CustomizeIcon from "../../../Components/Icon/CustomizeIcon";
import {BsFillCaretRightFill} from "react-icons/bs";
import Profile from "./Profile";
import Password from "./Password";
import Billing from "./Billing";
import Subscription from "./subscription";
import Customize from "./Customize";
import {NavLink, useLocation} from "react-router-dom";
import {Route, Routes, Navigate} from "react-router-dom";
import styles from "../../../Assets/scss/Main_News/Base.module.css";
import UseWindowSize from "../../../Components/MainStudio/UseWindowSize";


const Settings = () => {
    const location = useLocation()
    const size = UseWindowSize()

    function SidebarResize() {
        const container = document.querySelector('#SettingStyle_Sidebar');
        const matches = container.querySelectorAll("div");
        const settingP = document.querySelector('#SettingStyle_SettingPage');
        const profileDiv = document.querySelector('#SettingProfileDiv');
        const passwordDiv = document.querySelector('#SettingPasswordDiv');
        const billingDiv = document.querySelector('#SettingBillingDiv');
        const subscriptionDiv = document.querySelector('#SettingSubscriptionDiv');
        const customizeDiv = document.querySelector('#SettingCustomizeDiv');
        let Xd = 0
        for (let div of matches) {
            if (window.matchMedia("(max-width: 791px)").matches) {
                if (div.classList.contains(SettingStyle.ToggleSidebarButton)) {
                    let name = div.querySelector('span').innerHTML;
                    if (name === 'Profile' || name === 'Password') {
                        billingDiv.style.display = 'none';
                        subscriptionDiv.style.display = 'none';
                        customizeDiv.style.display = 'none';
                        break;
                    }
                    if (name === 'Billing' || name === 'Subscription') {
                        profileDiv.style.display = 'none';
                        passwordDiv.style.display = 'none';
                        customizeDiv.style.display = 'none';
                        break;
                    }
                    if (name === 'Customize') {

                        profileDiv.style.display = 'none';
                        passwordDiv.style.display = 'none';
                        billingDiv.style.display = 'none';
                        subscriptionDiv.style.display = 'none';
                        break;
                    }
                }
                else {
                    Xd += 1;
                    if (Xd === 5) {
                        profileDiv.style.display = 'block';
                        passwordDiv.style.display = 'block';
                        billingDiv.style.display = 'none';
                        subscriptionDiv.style.display = 'none';
                        customizeDiv.style.display = 'none';
                    }
                }
            }
            else {
                profileDiv.style.display = 'block';
                passwordDiv.style.display = 'block';
                billingDiv.style.display = 'block';
                subscriptionDiv.style.display = 'block';
                customizeDiv.style.display = 'block';
            }
        }
    }

    const ButtonSelected = () => {
        const SettingUrlList = [
            'settings/Profile',
            'settings/Password',
            'settings/Billing',
            'settings/Subscription',
            'settings/Customize'
        ]
        const currentUrl = window.location.href;
        SettingUrlList.forEach(element => {
            const buttonCssX = element.slice(9);
            document.querySelector('#Setting'+ buttonCssX + 'Div').classList.remove(SettingStyle.ToggleSidebarButton);
            if (currentUrl.includes(element.toLowerCase())) {
                const buttonCss = element.slice(9);
                document.querySelector('#Setting'+ buttonCss + 'Div').classList.add(SettingStyle.ToggleSidebarButton);
            }
        })
    }


    useEffect(() => {
        ButtonSelected()
    }, [location.pathname]);

    useEffect(() =>
            SidebarResize()
        , [size.width]);


    return (
        <div id='SettingsPage101' className={styles.wrapper}>
            <div id='SettingStyle_SettingPage' className={SettingStyle.SettingPage}>
                <div id='SettingStyle_Sidebar' className={SettingStyle.Sidebar}>
                    <div id='SettingProfileDiv'>
                        <NavLink  to='profile'>
                        <button><ProfileIcon color={'black'} size={24}/>
                            <span>Profile</span>
                            <BsFillCaretRightFill color={'black'} size={20}/>
                        </button>
                            </NavLink>
                        <hr/>
                    </div>
                    <div id='SettingPasswordDiv'>
                        <NavLink to='password'>
                        <button><PasswordIcon color={'black'} size={24}/><span>Password</span><BsFillCaretRightFill
                            color={'black'} size={20}/></button>
                        </NavLink>
                        <hr/>
                    </div>
                    <div id='SettingBillingDiv'>
                        <NavLink to='billing'>
                        <button><BillingIcon size={24}/><span>Billing</span><BsFillCaretRightFill color={'black'} size={20}/></button>
                        </NavLink>
                            <hr/>
                    </div>
                    <div id='SettingSubscriptionDiv'>
                        <NavLink to='subscription'>
                        <button><SubscriptionIcon color={'black'} size={24}/><span>Subscription</span><BsFillCaretRightFill color={'black'} size={20}/></button>
                        </NavLink>
                        <hr/>
                    </div>
                    <div id='SettingCustomizeDiv'>
                        <NavLink to='customize'>
                        <button><CustomizeIcon color={'black'} size={24}/><span>Customize</span><BsFillCaretRightFill
                            color={'black'} size={20}/></button>
                        </NavLink>
                        <hr/>
                    </div>
                </div>
                <div className={SettingStyle.Main}>
                    <Routes>
                        <Route exact path={`profile`} element={<Profile/>}/>
                        <Route exact path={'billing'} element={<Billing/>}/>
                        <Route exact path={'subscription'} element={<Subscription/>}/>
                        <Route exact path={'customize'} element={<Customize/>}/>
                        <Route exact path={'password'} element={<Password/>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </div>
            </div>

        </div>
    );
};

// Settings.defaultProps = {
//     match: 'settings/',
// };

export default Settings;
