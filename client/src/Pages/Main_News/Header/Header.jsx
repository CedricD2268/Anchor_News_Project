import React from 'react';
import HeaderStyle from '../../../Assets/scss/Main_News/Header.module.css';
import '../../../Assets/scss/Main_News/Sidebar.module.css';
import {GiHamburgerMenu} from "react-icons/gi";
import HeaderForm from "./Header_Form";
import HeaderWeather from "./Header_Weather";
import HeaderPromo from "./Header_Promo";
import NavbarAvatar from "../../../Components/MainStudio/NavbarAvatar";
import {useSelector} from "react-redux";
import LogoOneIcon from "../../../Components/Icon/LogoOneIcon";
import LogoTwoIcon from "../../../Components/Icon/LogoTwoIcon";
// import UseWindowSize from "../../../Components/MainStudio/UseWindowSize";
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from '@react-hook/window-size'
import {useNavigate} from "react-router-dom";


const Header = ({buttonClick}) => {

    const size = useWindowWidth();
    const navigate = useNavigate()
    const profile = useSelector((state) => state.profileView);
    const overlay = useSelector((state) => state.overlay)

    return (
        <div>
            <div className={HeaderStyle.header}>
                {/*LEFT HEADER */}
                <div className={HeaderStyle.headerA}>
                    {/*TOP LEFT HEADER*/}
                    <divf className={HeaderStyle.headerATop}>
                        {/*TOP MENU BUTTON*/}
                        <div className={HeaderStyle.menuButton}>
                            <button onClick={buttonClick}>
                                <GiHamburgerMenu size="19px" color={'black'}/>
                            </button>
                        </div>
                        {/*TOP SEARCH INPUT FORM*/}
                        <HeaderForm/>
                    </divf>
                    {/*BOTTOM LEFT HEADER*/}
                    <div className={[HeaderStyle.headerABottom, HeaderStyle.DesktopX].join(' ')}>
                        {/*BOTTOM DATE AND PROMOTIONAL AD*/}
                        <HeaderPromo/>
                    </div>
                </div>

                {/*MIDDLE HEADER*/}
                <div className={HeaderStyle.HeaderB} onClick={()=>navigate(`/njt/home/saved/${profile.defaulttopic}`)}>
                    <LogoOneIcon width={330} height={120}/>
                    <LogoTwoIcon width={(size < 580 && size > 450) ? 300: size < 451 ? 260: 380 }
                                 height={(size < 580 && size > 450) ? 70: size < 451 ? 60: 90}/>
                </div>

                {/*RIGHT HEADER*/}
                <div className={HeaderStyle.HeaderC}>
                    {/*RIGHT LOGIN INFO (YES OR NO)*/}
                    <NavbarAvatar
                        AvatarNameVisibility={true}
                        SubscribeButtonVisibility={true}
                        ClearFunc={[{sidebarTwo: !overlay.sidebarTwo}, {sidebarTwo: false}]}

                    />
                    {/*BOTTOM RIGHT WEATHER API*/}
                    <HeaderWeather/>
                </div>

            </div>
            <hr className={HeaderStyle.Hr}/>
        </div>

    );
};

export default Header;
