import React, {useEffect} from 'react';
import SideMenuStyle from '../../../Assets/scss/Main_News/Sidebar.module.css';
import SettingsIconTwo from "../../../Components/Icon/SettingsIconTwo";
import CreativeIcon from "../../../Components/Icon/CreativeIcon";
import SupportIcon from "../../../Components/Icon/SupportIcon";
import {IoCloseSharp} from "react-icons/io5";
import ProfileIcon from "../../../Components/Icon/ProfileIcon";
import {NavLink, Link, useLocation} from 'react-router-dom';
import BillingIcon from "../../../Components/Icon/BillingIcon";
import CustomizeIcon from "../../../Components/Icon/CustomizeIcon";
import {useDispatch, useSelector} from 'react-redux';
import {GetOverlayRx, LogoutRx} from '../../../Actions';
import Logout from "../../../Components/LoginRegister/Logout";
import userface from "../../../Assets/Images/UserFaces/user3.png";
import AnchorLogoIcon from "../../../Components/Icon/AnchorLogoIcon";
import UseWindowSize from "../../../Components/MainStudio/UseWindowSize";


const SidebarTwo = ({OverlayRX, Radius, MarginTop, MarginRight, Home}) => {

    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profileView);
    const location = useLocation();
    const size = UseWindowSize()



    function CloseClickXX() {
        dispatch(GetOverlayRx({sidebarTwo: false}))
        dispatch(GetOverlayRx({sidebarThree: false}))
        dispatch(GetOverlayRx({sidebarFour: false}))
    }

    const SignOut = async(e) => {
        e.preventDefault()
        dispatch(GetOverlayRx({sidebarTwo: false}))
        dispatch(GetOverlayRx({sidebarThree: false}))
        dispatch(GetOverlayRx({sidebarFour: false}))
        await Logout();
        dispatch(LogoutRx());

    }

    const ClearDivs = () => {
        document.addEventListener('click', function (e) {
            e.stopPropagation()
            if (e.target.parentElement) {
                const xClose = e.target.parentElement.className
                if (!xClose.toString().includes("Sidebar_SidebarTwo")) {
                    dispatch(GetOverlayRx({sidebarTwo: false}))
                    dispatch(GetOverlayRx({sidebarThree: false}))
                    dispatch(GetOverlayRx({sidebarFour: false}))
                }
            }

        })
    }

    useEffect(() => {
        ClearDivs()
    }, []);

    useEffect(() => {
        CloseClickXX()
    }, [size.width, location.pathname]);

    return (

        <React.Fragment>
            {OverlayRX && (
                <div  className={SideMenuStyle.SidebarTwoSS}>
                    <div className={SideMenuStyle.SidebarTwo}
                         style={{borderRadius: Radius, marginTop: MarginTop, marginRight: MarginRight}}>
                        <div className={SideMenuStyle.SidebarTwoClose}>
                            <button onClick={CloseClickXX}><IoCloseSharp size={35} color={'white'}/></button>
                        </div>
                        <div className={SideMenuStyle.SidebarTwoUserInfo}>
                            <img alt='user photo' src={profile.avatarlocation ? profile.avatarlocation : userface }/>
                            <div className={SideMenuStyle.SidebarTwoUserInfoId}>
                            <span>
                                {profile.email ? profile.email : profile.username}
                            </span>
                                {Home ?
                                    <Link to='settings/profile'>
                                        <button>Edit profile</button>
                                    </Link> :
                                    <a>
                                        <button
                                            onClick={() => {
                                                window.location.href = "/njt/settings/profile"
                                            }}>
                                            Edit profile
                                        </button>
                                    </a>
                                }

                            </div>
                        </div>
                        <ul id='SideMenuStyle_SidebarTwoListButton'
                            className={[SideMenuStyle.SidebarTwoListButton, SideMenuStyle.SidebarTwoListButtonOne].join(' ')}>
                            <li>
                                {Home ?
                                    <NavLink to='settings/profile'>
                                        <button><SettingsIconTwo/>Settings</button>
                                    </NavLink> :
                                    <button
                                        onClick={() => {
                                            window.location.href = "/njt/settings/profile"
                                        }}>
                                        <SettingsIconTwo/>Settings
                                    </button>
                                }
                            </li>

                            <li>
                                {Home ?
                                    <button
                                        onClick={() => {
                                            window.location.href = "/studio/home/my-home"
                                        }}>
                                        <CreativeIcon/>Anchor Studio
                                    </button>
                                :
                                <button
                                    onClick={() => {
                                        window.location.href = `/njt/home/saved/${profile.defaulttopic}`
                                    }}>
                                    <AnchorLogoIcon/>Anchor Stories
                                </button>
                            }
                            </li>
                            <li>
                                <button onClick={() => {
                                    dispatch(GetOverlayRx({
                                        support: {
                                            ov: true
                                        }
                                    }))
                            }}><SupportIcon/>
                                    <span>Support</span>
                                </button>
                            </li>
                            <li className={SideMenuStyle.SidebarTwoListButtonSignIn}>
                                <button onClick={SignOut}>Sign out</button>
                            </li>
                        </ul>
                        <ul className={[SideMenuStyle.SidebarTwoListButton, SideMenuStyle.SidebarTwoListButtonTwo].join(' ')}>
                            <li>
                                {Home ?
                                    <Link to='settings/profile'>
                                        <button><ProfileIcon/>Profile</button>
                                    </Link> :
                                    <a>
                                        <button
                                            onClick={() => {
                                                window.location.href = "/njt/settings/profile"
                                            }}>
                                            <ProfileIcon/>Profile
                                        </button>
                                    </a>
                                }
                            </li>

                            <li>
                                {Home ?
                                    <Link to='settings/subscription'>
                                        <button><BillingIcon color={'white'}/>Billing</button>
                                    </Link> :
                                    <a>
                                        <button
                                            onClick={() => {
                                                window.location.href = "/njt/settings/subscription"
                                            }}>
                                            <BillingIcon color={'white'}/>Billing
                                        </button>
                                    </a>
                                }
                            </li>
                            <li>
                                {Home ?
                                    <Link to='settings/customize'>
                                        <button><CustomizeIcon color={'white'}/>Customize</button>
                                    </Link> :
                                    <a>
                                        <button
                                            onClick={() => {
                                                window.location.href = "/njt/settings/customize"
                                            }}>
                                            <CustomizeIcon color={'white'}/>Customize
                                        </button>
                                    </a>
                                }
                            </li>
                            <li>
                                {Home ?
                                    <button
                                        onClick={() => {
                                            window.location.href = "/studio/home/my-home"
                                        }}>
                                        <CreativeIcon/>Anchor Studio
                                    </button>
                                    :
                                    <button
                                        onClick={() => {
                                            window.location.href = `/njt/home/saved/${profile.defaulttopic}`
                                        }}>
                                        <AnchorLogoIcon/>Anchor Stories
                                    </button>
                                }
                            </li>
                            <li>
                                <button onClick={() => {
                                    dispatch(GetOverlayRx({
                                        support: {
                                            ov: true
                                        }
                                    }))
                            }}><SupportIcon/><span>Support</span></button>
                            </li>
                            <li className={SideMenuStyle.SidebarTwoListButtonSignIn}>
                                <button onClick={SignOut}>Sign out</button>
                            </li>
                        </ul>
                    </div>
                </div>)}


        </React.Fragment>


    );
};

SidebarTwo.defaultProps = {
    OverlayRX: false,
    Home: true,
    Radius: '4px',
    MarginTop: '55px',
    MarginRight: '0px'
};

export default SidebarTwo;
