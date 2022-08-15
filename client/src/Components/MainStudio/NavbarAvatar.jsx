import React, {useEffect} from 'react';
import HeaderStyle from "../../Assets/scss/Main_News/Header.module.css";
import {BsFillCaretDownFill} from "react-icons/bs";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {GetOverlayRx} from '../../Actions';
import userface from"../../Assets/Images/UserFaces/user3.png"
import {useNavigate} from "react-router-dom";


const Div = styled.div.attrs(props => ({
    className: props.className
}))`
  color: ${(props) => props.color};
  svg {
    color: ${(props) => props.color};
  }

  img {
    width: ${(props) => props.size};
    filter: dropshadow(0px 0px 0px 2.5px $color_uni_five);
  }
`

const NavbarAvatar = ({SubscribeButtonVisibility, AvatarNameVisibility, Color, ClearFunc, ImgSize}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profile = useSelector((state) => state.profileView);

    const ClearDiv = (e) => {
        dispatch(GetOverlayRx(ClearFunc[0]))
        e.stopPropagation()
    }



    return (
        <div>
            <div className={HeaderStyle.LoginInfo}>
                {SubscribeButtonVisibility && (
                    <React.Fragment>
                        <div className={[HeaderStyle.SubscribeButton, HeaderStyle.DesktopX].join(' ')}>
                            <button onClick={()=>{navigate("/njt/settings/subscription")}}>Subscribe <p className={HeaderStyle.SubscribeDatePrice}><span
                                style={{fontSize: 15}}>/</span> $0.00 Monthly</p></button>
                        </div>

                        {/*<div className={[HeaderStyle.SubscribeButton, HeaderStyle.SubscribeButtonWin, HeaderStyle.DesktopX].join(' ')}>*/}
                        {/*    <button>Subscribed <p className={HeaderStyle.SubscribeDatePrice}>&nbsp;Till 12/23/22</p></button>*/}
                        {/*</div>*/}

                    </React.Fragment>
                )}

                <Div className={HeaderStyle.TrueLogin}
                     color={Color}
                     size={ImgSize}
                >

                    {AvatarNameVisibility && (
                        <p id="UserNameHeader"
                           className={HeaderStyle.DesktopX}>{profile.fullname ? profile.fullname : profile.username}</p>
                    )}
                    <button onClick={ClearDiv}>
                        <img alt="User" src={profile.avatarlocation ? profile.avatarlocation: userface} referrerPolicy={"no-referrer"}/>
                        <BsFillCaretDownFill size={11}/>
                    </button>
                </Div>
                {/*<div className={HeaderStyle.FalseLogin}>*/}
                {/*    <button >*/}
                {/*        Log In*/}
                {/*    </button>*/}
                {/*    <button >*/}
                {/*        <FaUser size={17}/>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
            {/*<SidebarTwo/>*/}
        </div>

    );
};

NavbarAvatar.defaultProps = {
    AvatarNameVisibility: false,
    SubscribeButtonVisibility: false,
    Color: '#002329',
    ImgSize: '32px'
};

export default NavbarAvatar;