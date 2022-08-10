import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import MainStyle from '../../Assets/scss/Main_News/Main.module.css'
import AnchorTwoIcon from "../../Components/Icon/AnchorTwoIcon";
import BackIcon from "../../Components/Icon/FooterIcons/BackIcon";
import NextIcon from "../../Components/Icon/FooterIcons/NextIcon";
import {NavLink} from "react-router-dom";
import styles from "../../Assets/scss/Main_News/Base.module.css";
import HeaderStyle from "../../Assets/scss/Main_News/Header.module.css";
import {GiHamburgerMenu} from "react-icons/gi";
import { FaArrowAltCircleUp } from "react-icons/fa";
import styled from "styled-components";
import UseWindowSize from "./UseWindowSize";
import {TbArrowBigUpLines} from "react-icons/all";
import {useSelector} from "react-redux";



const Navbar = styled.div.attrs(props => ({
    className: props.className
}))`
  width: 100%;
  display: ${(props)=> props.display};
  flex-direction: row;
  align-items: center;
  transition:  .3s;
  transition-duration: .5s;
  transition-delay: .2s;
  margin-top: ${(props) => props.marginTop};

`

const NavbarButtonTopic = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  width: 100%;
  height: 60px;

  overflow-x: auto;
  scroll-behavior: smooth;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-color: transparent transparent;
  scrollbar-width: 0;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:vertical {
    width: 0;
  }
  &::-webkit-scrollbar:horizontal {
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: transparent;
    opacity: 0;
  }
  @media screen and (max-width: 990px) {
    gap: 10px !important;
  }
  button {
    box-shadow: 0 1px 5px rgba(104, 104, 104, 0.6);
    padding: 10px;
    width: 100%;
    height: ${(props) => props.height};
    max-width: ${(props) => props.maxWidth};
    min-width: ${(props) => props.minWidth};
    font-size: ${(props)=> props.fontSize};
    gap: 6px;
    @media screen and (max-width: ${(props)=>props.windowWidth}) {
      height: 37px !important;
      font-size: 15.7px !important;
    }
  }
`

const ButtonFB = styled.div.attrs(props => ({
    className: props.className
}))`
  @media screen and (min-width: ${(props)=>props.windowWidth}) {
    display: none;
  }
`





const NavbarButtons = ({Fixed, buttonClick}) => {
    const [content, setContent] = useState(true)
    const [margin, setMargin] = useState('-65px')
    const [display, setDisplay] = useState('none')
    const [buttonSize, setButtonSize] = useState({height: '42px', maxWidth: '200px', fontSize: '16.8px', minWidth: '158px'})
    const [windowWidth, setWindowWidth] = useState('860px')
    const size = UseWindowSize()
    const ButtonsRef = useRef()
    const profile = useSelector((state) => state.profileView);
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname.split('/njt/home/saved/')[1]


    const UrlList = () => {
        const SettingUrlList = [
            `/njt/home/saved/${profile && profile.topicone ? profile.topicone.replace(/\s/g, '%20') : ''}`,
            `/njt/home/saved/${profile && profile.topictwo ? profile.topictwo.replace(/\s/g, '%20') : ''}`,
            `/njt/home/saved/${profile && profile.topicthree ? profile.topicthree.replace(/\s/g, '%20') : ''}`,
            `/njt/home/saved/${profile && profile.topicfour ? profile.topicfour.replace(/\s/g, '%20') : ''}`,
            `/njt/home/saved/${profile && profile.topicfive ? profile.topicfive.replace(/\s/g, '%20') : ''}`
        ]

        return (SettingUrlList)
    }

    const [SettingUrlList, setSettingUrlList] = useState(UrlList())

    const HeaderButtonsScroll = () => {
        const forwardB = document.querySelectorAll(`.${MainStyle.HeaderButtonsForward}`);
        const backwardB = document.querySelectorAll(`.${MainStyle.HeaderButtonsBack}`);
        const scrollP = document.querySelectorAll(`.${MainStyle.HeaderButtonsTopics}`)
        forwardB.forEach(function (e) {
            e.onclick = function () {
                scrollP.forEach(function (e) {
                    e.scrollLeft += 200
                })
            }
        })
        backwardB.forEach(function (e) {
            e.onclick = function () {
                scrollP.forEach(function (e) {
                    e.scrollLeft -= 200
                })
            }
        })
        let scrollN = 0;
        for (let i = 0; i < SettingUrlList.length; i++) {
            if (window.matchMedia(`(max-width:  ${windowWidth}`).matches && SettingUrlList[i].replace(/\s/g, '%20') === location.pathname) {
                scrollP.forEach(function (e) {
                    e.scrollLeft = scrollN
                })
            }
            scrollN += 150;
        }
    };

    const ButtonSelected = () => {
        const allButtons = ButtonsRef.current.querySelectorAll("button")
        // const currentPath = location.pathname.split('/njt/home/saved/')[1]
        for (let element of allButtons) {
            if (SettingUrlList.includes(location.pathname)) {
                const button = element
                element = element.textContent.replace(/\s/g, '%20')
                if (element === currentPath){
                    button.classList.add(MainStyle.ToggleButton)
                }else{
                    if(button.classList.contains(MainStyle.ToggleButton)){
                        button.classList.remove(MainStyle.ToggleButton)
                    }
                }
            }
        }
    }

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    useEffect(() => {
        if (Fixed) {
            setButtonSize({height: '35px', maxWidth: '176px', fontSize: '15.2px', minWidth: '140px'})
            setWindowWidth('990px');
            if (window.matchMedia("(max-width: 400px)").matches) {
                setContent(false)
            }
        }
        window.addEventListener("scroll", (event) => {
            if (window.matchMedia("(max-width: 990px)").matches) {
                setMargin(window.pageYOffset >= 133 ? 0 : '-65px')
            } else if (window.matchMedia("(min-width: 990px)").matches) {
                setMargin(window.pageYOffset >= 180 ? 0 : '-65px')
            }
        })
    }, []);

    useEffect(() => {
        if (Fixed) {
            setDisplay('flex')
        }else{
            setDisplay(SettingUrlList.includes(location.pathname) ? 'flex': 'none')
        }
        ButtonSelected();
        setSettingUrlList(UrlList())
    }, [location.pathname, content]);

    useEffect(() => {
        const newList = []
        for(const element of SettingUrlList){
            newList.push(element.split('/njt/home/saved/')[1])
        }
        if(!newList.includes(currentPath) && location.pathname.slice(0,16) === '/njt/home/saved/'){
            navigate(`home/saved/${profile.defaulttopic}`)
        }

    }, [location.pathname]);


    useEffect(() => {
        HeaderButtonsScroll()
        if (Fixed  && size.width < 700) {
            setContent(false)
        }else{
            setContent(UrlList().includes(location.pathname))
        }
    }, [size.width, location.pathname]);


    return (
        <Navbar
            className={Fixed ? MainStyle.NavbarButtons : null}
                marginTop={Fixed? margin: 0}
                display={display}
        >
            <div className={styles.wrapper}>
                <div className={HeaderStyle.NavbarButtons} ref={ButtonsRef}>
                    {Fixed &&  (
                        <div className={HeaderStyle.menuButton} style={{marginTop: -0.2}}>
                            <button onClick={buttonClick}>
                                <GiHamburgerMenu size="19px" color={'black'}/>
                            </button>
                        </div>
                    )}
                    {content  ? (
                        <React.Fragment>
                            {size.width > 440 &&
                                <ButtonFB className={MainStyle.HeaderButtonsBack} windowWidth={windowWidth}>
                                    <button>
                                        <BackIcon size={30}/>
                                    </button>
                                </ButtonFB>
                            }
                            <NavbarButtonTopic className={MainStyle.HeaderButtonsTopics}
                                               height={buttonSize.height}
                                               maxWidth={buttonSize.maxWidth}
                                               minWidth={buttonSize.minWidth}
                                               fontSize={buttonSize.fontSize}
                                               windowWidth={windowWidth}>

                                <NavLink to={`home/saved/${profile.topicone}`}>
                                    <button><span>{profile.topicone}</span>
                                        { profile.defaulttopic === profile.topicone &&
                                            <AnchorTwoIcon size={21}/>
                                        }
                                    </button>
                                </NavLink>
                                <NavLink to={`home/saved/${profile.topictwo}`}>
                                    <button><span>{profile.topictwo}</span>
                                        { profile.defaulttopic === profile.topictwo &&
                                            <AnchorTwoIcon size={21}/>
                                        }
                                    </button>
                                </NavLink>
                                <NavLink to={`home/saved/${profile.topicthree}`}>
                                    <button><span>{profile.topicthree}</span>
                                        { profile.defaulttopic === profile.topicthree &&
                                            <AnchorTwoIcon size={21}/>
                                        }
                                    </button>
                                </NavLink>
                                <NavLink to={`home/saved/${profile.topicfour}`}>
                                    <button><span>{profile.topicfour}</span>
                                        { profile.defaulttopic === profile.topicfour &&
                                            <AnchorTwoIcon size={21}/>
                                        }
                                    </button>
                                </NavLink>
                                <NavLink to={`home/saved/${profile.topicfive}`}>
                                    <button><span>{profile.topicfive}</span>
                                        { profile.defaulttopic === profile.topicfive &&
                                            <AnchorTwoIcon size={21}/>
                                        }
                                    </button>
                                </NavLink>
                            </NavbarButtonTopic>

                            {size.width > 440 &&
                                <ButtonFB className={MainStyle.HeaderButtonsForward} windowWidth={windowWidth}>
                                    <button>
                                        <NextIcon size={30}/>
                                    </button>
                                </ButtonFB>

                            }


                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className={HeaderStyle.HomeLogoImg}>
                                <div onClick={()=>{navigate(`home/saved/${profile.defaulttopic}`)}}>
                                    <AnchorTwoIcon size={27} color={'white'}/>
                                </div>
                            </div>
                        </React.Fragment>
                    )}

                    {Fixed &&(
                        <div className={HeaderStyle.BackToTop}>
                            {size.width > 990 ?
                                <button onClick={goToTop}>Back to top<FaArrowAltCircleUp size={20}/></button>
                                : <button onClick={goToTop} style={{borderRadius: '50%', padding: '7px'}}><TbArrowBigUpLines size={22} color={'white'}/></button> }
                        </div>
                    )}
                </div>
            </div>
        </Navbar>
    );
};

NavbarButtons.defaultProps = {
    Fixed: false,
    Display: 'none'
};

export default NavbarButtons;