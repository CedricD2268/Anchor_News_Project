import React, {useEffect, useRef, useState} from 'react';
import SideMenuStyle from '../../../Assets/scss/Main_News/Sidebar.module.css';
import {IoCloseSharp, IoHome} from "react-icons/io5";
import {IoMdAdd} from "react-icons/io";
import FollowIcon from '../../../Components/Icon/FollowIcon'
import HistoryIcon from "../../../Components/Icon/HistoryIcon";
import TopicsIcon from "../../../Components/Icon/TopicsIcon";
import UserFaceTwo from '../../../Assets/Images/UserFaces/user3.png'
import SettingsIconOne from "../../../Components/Icon/SettingsIconOne";
import SettingsIconTwo from "../../../Components/Icon/SettingsIconTwo";
import CreativeIcon from "../../../Components/Icon/CreativeIcon";
import AnchorIcon from "../../../Components/Icon/AnchorIcon";
import FaqIcon from "../../../Components/Icon/FaqIcon";
import DropIcon from "../../../Components/Icon/DropIcon";
import {GetArticleTopicTypeName as ArticleSub} from "../../../Components/MainStudio/GetArticleTopicTypeName";
import {animated, useSpring} from 'react-spring';
import update from "react-addons-update";
import FlipFlipSvg from "../../../Components/MainStudio/FlipFlipSvg";
import {HiOutlineFolderOpen, MdOutlineExplore, RiSearchEyeLine, TiArrowSortedDown,} from "react-icons/all";
import {useDispatch, useSelector} from "react-redux";
import {GetOverlayRx} from "../../../Actions";
import AllFollowingList from "../../../Components/MainStudio/AllFollowingList";
import LibraryIcon from "../../../Components/Icon/LibraryIcon";
import LatestIcon from "../../../Components/Icon/LatestIcon";
import LikeHeartIcon from "../../../Components/Icon/LikeHeartIcon";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import SidebarTwo from "./SidebarTwo";
import SupportIcon from "../../../Components/Icon/SupportIcon";

const Span = styled.span`
  display: block;
  margin-left: auto;
  width: 100%;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  justify-content: left;
  font-size: 15px !important;
`;



const Sidebar = ({DisState, Close}) => {

    const [disState, SetDistate] = useState(DisState)
    const profile = useSelector((state) => state.profileView);
    const [topicNames, setTopicNames] = useState()
    const [followList, setFollowList] = useState()
    const [showUl, setShowUl] = useState({a: false, b: false, c: false, d: false})
    const ShowMoreOne = useRef(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [arrayTest, setArrayTest] = useState([1,2,3,4,5,6])
    const [array, setArray] = useState({a: [], b: [], c:[]})
    const followRender = useSelector((state) => state.overlay);


    const [SettingUrlList, setSettingUrlList] = useState([
        profile && profile.topicone ? profile.topicone : '',
        profile && profile.topictwo ? profile.topictwo : '',
        profile && profile.topicthree ? profile.topicthree : '',
        profile && profile.topicfour ? profile.topicfour : '',
        profile && profile.topicfive ? profile.topicfive : ''
    ])

    const ListClick = (e) =>{
        const all_Li = document.querySelector(`.${SideMenuStyle.Wrapper}`)
        const matches = all_Li.querySelectorAll("li button")
        matches.forEach((button)=>{
            button.style.backgroundColor = 'transparent'
        })
        e.target.style.background = '#354f52'
        if (window.matchMedia("(max-width: 1697px ").matches) {
            Close()
        }

    }

    const {left} = useSpring({
        config: {mass:1, tension:150, friction:0, clamp: true},
        from: {left: "-240px"},
        left: DisState ? "0" : "-240px",
    });


    useEffect(async() => {
        let mirror = await ArticleSub('topicNames')
        let mirror2 = await AllFollowingList()
        setTopicNames(await ArticleSub('topicNames'))
        setFollowList(await AllFollowingList())
        setArray(update(array, {$merge: { a: (profile && profile.collection) ? profile.collection.slice(0, 3): [], b: mirror ? mirror.slice(0, 5): [], c : mirror2? mirror2.slice(0, 5): []}}))
    }, [])

    // useEffect(async() => {
    //     SetDistate(DisState)
    // }, [DisState])

    useEffect(() => {
        const svg = ShowMoreOne.current ? ShowMoreOne.current.querySelector('button svg') : ''
        if (svg) {
            svg.style.transform = array.a.length <= 3 ? 'rotate(0deg)': 'rotate(180deg)'
        }
    }, [showUl.a])

    useEffect(() => {
        setArray(update(array, {$merge: { a: (profile && profile.collection) ? profile.collection.slice(0, 3): []}}))
    }, [profile.collection])

    useEffect(async() => {
        let mirror2 = await AllFollowingList()
        setFollowList(await AllFollowingList())
        setArray(update(array, {$merge: { c: mirror2 ? mirror2.slice(0, 5): []}}))
    }, [followRender.sidebarFollowListRender])



    useEffect(() => {
            const svg = ShowMoreOne.current ? ShowMoreOne.current.querySelector('button svg') : ''
            if (svg) {
                svg.style.transform = 'rotate(0deg)'
            }
    }, [profile.collection.length])

    // useEffect(() => {
    //     setSettingUrlList([
    //         profile && profile.topicone ? profile.topicone : '',
    //         profile && profile.topictwo ? profile.topictwo : '',
    //         profile && profile.topicthree ? profile.topicthree : '',
    //         profile && profile.topicfour ? profile.topicfour : '',
    //         profile && profile.topicfive ? profile.topicfive : ''
    //     ])
    // }, [profile]);


    return (
        <div className={SideMenuStyle.SideMenu}>
            <animated.div id='SidebarPage' style={{ marginLeft: left }}
                          className={SideMenuStyle.SideMenuContent}>
                <div className={SideMenuStyle.SideMenuContentA}>
                    <div className={SideMenuStyle.SideMenuContentAIcon}>
                        <button onClick={Close} >
                            <IoCloseSharp color={'white'} style={{marginTop: 11,marginLeft: 1}} size={28}/>
                        </button>
                    </div>
                    <div className={SideMenuStyle.SideMenuContentAImg}>
                        <button>
                            <LatestIcon size={196}/>
                        </button>
                    </div>
                </div>
                <div id="MD" className={SideMenuStyle.Wrapper}>
                    <div className={SideMenuStyle.SideMenuContentB}>
                        <ul>
                            <li>
                                <button onClick={(e)=>{
                                    navigate(`home/saved/${profile.defaulttopic}`)
                                    ListClick(e)
                                }}>
                                    <IoHome size={19}/>Home
                                </button>
                            </li>
                            <li className={SideMenuStyle.SearchButton}>
                                <button onClick={(e)=>{
                                    navigate('feed/homeT/search/q=')
                                    ListClick(e)
                                }}>
                                    <RiSearchEyeLine  size={21} color={'white'}/>Search
                                </button>
                            </li>
                            <li>
                                <button onClick={(e)=>{
                                    navigate('feed/homeT/allfollowing')
                                    ListClick(e)
                                }}>
                                    <FollowIcon size={21}/>Following
                                </button>
                            </li>
                            <li>
                                <button onClick={(e) => {
                                    setShowUl(update(showUl, {$merge: {a: !showUl.a}}))
                                    FlipFlipSvg(e)
                                }}>
                                    <LibraryIcon size={19.5}/>Library<TiArrowSortedDown
                                    className={SideMenuStyle.DropdownArrow} size={22}/>
                                </button>
                                {showUl.a &&
                                    (
                                        <ul className={SideMenuStyle.SidebarLibraryList}>
                                            <li className={SideMenuStyle.CreateNew} onClick={()=>{
                                                dispatch(GetOverlayRx({sidebarCreate: {ov: true, title: 'Create new collection', listState: false, buttonName: 'Create', collectionName: ''}}))

                                            }}><IoMdAdd size={24} color={"#002329"}/>Create new collection</li>
                                            {(array && array.a) && ( array.a.map(name =>{
                                                return(
                                                    <React.Fragment key={name.collection_id}>
                                                        <li>
                                                            <button onClick={(e) => {
                                                                ListClick(e)
                                                                navigate(`feed/library/collection/${name.collection_name}/${name.collection_id}`)
                                                            }}>
                                                                <HiOutlineFolderOpen size={22}/>
                                                                <Span>
                                                                    {name.collection_name}
                                                                </Span>
                                                            </button>
                                                        </li>
                                                    </React.Fragment>
                                                )}))}
                                            {profile && profile.collection && profile.collection.length > 3 && (
                                                <li className={SideMenuStyle.ShowMore} ref={ShowMoreOne}>
                                                    <button onClick={(e) => {
                                                        FlipFlipSvg(e)
                                                        setArray(update(array, {$merge: {a: (profile && profile.collection && array.a.length === 3) ? profile.collection : profile.collection.slice(0, 3)}}))
                                                    }}><DropIcon color={'#fefae0'}/>Show more
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    )}
                            </li>
                            <li>
                                <button onClick={(e)=>{
                                    ListClick(e)
                                    navigate(`feed/homeT/history`)
                                }}>
                                    <HistoryIcon size={20.5}/>History
                                </button>
                            </li>
                            <li>
                                <button onClick={(e)=>{
                                    ListClick(e)
                                    navigate(`feed/homeT/liked`)
                                }}>
                                    <LikeHeartIcon size={20.5} color={'white'} type={'like'}/>Liked
                                </button>
                            </li>
                        </ul>
                    </div>
                    <hr/>
                    <div className={SideMenuStyle.SideMenuContentC}>
                        <span className={SideMenuStyle.SpanTitle}><TopicsIcon size={24} color={'black'}/>
                            Topics
                        </span>
                        <ul>
                            {(array && array.b) && ( array.b.map((name, index) => {
                                return(
                                    <React.Fragment key={index}>
                                        <li>
                                            <button onClick={ (e)=>{
                                                ListClick(e)
                                                if (SettingUrlList.includes(name)){
                                                    navigate(`home/saved/${name}`)
                                                    return
                                                }
                                                navigate(`home/unsaved/${name}`)
                                            }
                                            }>
                                                {name}
                                            </button>
                                        </li>
                                    </React.Fragment>
                                )
                            }))
                            }
                            <li className={SideMenuStyle.ShowMore}>
                                <button onClick={(e) => {
                                    FlipFlipSvg(e)
                                    setArray(update(array, {$merge: {b: (topicNames && array.b.length === 5) ? topicNames : topicNames.slice(0, 5)}}))
                                }}><DropIcon color={'#fefae0'}/>Show more
                                </button>
                            </li>
                        </ul>
                    </div>
                    <hr/>
                    <div className={SideMenuStyle.SideMenuContentD}>
                        <span className={SideMenuStyle.SpanTitle}>
                            <FollowIcon color={"black"}/>Followings
                        </span>
                        <ul>
                           <button className={SideMenuStyle.ExploreButton} onClick={()=>{navigate(`feed/homeT/explore/all`)}}>
                               <MdOutlineExplore size={26}/>Explore
                           </button>
                            {(array && array.c) && ( array.c.map(name => {
                                return(
                                    <li>
                                        <button onClick={(e)=>{
                                            ListClick(e)
                                            navigate(`/njt/feed/follow/${name.user_name}/ ${name.fullname ? name.fullname : null}`)
                                        }}>
                                            <img alt='user icon' src={name.avatarlocation ? name.avatarlocation : UserFaceTwo}/>
                                            <Span>
                                                {name.fullname ?name.fullname :name.user_name}
                                            </Span>
                                        </button>
                                    </li>
                                )
                            }))
                            }
                            {followList && followList.length > 5 &&
                                <li className={SideMenuStyle.ShowMore}>
                                    <button onClick={(e) => {
                                        FlipFlipSvg(e)
                                        setArray(update(array, {$merge: {c: (followList && array.c.length === 5) ? followList : followList.slice(0, 5)}}))
                                    }}><DropIcon color={'#fefae0'}/>Show more
                                    </button>
                                </li>
                            }
                        </ul>
                    </div>
                    <hr/>
                    <div className={SideMenuStyle.SideMenuContentE}>
                        <span className={SideMenuStyle.SpanTitle}><SettingsIconOne color={'black'}/>More From Anchor</span>
                        <ul>
                            <li>
                                <button onClick={()=>{navigate('settings/profile')}}>
                                    <SettingsIconTwo/>Settings
                                </button>
                            </li>
                            <li>
                                <button onClick={()=>{window.location.href = "/studio/home/my-home"}}>
                                    <CreativeIcon/>News Studio
                                </button>
                            </li>
                            <li>
                                <button onClick={() => {
                                    dispatch(GetOverlayRx({
                                        support: {
                                            ov: true
                                        }
                                    }))
                                }}>
                                    <SupportIcon/>Support
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>
            </animated.div>
            <div id="SidebarOverlay"
                 className={DisState ? SideMenuStyle.Overlay : ''}
            >
            </div>

        </div>
    );
};


Sidebar.defaultProps = {
    OverlayRX: false,
    Close: ()=>{}

};

export default Sidebar;
