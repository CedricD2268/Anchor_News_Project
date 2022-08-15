import React, {useEffect, useState, useRef} from 'react';
import StudioStyle from "../../Assets/scss/Main_News/Studio.module.css"
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'
import { RiDraftFill,  RiHome3Fill} from "react-icons/ri";
import {BiSearchAlt2} from "react-icons/bi";
import {CgClose} from "react-icons/cg";
import SearchBox from "../../Components/MainStudio/SearchBox";
import NavbarAvatar from "../../Components/MainStudio/NavbarAvatar";
import CardStudio from "./CardStudio";
import {BsFillCheckCircleFill, BsStarFill, BsStarHalf} from "react-icons/bs";
import SidebarTwo from "../Main_News/Sidebar/SidebarTwo";
import {NavLink, useNavigate, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import DropdownButton from "../../Components/MainStudio/DropdownButton";
import {
    AiOutlinePlus,

} from "react-icons/all";
import update from "react-addons-update";
import {Route, Routes, Navigate} from "react-router-dom";
import GetTimeMoments from "../../Components/MainStudio/GetTimeMoments";
import {GetArticleTopicTypeName as ArticleSub} from "../../Components/MainStudio/GetArticleTopicTypeName";
import LoadingSpinnerIcon from "../../Components/Icon/LoadingSpinnerIcon";
import ChartBox from "./ChartBox";
import EmptyBoxIcon from "../../Components/Icon/EmptyBoxIcon";
import SearchEmptyIcon from "../../Components/Icon/SearchEmptyIcon";
import AnchorLogoIcon from "../../Components/Icon/AnchorLogoIcon";
import {GetBoxChart, GetOverlayRx} from "../../Actions";
import LogoThreeIcon from "../../Components/Icon/LogoThreeIcon";
import CreativeIcon from "../../Components/Icon/CreativeIcon";
import Support from "../Main_News/Main/Support";


const SpinnerStudio = () => {
    return (
        <div className={VariableStyle.LoadingSpinner}>
            <LoadingSpinnerIcon size={45}/>
        </div>

    )
}

export const HomeStudio = () => {
    const rowsRef = useRef({inReview: [], draft: [], published: []})
    const [rows, setRows] = useState(rowsRef.current)
    // const [deleteActive, setDeleteActive] = useState('x')
    const [spinner, setSpinner] = useState(true)

    const GetRows = async (type, set) => {
        const data = type
        let dataSet = null

        try {
            const res = await fetch('http://localhost:5000/studio/view/article_by_home', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            let parseRes = await res.json()

            if (set === 'inReview') {
                let newInReview = []
                if (parseRes.length) {
                    parseRes.forEach((element) => {
                        let newElement = element
                        const newDate = GetTimeMoments(element.modifieddate)
                        newElement = update(newElement, {$merge: {modifieddate: newDate}})
                        newInReview.push(newElement)
                    })
                }
                dataSet = {inReview: newInReview.slice(0,6)}
            }

            if (set === 'draft') {
                let newDraft = []
                if (parseRes.length) {
                    parseRes.forEach((element) => {
                        let newElement = element
                        const newDate = GetTimeMoments(element.modifieddate)
                        newElement = update(newElement, {$merge: {modifieddate: newDate}})
                        newDraft.push(newElement)
                    })
                }
                dataSet = {draft: newDraft.slice(0,6)}
            }

            if (set === 'published') {
                let newPublished = []
                if (parseRes.length) {
                    parseRes.forEach((element) => {
                        let newElement = element
                        const newDate = GetTimeMoments(element.modifieddate)
                        newElement = update(newElement, {$merge: {modifieddate: newDate}})
                        newPublished.push(newElement)
                    })
                }
                dataSet = {published: newPublished.slice(0,6)}
            }
            rowsRef.current = update(rowsRef.current, {$merge: dataSet})
            setRows(rowsRef.current)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            GetRows({'name': 'inReviewByModifiedDate'}, 'inReview')
            GetRows({'name': 'draftByModifiedDate'}, 'draft')
            GetRows({'name': 'publishedByModifiedDate'}, 'published')
            setSpinner(false)
        }, 1000);

    }, [])
    return (
        <React.Fragment>
            {spinner ? (
                <SpinnerStudio/>
            ) : (
                <div className={StudioStyle.Home}>
                    <div className={StudioStyle.HomeRecent}>
                        <span className={StudioStyle.HomeRecentTitle}>Recently Modified</span>
                        <div className={StudioStyle.HomeRecentCard}>
                            {rows.draft.length ? (<React.Fragment>
                                    {rows.draft.map(row => {
                                        return (
                                            <CardStudio
                                                Data={row}
                                                View={{
                                                    success: false,
                                                    inReview: false,
                                                    draft: true,
                                                    published: false
                                                }}
                                                DeleteState={() => {
                                                    const newDArray = rows.draft.filter(id => id.articleid !== row.articleid)
                                                    setRows(update(rows, {$merge: {draft: newDArray}}))
                                                }}/>
                                        )
                                    })
                                    }
                                </React.Fragment>

                            ) : (
                                <React.Fragment>
                                    <EmptyBoxIcon size={160}/>
                                </React.Fragment>
                            )}

                        </div>
                    </div>
                    <div className={StudioStyle.HomeRecent}>
                        <span className={StudioStyle.HomeRecentTitle}>Published<BsFillCheckCircleFill size={23}/></span>
                        <div className={StudioStyle.HomeRecentCard}>
                            {rows.published.length ? (<React.Fragment>
                                    {rows.published.map(row => {
                                        return (
                                            <CardStudio
                                                Data={row}
                                                View={{
                                                    success: true,
                                                    inReview: false,
                                                    draft: false,
                                                    published: true
                                                }}
                                                DeleteState={() => {
                                                    const newDArray = rows.published.filter(id => id.articleid !== row.articleid)
                                                    setRows(update(rows, {$merge: {published: newDArray}}))
                                                }}
                                            />
                                        )
                                    })
                                    }
                                </React.Fragment>

                            ) : (
                                <React.Fragment>
                                    <EmptyBoxIcon size={160}/>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div className={StudioStyle.HomeRecent}>
                        <span className={StudioStyle.HomeRecentTitle}>InReview</span>
                        <div className={StudioStyle.HomeRecentCard}>
                            {rows.inReview.length ? (<React.Fragment>
                                    {rows.inReview.map(row => {
                                        return (
                                            <CardStudio
                                                Data={row}
                                                View={{
                                                    success: false,
                                                    inReview: true,
                                                    draft: false,
                                                    published: false
                                                }} DeleteState={() => {
                                                const newMArray = rows.inReview.filter(id => id.articleid !== row.articleid)
                                                setRows(update(rows, {$merge: {inReview: newMArray}}))
                                            }}/>
                                        )
                                    })
                                    }
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <EmptyBoxIcon size={160}/>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>

            )
            }
        </React.Fragment>


    )
}

export const PageStudio = ({arr}) => {
    // const rowsRef = useRef([])
    const {studio_query} = useParams()
    const timeConvert = GetTimeMoments
    const [spinner, setSpinner] = useState(true)
    const currentOp = useRef()
    const location = useLocation()
    const [rows, setRows] = useState([])
    const [typeNames, setTypeNames] = useState(['All types'])
    // const [Data, setData] = useState(arr.data)
    const [option, setOption] = useState({type: 'All types', orderBy: 'Last modified'})
    const chart = useSelector((state) => state.chartQuery)
    const dispatch = useDispatch()


    const GetRows =  async(Data, Object) => {

        const query = studio_query.slice(2)

        let data = {name: Data.default, search: query ? query: null}
        if (Object && Object.type === 'All types' && Object.orderBy === 'Title') {
            data = {name: Data.title, search: query ? query: null}
        }
        if (Object && Object.type !== 'All types' && Object.orderBy === 'Title') {
            data = {name: Data.titleType, type: Object.type, search: query ? query: null}
        }
        if (Object && Object.type !== 'All types' && Object.orderBy === 'Last modified') {
            data = {name: Data.defaultType, type: Object.type, search: query ? query: null}
        }
        try {
            const res = await fetch('http://localhost:5000/studio/view/article_by_home', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            let parseRes = await res.json()
            let newModified = []
            if (parseRes.length) {
                parseRes.forEach((element) => {
                    // let newElement = element
                    const newDate = timeConvert(element.modifieddate)
                    newModified.push(update(element, {$merge: {modifieddate: newDate}}))
                })
            }
            setRows(newModified)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(  () => {
        const getType = async() =>{
            let types = ['All types']
            types = update(types, {$push: await ArticleSub('typeNames')})
            setTypeNames(types)
        }
        getType()
        setTimeout(() => {
            GetRows(arr.data, option)
            setSpinner(false)
        }, 1500);
        setSpinner(true)
        dispatch(GetBoxChart({delete: false}))
    }, [location.pathname, chart.delete])


    return (
        <React.Fragment>
            {spinner ? (
                <SpinnerStudio/>
            ) : (
                <div className={StudioStyle.Home}>
                    <div className={StudioStyle.HomeRecent}>
                        <div className={StudioStyle.HomeHeader}>
                            <span className={StudioStyle.HomeRecentTitle}>{arr.name}</span>

                            <div className={StudioStyle.HomeDropButton}>
                                <DropdownButton
                                    ButtonAllTextColor={"white"}
                                    ButtonPrimaryTextColor={'white'}
                                    ButtonPrimaryBackground={'#002329'}
                                    ButtonAllBackground={"#002329"}
                                    ButtonFunctionChange={true}
                                    ButtonAllWidth={'155px'}
                                    ButtonPrimaryRadius={'6px'}
                                    ButtonPrimaryWidth={'155px'}
                                    ButtonPrimaryIcon={'flex'}
                                    BoxPosition={['0px', '5px']}
                                    FontSize={'15px'}
                                    Overflow={true}
                                    BoxAllHeight={'139px'}
                                    BoxOverflowColor={['#e8e8e4', '#335c67']}
                                    ButtonBoxBorder={false}
                                    ButtonAllRadius={'6px'}
                                    ButtonAllHeight={'35px'}
                                    ButtonPrimaryChar={'All types'}
                                    ButtonCharList={typeNames}
                                    Function={function (e) {
                                        currentOp.current = update(option, {$merge: {type: e.textContent}})
                                        setOption(currentOp.current)
                                        GetRows(arr.data, currentOp.current)
                                    }}
                                />
                                <DropdownButton
                                    ButtonAllTextColor={"white"}
                                    ButtonPrimaryTextColor={'white'}
                                    ButtonPrimaryBackground={'#335c67'}
                                    ButtonAllBackground={"#335c67"}
                                    ButtonFunctionChange={true}
                                    ButtonAllWidth={'160px'}
                                    ButtonPrimaryWidth={'160px'}
                                    ButtonPrimaryRadius={'6px'}
                                    ButtonPrimaryIcon={'flex'}
                                    BoxPosition={['0px', '5px']}
                                    FontSize={'15px'}
                                    ButtonBoxBorder={false}
                                    ButtonAllRadius={'6px'}
                                    ButtonAllHeight={'35px'}
                                    ButtonPrimaryChar={'Last modified'}
                                    ButtonCharList={[
                                        'Last modified',
                                        'Title'
                                    ]}
                                    Function={function (e) {
                                        currentOp.current = (update(option, {$merge: {orderBy: e.textContent}}))
                                        setOption(currentOp.current)
                                        GetRows(arr.data, currentOp.current)
                                    }}
                                />
                            </div>
                        </div>
                        <div className={StudioStyle.HomeRecentCard}>
                            {rows.length ? (<React.Fragment>
                                    {rows.map(row => {
                                        return (
                                            <CardStudio
                                                Data={row}
                                                View={{
                                                inReview: (row.publisheddate === null && row.inreviewdate),
                                                draft: (row.inreviewdate === null && row.publisheddate === null),
                                                published: (row.publisheddate),
                                                success: (row.publisheddate || row.inreviewdate),
                                            }}
                                                DeleteState={() => {
                                                const newMArray = rows.filter(id => id.articleid !== row.articleid)
                                                setRows(newMArray)
                                            }}/>
                                        )
                                    })
                                    }
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {arr.name === 'Article Search' ? (
                                        <SearchEmptyIcon size={180} color={'#33403c'}/>
                                    ) : (
                                        <EmptyBoxIcon size={160}/>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>)}
        </React.Fragment>
    )
}


const CreateArticle = ({State, ClearFunction, arr}) => {

    const [create, setCreate] = useState({on: false, type: null, topic: null})
    const [limit, setLimit] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const ClearClick = () => {
        setCreate({on: false, type: null, topic: null})
        ClearFunction()
        setLimit(false)
    }

    const setType = () => {
        CreateArticleType(create)
    }

    const [typeNames, setTypeNames] = useState(['Select type'])
    const [topicNames, setTopicNames] = useState(['Select topic'])

    useEffect(async () => {
        setTopicNames(await ArticleSub('topicNames'))
        setTypeNames(await ArticleSub('typeNames'))
    }, [])

    const CreateArticleType = async (action) => {
        let bodyData = {"type": action.type, "topic": action.topic}
        let endpoint = 'http://localhost:5000/studio/create/article'
        try {
            if (arr.name === 'PageStudio') {
                endpoint = 'http://localhost:5000/studio/view/row_article'
                bodyData = update(bodyData, {$merge: {name: 'viewRowByTopic'}})
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(bodyData)
            });

            const parseRes = await res.json()
            if (parseRes && parseRes.errorLimit){
                setLimit(true)
                return
            }
            if (arr.name === 'PageStudio'){
                navigate(`/studio/editor_page/${parseRes.topicname}/${parseRes.rowid}`)
                return
            }
            navigate(`/studio/editor/${parseRes.articleid}`)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        if (State)
            ClearClick()
    }, [location.pathname]);





    return (
        <React.Fragment>

            {State && (
                <div className={VariableStyle.PopUpOverlayTwo} onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    ClearClick()
                }} >
                    <div className={StudioStyle.CreateArticle}>
                        <button className={StudioStyle.CreateArticleCloseButton} onClick={ClearClick}><CgClose
                            color={'white'} size={24}/></button>
                        <div className={StudioStyle.CreateArticleBoxOne}>
                            Create Article
                        </div>
                        <button disabled={ arr.name === 'PageStudio' ? !create.topic : !(create.type && create.topic)} onClick={setType}
                                className={StudioStyle.CreateArticleCreateButton}>{arr.text}
                        </button>
                        <div className={StudioStyle.CreateArticleBoxTwo}>
                            {arr.name !== 'PageStudio' && (
                                <div>
                                    <DropdownButton
                                        ButtonAllTextColor={"white"}
                                        ButtonPrimaryTextColor={'white'}
                                        ButtonPrimaryBackground={'#335c67'}
                                        ButtonAllBackground={"#335c67"}
                                        ButtonFunctionChange={true}
                                        ButtonAllWidth={'160px'}
                                        ButtonPrimaryWidth={'160px'}
                                        ButtonPrimaryRadius={'4px'}
                                        ButtonPrimaryIcon={'flex'}
                                        BoxPosition={['0px', '5px']}
                                        FontSize={'15px'}
                                        BoxAllHeight={'120px'}
                                        Overflow={true}
                                        BoxOverflowColor={['#e8e8e4', '#94d2bd']}
                                        ButtonBoxBorder={false}
                                        ButtonAllRadius={'6px'}
                                        ButtonAllHeight={'35px'}
                                        ButtonPrimaryChar={'Select type'}
                                        ButtonCharList={typeNames}
                                        Function={function (e) {
                                            setCreate(update(create, {$merge: {type: e.textContent}}))
                                        }}
                                    />
                                </div>
                            )
                            }
                            <div>
                                <DropdownButton
                                    ButtonAllTextColor={"white"}
                                    ButtonPrimaryTextColor={'white'}
                                    ButtonPrimaryBackground={'#335c67'}
                                    ButtonAllBackground={"#335c67"}
                                    ButtonFunctionChange={true}
                                    ButtonAllWidth={'160px'}
                                    ButtonPrimaryWidth={'160px'}
                                    ButtonPrimaryRadius={'4px'}
                                    ButtonPrimaryIcon={'flex'}
                                    BoxPosition={['0px', '5px']}
                                    FontSize={'15px'}
                                    BoxAllHeight={'120px'}
                                    Overflow={true}
                                    BoxOverflowColor={['#e8e8e4', '#94d2bd']}
                                    ButtonBoxBorder={false}
                                    ButtonAllRadius={'6px'}
                                    ButtonAllHeight={'35px'}
                                    ButtonPrimaryChar={'Select topic'}
                                    ButtonCharList={topicNames}
                                    Function={function (e) {
                                        setCreate(update(create, {$merge: {topic: e.textContent}}))
                                    }}
                                />
                            </div>
                        </div>
                        {limit &&
                            <div className={StudioStyle.CreateFail}>
                                Sorry, Users are only allowed to create 7 articles for now.
                            </div>
                        }
                    </div>
                </div>)}
        </React.Fragment>
    )
}

CreateArticle.defaultProps = {
    State: false,
    ClearFunction: function (e) {
    },
    arr: {name: 'CreateArticle', text: 'OPEN DRAFT'}
};


const HeaderStudio = () => {
    const overlay = useSelector((state) => state.overlay)
    const chart = useSelector((state) => state.chartQuery)
    const profile = useSelector((state) => state.profileView);
    const [createState, setCreateState] = useState(false)
    const [openPageStudio, setOpenPageStudio] = useState(false)
    const [followCount, setFollowCount] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const dispatch = useDispatch()

    const location  = useLocation()
    const navigate = useNavigate()
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    const CheckAdmin = async() =>{
        try {
            const res = await fetch('http://localhost:5000/studio/check/admin', {
                method: "GET",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
            });
            const parseRes = await res.json()
            setIsAdmin(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }

    const FollowCount = async() =>{
        const data = {name: 'GetFollowSelfCount'}
        try {
            const res = await fetch('http://localhost:5000/home/mainfunction/following', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
            setFollowCount(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }



    useEffect(() => {
        CheckAdmin()
        FollowCount()
    }, []);

    useEffect(() => {
        dispatch(GetBoxChart({active: false}))
    }, [location.pathname]);

    return (
        <div>
            {/*<div className={StudioStyle.TestReset}></div>*/}

            {chart.active &&
                (
                    <div className={VariableStyle.PopUpOverlayTwo} onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    dispatch(GetBoxChart({active: false}))
                }}>
                        <ChartBox/>
                    </div>
                )
            }
            <SidebarTwo OverlayRX={overlay.sidebarThree} Radius={'8px'} MarginTop={'75px'} MarginRight={'-5px'} Home={false}/>
            <Support/>
            <CreateArticle State={createState} ClearFunction={ ()=> {
                setCreateState(false)
            }}/>
            <CreateArticle State={openPageStudio} arr={{name: 'PageStudio', text: 'OPEN PAGE STUDIO'} } ClearFunction={function () {
                setOpenPageStudio(false)
            }}/>
            <div className={StudioStyle.HeaderSidebar}>
                <div className={StudioStyle.Sidebar}>
                    <div className={StudioStyle.SidebarHomeCreate}>
                        <button onClick={
                            ()=>{
                            navigate('my-home')
                        }}>
                        <CreativeIcon size={35} color={'#2F3E46'}/>
                        </button>

                        <button onClick={()=>{
                            setCreateState(true)
                        }}><AiOutlinePlus size={24}/>
                            <span>CREATE ARTICLE</span>
                        </button>
                        {isAdmin &&
                            <button onClick={() => {
                                setOpenPageStudio(true)
                            }}><AiOutlinePlus size={24}/>
                                <span>CREATE TOPIC P.</span>
                            </button>
                        }
                    </div>
                    <div className={StudioStyle.SidebarListButtons}>
                        <NavLink to='my-home' >
                            <button className={splitLocation[3] === "my-home" ? StudioStyle.SidebarListColorClick : ''}>
                                <RiHome3Fill size={24}/><span>Home</span></button>
                        </NavLink>
                        <NavLink to='draft'>
                            <button className={splitLocation[3] === "draft" ? StudioStyle.SidebarListColorClick : ''}>
                                <RiDraftFill size={23}/><span>Draft</span></button>
                        </NavLink>
                        <NavLink to='inreview'>
                            <button  className={splitLocation[3] === "inreview" ? StudioStyle.SidebarListColorClick : ''}>
                                <BsStarHalf size={24}/><span>InReview</span></button>
                        </NavLink>
                        <NavLink to='published' >
                            <button className={splitLocation[3] === "published" ? StudioStyle.SidebarListColorClick : ''}>
                                <BsStarFill size={25}/><span>Published</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
                <div className={StudioStyle.HeaderContent}>
                    <div className={StudioStyle.Header}>
                        <div className={StudioStyle.HeaderOne}>
                            <div className={StudioStyle.HeaderWelcome}>
                                <span> Welcome,</span>
                                <span>{profile && profile.fullname ? profile.fullname.split(' ')[0]: null}</span>
                            </div>
                            <div className={StudioStyle.HeaderLogoName}>
                                <LogoThreeIcon height={55} width={380}/>
                            </div>
                            <div className={StudioStyle.HeaderImg}>
                                <NavbarAvatar SubscribeButtonVisibility={false} AvatarNameVisibility={true}
                                              Color={'white'}
                                              ClearFunc={[{sidebarThree: !overlay.sidebarThree}, {sidebarThree: false}]}
                                              ImgSize={'35px'}
                                />
                            </div>
                        </div>
                        <div className={StudioStyle.HeaderTwo}>
                            <div style={{width: '100%'}}>

                                    <SearchBox
                                        Border={'1px solid #273A40'}
                                        BorderColor={'#273A40'}
                                        BorderRadius={'4px'}
                                        maxWidth={'350px'}
                                        BoxHeight={45}
                                        CloseIconSize={26}
                                        Icon={<BiSearchAlt2 size={26} color={'#273A40'}/>}
                                        Placeholder={'Search in Studio....'}
                                    />


                            </div>
                            <div className={StudioStyle.HeaderTwoFollowers}>
                                <span> {followCount ? parseInt(followCount) === 1 ? '1 Follower' : `${followCount} Followers`: '0 Followers'} </span>
                            </div>
                        </div>
                    </div>
                    <hr className={StudioStyle.HeaderHr}/>
                    <div className={StudioStyle.Content}>
                        <Routes>
                            <Route exact path={`published`} element={<PageStudio
                                arr={{name: 'Published Article(s)',
                                    error: 'You currently have no Published Article(s)',
                                    data: {
                                        default: 'publishedByModifiedDate',
                                        title: 'publishedByTitle',
                                        titleType: 'publishedTypeByTitle',
                                        defaultType: 'publishedTypeByModifiedDate'
                                    },
                                    view: {
                                        inReview: false,
                                        draft: false,
                                        published: true
                                    }
                                }}/>}/>
                            <Route exact path={'draft'} element={<PageStudio
                                arr={{name: 'Draft Article(s)',
                                    error: 'You currently have no Draft Article(s)',
                                    data: {
                                        default: 'draftByModifiedDate',
                                        title: 'draftByTitle',
                                        titleType: 'draftTypeByTitle',
                                        defaultType: 'draftTypeByModifiedDate'
                                    },
                                    view: {
                                        inReview: false,
                                        draft: true,
                                        published: false
                                    }
                                }}/>}/>
                            <Route exact path={'inreview'} element={<PageStudio
                                arr={{name: 'InReview Article(s)',
                                    error: 'You currently have no InReview Article(s)',
                                    data: {
                                        default: 'inReviewByModifiedDate',
                                        title: 'inReviewByTitle',
                                        titleType: 'inReviewTypeByTitle',
                                        defaultType: 'inReviewTypeByModifiedDate'
                                    },
                                    view: {
                                        inReview: true,
                                        draft: false,
                                        published: false
                                    }
                                }}/>}/>
                            <Route exact path={'my-home'} element={<HomeStudio/>}/>
                            <Route exact path={''} element={<Navigate to={'my-home'}/>}/>
                            <Route exact path={'search/:studio_query'} element={<PageStudio
                                arr={{name: 'Article Search',
                                    error: "Sorry, we couldn't found any results",
                                    data: {
                                        default: 'searchStudio',
                                        title: 'searchStudioByTitle',
                                        titleType: 'searchStudioTypeByTitle',
                                        defaultType: 'searchStudioTypeByModifiedDate',
                                    },
                                    view: {
                                        inReview: false,
                                        draft: true,
                                        published: false
                                    }
                                }}/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default HeaderStudio;