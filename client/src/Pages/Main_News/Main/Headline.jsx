import React, {useState, useEffect, useRef} from 'react';
import MainStyle from '../../../Assets/scss/Main_News/Main.module.css'
import HeadPicOne from '../../../Assets/Images/website_background_images/portrait.jpg'
import BoxContent from "../../../Components/MainStudio/BoxContent";
import HeadPicTwo from "../../../Assets/Images/website_background_images/Image_1.jpg";
import HeadPicThree from '../../../Assets/Images/UserFaces/user_face_2.jpg';
import { VscFolderLibrary } from "react-icons/vsc";
import av from "../../../Assets/Images/UserFaces/user2.png";
import styled from "styled-components";
import {AiFillLike, AiOutlineEdit, FaSearch, HiOutlineFolderOpen, MdRemoveCircleOutline} from "react-icons/all";
import * as PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {GetOverlayRx, ViewProfileRx} from "../../../Actions";
import {GetArticleTopicTypeName as ArticleSub} from "../../../Components/MainStudio/GetArticleTopicTypeName";
import SearchBox from "../../../Components/MainStudio/SearchBox";
import DropdownButton from "../../../Components/MainStudio/DropdownButton";
import FollowIcon from "../../../Components/Icon/FollowIcon";
import HistoryIcon from "../../../Components/Icon/HistoryIcon";
import LikedIcon from "../../../Components/Icon/LikedIcon";
import ExploreIcon from "../../../Components/Icon/ExploreIcon";
import {BsThreeDotsVertical} from "react-icons/bs";
import LikeHeartIcon from "../../../Components/Icon/LikeHeartIcon";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import update from "react-addons-update";
import CardStudio from "../../NewsStudio/CardStudio";
import LoadingSpinnerIcon from "../../../Components/Icon/LoadingSpinnerIcon";
import TrendingIcon from "../../../Components/Icon/TrendingIcon";
import AllFollowingList from "../../../Components/MainStudio/AllFollowingList";
import GetTimeMoments from "../../../Components/MainStudio/GetTimeMoments";
import CreativeIcon from "../../../Components/Icon/CreativeIcon";

const Div = styled.div.attrs(props =>({
    className: props.className
}))`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding-right: 10px;
`;


const NameDiv = styled.div.attrs(props =>({
    className: props.className
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  font-size: 18px;
`;

const EmptyDiv = styled.div.attrs(props =>({
    className: props.className
}))`
  display: flex;
  align-items: center;
  height: 200px;
  width: 100%;
  border-radius: 8px;
  background: #354f52 ;
  padding: 40px;
  margin-top: ${(props) => props.marginTop};
  span{
    width: 100%;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 27px;
    color: white;
    @media screen and (max-width: 900px) {
      font-size: 22px;
    }
    @media screen and (max-width: 750px) {
      font-size: 19px;
    }
  }
`;


const NameSpan = styled.span.attrs(props =>({
    className: props.className
}))`
  @media screen and (min-width: 700px){
    width: 300px;
  }
  @media screen and (max-width: 700px){
    width: 110px;
  }
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;


const EmptyBox = () => {
    return (
        <div>
            <LoadingSpinnerIcon size={45}/>
        </div>

    )
}


const HeadlineBox = ({name, type, content, avatar, Empty, EmptyName, EditFunc, RemoveFunc, DropButton, DropButton2, ClearName, FollowButton }) => {
    const [load , setLoad] = useState(false)

    const [allTopics, setAllTopics] = useState()


    useEffect(() => {
        let newTopics = ['All topics']
        const updateTopic = async () => {
            if (await ArticleSub('topicNames'))
                for (const element of await ArticleSub('topicNames')) {
                    newTopics.push(element)
                }
            setAllTopics(newTopics)
        }
        updateTopic()
    }, [])


    const ContentClassname = () => {
        if (type === 'HeadlineTwo') {
            return  MainStyle.HeadlineTwo
        } else {
            if (type === 'HeadlineThree') {
                return MainStyle.HeadlineThree
            } else {
                if (load) {
                    return MainStyle.HeadlineFour
                } else {
                    return MainStyle.HeadlineFourSkeleton
                }
            }
        }
    }

    const ContentMarginTop = () =>{
        if (type === 'Search' || type === 'Library'){
            return '90px'
        }else{
            if (type === 'History' || type === 'Following'){
                return '30px'
            }else{
                return '0'
            }
        }
    }

    const EmptyDivMarginTop = () =>{
        if(type === 'Search' || type === 'Library'){
            return '90px'
        }else{
            if (type === 'AllFollowing'){
                return '0'
            }else{
                return  '30px'
            }
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setLoad(true)
        }, 2000);
        setLoad(false)
    },[])


    return (
        <div className={MainStyle.HeadlineTwoBox}>
            {type === 'Following' &&
                <div className={MainStyle.FollowingInfo}>
                    <img alt='user avatar' src={avatar} referrerPolicy={"no-referrer"}/>
                    <NameDiv>{name}</NameDiv>
                    <Div>
                        {FollowButton}
                    </Div>
                </div>
            }
            {(type === 'Library') &&
                <div className={MainStyle.FollowingInfo} style={{position: "absolute", width: '100%'}}>
                    <NameDiv>{name}</NameDiv>
                    <Div>
                        <button className={MainStyle.HeadlineEditButton} onClick={() => {EditFunc()}}>
                            <AiOutlineEdit size={18}/>Edit
                        </button>
                        <button className={MainStyle.HeadlineRemoveButton} onClick={() => {RemoveFunc()}}><MdRemoveCircleOutline size={17}/>Remove
                        </button>
                    </Div>
                </div>
            }
            {type === 'History' &&
                <div className={MainStyle.FollowingInfo}>
                    <NameDiv>{name}</NameDiv>
                    <Div>
                        <button className={MainStyle.HeadlineRemoveButton} onClick={()=>{
                        RemoveFunc()
                        }
                        }><MdRemoveCircleOutline size={17}/>{ClearName}</button>
                    </Div>
                </div>
            }
            {(type === 'HeadlineTwo' || type === 'HeadlineThree') &&
                <div className={MainStyle.HeadlineTwoHeaderOne}>
                    <span>{name} </span>
                    {type === 'HeadlineTwo' &&  <TrendingIcon size={24}/>}

                </div>
            }

                <div className={MainStyle.SearchInput} style={{position: "relative"}}>
                   {(type === 'Search') &&
                    <div style={{position: "absolute", width: '100%'}}>
                        <SearchBox
                            Border={'1px solid #273A40'}
                            BorderColor={'#273A40'}
                            BorderRadius={'4px'}
                            maxWidth={'100%'}
                            BoxHeight={40}
                            CloseIconSize={27}
                            Icon={<FaSearch size={20} color={'#273A40'}/>}/>

                    </div>
                        }
                    {(type === 'Search' || type === 'History' || type === 'Library' || type === 'Following') &&
                        <div className={MainStyle.SortSearch} style={(type === 'History' || type === 'Following') ? {marginTop: '0'} :{marginTop: '60px'}}>
                            <div className={MainStyle.SortSearchA}>
                                <DropdownButton
                                    ButtonAllTextColor={"white"}
                                    ButtonPrimaryTextColor={'white'}
                                    ButtonPrimaryBackground={'#173b3c'}
                                    ButtonAllBackground={"#173b3c"}
                                    ButtonFunctionChange={true}
                                    ButtonAllWidth={'150px'}
                                    ButtonPrimaryWidth={'150px'}
                                    ButtonPrimaryIcon={'block'}
                                    BoxPosition={['0px', '5px']}
                                    BoxAllHeight={'140px'}
                                    Overflow={true}
                                    BoxOverflowColor={['#e8e8e4', '#94d2bd']}
                                    FontSize={'14.5px'}
                                    ButtonBoxBorder={false}
                                    ButtonAllRadius={'6px'}
                                    ButtonPrimaryRadius={'6px'}
                                    ButtonAllHeight={'35px'}
                                    ButtonPrimaryChar={'All topics'}
                                    reset={false}
                                    ButtonCharList={allTopics}
                                    Function={(e)=>{DropButton(e)}}
                                />
                            </div>
                            <div className={MainStyle.SortSearchB}>
                                <DropdownButton
                                    ButtonAllTextColor={"white"}
                                    ButtonPrimaryTextColor={'white'}
                                    ButtonPrimaryBackground={'#173b3c'}
                                    ButtonAllBackground={"#173b3c"}
                                    ButtonFunctionChange={true}
                                    ButtonAllWidth={'140px'}
                                    ButtonPrimaryWidth={'140px'}
                                    ButtonPrimaryIcon={'block'}
                                    BoxPosition={['0px', '5px']}
                                    FontSize={'14.5px'}
                                    ButtonBoxBorder={false}
                                    ButtonPrimaryRadius={'6px'}
                                    ButtonAllRadius={'6px'}
                                    ButtonAllHeight={'35px'}
                                    ButtonPrimaryChar={'Date'}
                                    ButtonCharList={['Date', 'Title']}
                                    reset={false}
                                    Function={(e)=>{DropButton2(e)}}
                                />
                            </div>
                        </div>
                    }
                </div>

            {type === 'AllFollowing' &&
                <div className={MainStyle.FollowingInfo} style={{background: '#ccd5ae'}}>
                    <img alt='user avatar' src={avatar} referrerPolicy={"no-referrer"}/>
                    <NameDiv style={{color: 'black', fontSize: '17px'}}>{name}</NameDiv>
                    <Div>
                        {FollowButton}
                    </Div>
                </div>
            }

            {!Empty ?
                <div style={{marginTop: ContentMarginTop()}}
                     className={ContentClassname()}>
                    {content}
                </div> :
                <EmptyDiv marginTop= {EmptyDivMarginTop()}>
                    <span>{EmptyName}</span>
                </EmptyDiv>
            }
        </div>
    )

}

HeadlineBox.defaultProps={
    avatar: '',
    type: 'none',
    Empty: false,
    EmptyName: 'Empty',
    FollowDefault: false,
    EditFunc: ()=>{},
    RemoveFunc: ()=>{},
    DropButton:(e)=>{},
    DropButton2:(e)=>{},
    FollowFunc:()=>{}
}


const Headline = ({HeadlineType}) => {
    const {
        collection_name,
        collection_id,
        topic_name,
        home_query,
        follow_user_name,
        follow_full_name,
        explore_id,
        routeId
    } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [topic, setTopic] = useState('All topics')
    const [rowType, setRowType] = useState('Date')
    const location = useLocation()
    const profile = useSelector((state) => state.profileView);
    const followRender = useSelector((state) => state.overlay);
    const [headLine, setHeadLine] = useState()
    const [collectionLine, setCollectionLine] = useState()
    const [likeLine, setLikeLine] = useState()
    const [historyLine, setHistoryLine] = useState()
    const [searchList, setSearchList] = useState()
    const [followAvatar, setFollowAvatar] = useState()
    const [followLine, setFollowLine] = useState()
    const [allFollowing, setAllFollowing] = useState()
    const typesData = useRef({topicName: 'All topics', typeName: 'Date'})

    const [followButton, setFollowButton] = useState(false)





    const DeleteCollection = async () => {
        const data = { name: 'DeleteCollection' , collectionId: collection_id }
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/collection', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await response.json()
            dispatch(ViewProfileRx({collection: parseRes}))
            navigate(`../../home/saved/${(profile && profile.defaulttopic) ? profile.defaulttopic.toLowerCase().replace(/\s/g, ''): 'home'}`)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const DeleteLikeList = async () => {
        const data = { name: 'DeleteAllLike'}
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/article/like', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
             await response.json()
            setLikeLine(null)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const DeleteLike = async (data) => {
        let newData = {name: 'InsertArticleLike'}
        newData = update(newData,{$merge: data})

        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/article/like', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            await response.json()
        } catch (err) {
            console.error(err.message);
        }
        return false;

    }

    const DeleteHistory = async (data) => {
        let newData = {name: 'DeleteHistory'}
        newData = update(newData,{$merge: data})
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/history', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            await response.json()

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }


    const DeleteHistoryList = async () => {
        let data = {name: 'DeleteAllHistory'}
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/history', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            await response.json()
             setHistoryLine(null)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const GetFollowAvatar = async () => {
        let data = {name:'GetFollowAvatar', username: follow_user_name}
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/following', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const res = await response.json()
            if (res && res.avatarlocation) {
                setFollowAvatar(res.avatarlocation)
            }

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const FollowUser = async (object) => {
        let data = {name: 'InsertFollowing'}
        data = update(data, {$merge: object})
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/following', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            await response.json()
            dispatch(GetOverlayRx({sidebarFollowListRender: !followRender.sidebarFollowListRender}))
            if (follow_user_name){
                setFollowButton(!followButton)
                return
            }
            setAllFollowing(current =>
                current.map(obj => {
                    if (obj.user_name === object.username) {
                        return {
                            ...obj,
                            followButton: !obj.followButton
                        };
                    }
                    return obj;
                }),
            )

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const GetFollowBoolean = async (object) => {
        let data = {name:'GetFollowing'}
        data = update(data, {$merge: object})
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/following', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const res = await response.json()
            if (!object.singleType) {
                return res
            }
            setFollowButton(res)

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }


    const GetFollowArticlesList = async (data) => {
        if (!follow_user_name)
            return false
        let NewData;
        if (data.topicName === 'All topics' && data.typeName === 'Date')
            NewData = {name: 'GetFollowArticlesByDate', username: follow_user_name}
        if (data.topicName === 'All topics' && data.typeName === 'Title')
            NewData = {name: 'GetFollowArticlesByTitle', username: follow_user_name}
        if (data.topicName !== 'All topics' && data.typeName === 'Date')
            NewData = update(data, {$merge:{name: 'GetFollowArticlesByName', username: follow_user_name}})
        if (data.topicName !== 'All topics' && data.typeName === 'Title')
            NewData = update(data, {$merge: {name: 'GetFollowArticlesTitleByName', username: follow_user_name}})

        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/following', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(NewData)
            });
            const parseRes = await response.json()
            setFollowLine(parseRes)
        } catch (err) {
            console.error(err.message);
        }

    }


    const GetAllFollowings = async () => {
        let all = await AllFollowingList()
        if (explore_id)
            all = await AllFollowingList(true)
        let newAll = []
        for (let element of all){
            try {
                const data = {name: 'GetFollowArticlesByDate', username: element.user_name}
                const response = await fetch('http://localhost:5000/home/mainfunction/following', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: 'include',
                    body: JSON.stringify(data)
                });
                let parseRes = await response.json()
                parseRes = parseRes.slice(0, 4)
                const followValue = await GetFollowBoolean({username: element.user_name, singleType: false})
                element = update(element, {$merge: {articles: parseRes, followButton: followValue}})
                newAll = update(newAll, {$push: [element]})
            } catch (err) {
                console.error(err.message);
            }
        }

        if (explore_id) {
            const check = await AllFollowingList()
            for (const element of check) {
                newAll = newAll.filter(x => element.user_name !== x.user_name)
            }
            // newAll = newAll.filter(x => x.articles.length >= 1)
        }

        setAllFollowing(newAll)
    }


    const DeleteCollectionList = async (data) => {
        const newData = update(data,{$merge:{ name: 'DeleteCollectionList' , collectionId: collection_id }})
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/collection_list', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(newData)
            });
            const parseRes = await response.json()
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const HoneHtwo = async () => {
        if (!topic_name && !routeId)
            return false
        let data = {topic: topic_name }
        if (routeId)
             data = {topic: routeId }
        try {
            const response = await fetch('http://localhost:5000/home/view/row_article', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await response.json()
            const keys  = Object.keys(parseRes)
            let newRow = {};

            for (const key of keys) {
                if (key !== 'adminid' && key !== 'rowid' && key !== 'topicname') {
                    const data = {name: 'viewArticleByPublishId', publishId: parseRes[key]}
                    const res = await fetch('http://localhost:5000/studio/view/article', {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=UTF-8"},
                        credentials: 'include',
                        body: JSON.stringify(data)
                    });
                    const Res = await res.json()
                    let newInfo = {}
                    newInfo[key] = Res ? Res : ''
                    newRow = update(newRow, {$merge: newInfo})
                }
            }
            setHeadLine(newRow)

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const LibraryCollectionList = async (data) => {
        if (!collection_id)
            return false
        let NewData;
        if (data.topicName === 'All topics' && data.typeName === 'Date')
            NewData = {name: 'AllCollectionList', collectionId: collection_id}
        if (data.topicName === 'All topics' && data.typeName === 'Title')
            NewData = {name: 'AllCollectionListByTitle', collectionId: collection_id}
        if (data.topicName !== 'All topics' && data.typeName === 'Date')
            NewData = update(data, {$merge:{name: 'AllCollectionListByName', collectionId: collection_id}})
        if (data.topicName !== 'All topics' && data.typeName === 'Title')
            NewData = update(data, {$merge: {name: 'AllCollectionListByTitleByName', collectionId: collection_id}})

        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/collection_list', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(NewData)
            });
            const parseRes = await response.json()

            setCollectionLine(parseRes)

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const LikeList = async (data) => {
        let NewData;
        if (data.topicName === 'All topics' && data.typeName === 'Date')
            NewData = {name: 'AllArticleLikeList'}
        if (data.topicName === 'All topics' && data.typeName === 'Title')
            NewData = {name: 'AllArticleLikeListByTitle'}
        if (data.topicName !== 'All topics' && data.typeName === 'Date')
            NewData = update(data, {$merge:{name: 'AllArticleLikeListByName'}})
        if (data.topicName !== 'All topics' && data.typeName === 'Title')
            NewData = update(data, {$merge: {name: 'AllArticleLikeListByTitleByName'}})

        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/article/like', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(NewData)
            });
            const parseRes = await response.json()
            setLikeLine(parseRes)

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const HistoryList = async (data) => {
        let NewData;
        if (data.topicName === 'All topics' && data.typeName === 'Date')
            NewData = {name: 'AllHistoryList'}
        if (data.topicName === 'All topics' && data.typeName === 'Title')
            NewData = {name: 'AllHistoryListByTitle'}
        if (data.topicName !== 'All topics' && data.typeName === 'Date')
            NewData = update(data, {$merge:{name: 'AllHistoryListByName'}})
        if (data.topicName !== 'All topics' && data.typeName === 'Title')
            NewData = update(data, {$merge: {name: 'AllHistoryListByTitleByName'}})

        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/history', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(NewData)
            });
            const parseRes = await response.json()
            setHistoryLine(parseRes)

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const SearchList = async (data) => {
        if (!home_query || home_query === 'q=')
            return false
        const query = home_query.slice(2)
        let NewData;
        if (data.topicName === 'All topics' && data.typeName === 'Date')
            NewData = {name: 'publishedByDate', search: query}
        if (data.topicName === 'All topics' && data.typeName === 'Title')
            NewData = {name: 'publishedByTitle', search: query}
        if (data.topicName !== 'All topics' && data.typeName === 'Date')
            NewData = update(data, {$merge:{name: 'publishedTopicByDate', search: query}})
        if (data.topicName !== 'All topics' && data.typeName === 'Title')
            NewData = update(data, {$merge: {name: 'publishedTopicByTitle', search: query}})

        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/search', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(NewData)
            });
            const parseRes = await response.json()
            setSearchList(parseRes)

        } catch (err) {
            console.error(err.message);
        }
        return false;
    }


    useEffect(() => {
        HoneHtwo()
        const data  = {topicName: 'All topics', typeName: 'Date'}
        const followUser = {username: follow_user_name, singleType: true}
        LibraryCollectionList(data)
        LikeList(data)
        SearchList(data)
        HistoryList(data)
        GetFollowArticlesList(data)
        GetFollowAvatar()
        GetFollowBoolean(followUser)
        GetAllFollowings()
    }, [location.pathname]);


    return (
        <React.Fragment>
            {HeadlineType === 'HeadlineCombine' &&
                <React.Fragment>
                    <div className={MainStyle.HeadlineOne}>
                        {headLine && Object.keys(headLine).map((row, index) => {
                            if (row.includes('articleh')) {
                                return (
                                    <React.Fragment>
                                        {headLine[row].publishid &&
                                            <React.Fragment key={headLine[row].publishid}>
                                                <BoxContent
                                                    Long={true}
                                                    ArticleTitle={headLine[row].title}
                                                    ArticleImage={headLine[row].imagel}
                                                    ArticleHeader={headLine[row].typename}
                                                    SaveFunc={() => {
                                                        dispatch(GetOverlayRx({
                                                            sidebarCreate: {
                                                                ov: true,
                                                                title: 'Save in library',
                                                                listState: true,
                                                                buttonName: 'Create',
                                                                collectionName: '',
                                                                articleId: headLine[row].publishid
                                                            }
                                                        }))
                                                    }}
                                                    ShareFunc={() => {
                                                        dispatch(GetOverlayRx({
                                                            share: {
                                                                ov: true
                                                            }
                                                        }))
                                                    }}
                                                    ContentClick={() => {
                                                        navigate(`/njt/feed/article/${headLine[row].topicname}/${headLine[row].publishid}`)
                                                    }}
                                                />
                                            </React.Fragment>
                                        }
                                    </React.Fragment>
                                )
                            }

                        })
                        }

                    </div>
                    <HeadlineBox name={'Trending Stories'} type={'HeadlineTwo'} content={
                        headLine && Object.keys(headLine).map((row, index) => {
                            if (row.includes('articles')) {
                                return (
                                    <React.Fragment>
                                        {headLine[row].publishid &&
                                            <React.Fragment key={headLine[row].publishid}>
                                                <BoxContent
                                                    Long={false}
                                                    ArticleTitle={headLine[row].title}
                                                    ArticleImage={headLine[row].imagel}
                                                    Avatar={row.avatar}
                                                    AvatarName={headLine[row].typename === 'Opinion' ?  headLine[row].fullname ? headLine[row].fullname : headLine[row].username: ''}
                                                    ArticleStats={[headLine[row].readcount, GetTimeMoments(headLine[row].publisheddate)]}
                                                    ArticleHeader={headLine[row].typename}
                                                    SaveFunc={() => {
                                                        dispatch(GetOverlayRx({
                                                            sidebarCreate: {
                                                                ov: true,
                                                                title: 'Save in library',
                                                                listState: true,
                                                                buttonName: 'Create',
                                                                collectionName: '',
                                                                articleId: headLine[row].publishid
                                                            }
                                                        }))
                                                    }}
                                                    ShareFunc={() => {
                                                        dispatch(GetOverlayRx({
                                                            share: {
                                                                ov: true
                                                            }
                                                        }))
                                                    }}
                                                    ContentClick={() => {
                                                        navigate(`/njt/feed/article/${headLine[row].topicname}/${headLine[row].publishid}`)
                                                    }}
                                                />
                                            </React.Fragment>
                                        }
                                    </React.Fragment>
                                )
                            }
                        })
                        }/>
                    <HeadlineBox name={'Opinions'} type={'HeadlineThree'} content={
                        <React.Fragment>
                            <BoxContent
                                Long={false}
                                ArticleTitle={'US Embassy in Afghanistan tells staff to destroy sensitive materials'}
                                Avatar={HeadPicThree}
                                AvatarName={'Fabrice Douillard'}
                                ArticleStats={['620k', '2 months']}
                                ArticleHeader={'Opinion'}
                            />
                            <BoxContent
                                Long={false}
                                ArticleTitle={'US Embassy in Afghanistan tells staff to destroy sensitive materials'}
                                Avatar={HeadPicThree}
                                ArticleStats={['620k', '2 months']}
                                ArticleHeader={'Fact Check'}
                            />
                            <BoxContent
                                Long={false}
                                ArticleTitle={'US Embassy in Afghanistan tells staff to destroy sensitive materials'}
                                Avatar={HeadPicThree}
                                AvatarName={'Fabrice Douillard'}
                                ArticleStats={['620k', '2 months']}
                                ArticleHeader={'Opinion'}
                            />
                            <BoxContent
                                Long={false}
                                ArticleTitle={'US Embassy in Afghanistan tells staff to destroy sensitive materials'}
                                Avatar={HeadPicThree}
                                AvatarName={'Fabrice Douillard'}
                                ArticleStats={['620k', '2 months']}
                                ArticleHeader={'Opinion'}
                            />
                        </React.Fragment>
                    }/>
                </React.Fragment>
            }
            {HeadlineType === 'Following' &&
                <HeadlineBox
                    name={<NameSpan>{follow_full_name ? follow_full_name: follow_user_name}</NameSpan>}
                    type={'Following'}
                    avatar={followAvatar ? followAvatar : av}
                    DropButton={(e) => {
                        typesData.current = update(typesData.current, {$merge: {topicName: e.textContent}})
                        GetFollowArticlesList(typesData.current)
                    }
                    }
                    DropButton2={(e) => {
                        typesData.current = update(typesData.current, {$merge: {typeName: e.textContent}})
                        GetFollowArticlesList(typesData.current)
                    }
                    }
                    Empty={(!(followLine && followLine.length > 0))}
                    EmptyName={'User have no articles. '}
                    FollowFunc={()=>{FollowUser()}}
                    FollowButton={
                        <React.Fragment>
                            {
                                (profile && profile.username) && profile.username === follow_user_name ?

                                <button className={MainStyle.HeadlineFollowButton} onClick={() => {
                                    window.location.href = "/studio/home/my-home"
                                }}>
                                    <CreativeIcon/>studio
                                </button>
                                :
                                <button className={MainStyle.HeadlineFollowButton} onClick={() => {
                                    FollowUser({username: follow_user_name})
                                }}>
                                    {followButton ? 'Unfollow' : 'Follow'}

                                </button>
                            }
                        </React.Fragment>
                    }
                    content={
                    <React.Fragment>
                        {(followLine && followLine.length > 0) && followLine.map(row => {
                            return (
                                <React.Fragment key={row.publishid}>
                                    <BoxContent
                                        Long={false}
                                        ArticleTitle={row.title}
                                        Avatar={row.avatar}
                                        AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                        ArticleImage={row.imagew}
                                        ArticleHeader={row.typename}
                                        ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                        ShareFunc={() => {
                                            dispatch(GetOverlayRx({
                                                share: {
                                                    ov: true
                                                }
                                            }))
                                        }}
                                        SaveFunc={() => {
                                            dispatch(GetOverlayRx({
                                                sidebarCreate: {
                                                    ov: true,
                                                    title: 'Save in library',
                                                    listState: true,
                                                    buttonName: 'Create',
                                                    collectionName: '',
                                                    articleId: row.publishid
                                                }
                                            }))
                                        }}
                                        ContentClick={() => {
                                            navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                        }}
                                    />
                                </React.Fragment>
                            )
                            })
                        }
                    </React.Fragment>
                }/>
            }
            {HeadlineType === 'Library' &&
                <HeadlineBox name={
                    <React.Fragment>
                        <HiOutlineFolderOpen size={30}/>
                        <NameSpan>{collection_name}</NameSpan>
                    </React.Fragment>
                }
                             type={'Library'}
                             ClearName={'Clear history'}

                             EditFunc={() => {dispatch(GetOverlayRx({sidebarCreate: {ov: true, title: 'Edit library', listState: false, buttonName: 'Edit', collectionId: collection_id, collectionName: collection_name}}))}}
                             RemoveFunc={() => {DeleteCollection()}}
                             DropButton={(e)=>{
                                 typesData.current = update(typesData.current, {$merge:{topicName: e.textContent}})
                                 LibraryCollectionList(typesData.current)
                             }
                             }
                             DropButton2={(e)=>{
                                 typesData.current = update(typesData.current, {$merge:{typeName: e.textContent}})
                                 LibraryCollectionList(typesData.current)
                             }
                             }
                             Empty={(!(collectionLine && collectionLine.length > 0)) }
                             EmptyName={'Currently have no article saved. '}
                             content={
                    <React.Fragment>
                        {(collectionLine && collectionLine.length > 0) && collectionLine.map(row => {
                            return (
                                <React.Fragment key={row.publishid}>
                                    <BoxContent
                                        Long={false}
                                        ArticleTitle={row.title}
                                        ArticleImage={row.imagew}
                                        Avatar={row.avatar}
                                        AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                        ArticleHeader={row.typename}
                                        ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                        SecondButton={'Remove'}
                                        ShareFunc={() => {
                                            dispatch(GetOverlayRx({
                                                share: {
                                                    ov: true
                                                }
                                            }))
                                        }}
                                        RemoveFunc={() => {
                                            DeleteCollectionList({articlePublishedId: row.publishid})
                                            setCollectionLine(collectionLine.filter((element) => {
                                                return element.publishid !== row.publishid
                                            }))
                                        }}
                                        ContentClick={() => {
                                            navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                        }}
                                    />
                                </React.Fragment>
                            )
                            })
                        }
                    </React.Fragment>
                }/>
            }
            {HeadlineType === 'Search' &&
                <HeadlineBox type={'Search'}
                             avatar={av}
                             DropButton={(e) => {
                                 typesData.current = update(typesData.current, {$merge: {topicName: e.textContent}})
                                 SearchList(typesData.current)
                             }
                             }
                             DropButton2={(e) => {
                                 typesData.current = update(typesData.current, {$merge: {typeName: e.textContent}})
                                 SearchList(typesData.current)
                             }
                             }
                             Empty={(!(searchList && searchList.length > 0))}
                             EmptyName={'Currently no article match search. '}
                             content={
                    <React.Fragment>
                        {(searchList && searchList.length > 0) && searchList.map(row => {
                                    return (
                                        <React.Fragment key={row.publishid}>
                                            <BoxContent
                                                Long={false}
                                                ArticleTitle={row.title}
                                                ArticleImage={row.imagew}
                                                Avatar={row.avatar}
                                                AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                                ArticleHeader={row.typename}
                                                ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                                SaveFunc={() => {
                                                    dispatch(GetOverlayRx({
                                                        sidebarCreate: {
                                                            ov: true,
                                                            title: 'Save in library',
                                                            listState: true,
                                                            buttonName: 'Create',
                                                            collectionName: '',
                                                            articleId: row.publishid
                                                        }
                                                    }))
                                                }}
                                                ShareFunc={() => {
                                                    dispatch(GetOverlayRx({
                                                        share: {
                                                            ov: true
                                                        }
                                                    }))
                                                }}
                                                ContentClick={() => {
                                                    navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                                }}
                                            />
                                        </React.Fragment>
                                    )
                            })
                        }
                    </React.Fragment>
                }/>
            }

            {HeadlineType === 'AllFollowing' &&
                <div>
                    <div className={MainStyle.TopicsName}>
                       <FollowIcon size={26}/> <span>Following</span>
                    </div>
                    <React.Fragment>
                        {(allFollowing && allFollowing.length > 0) ? allFollowing.map(element=>{
                            return(
                                <React.Fragment key={element.user_name}>
                                    <HeadlineBox
                                        type={'AllFollowing'}
                                        name={
                                            <NameSpan>{element.fullname ? element.fullname : element.user_name}</NameSpan>}
                                        avatar={element.avatarlocation ? element.avatarlocation : av}
                                        Empty={(!(element && element.articles.length > 0))}
                                        EmptyName={'Currently have no article saved. '}
                                        FollowButton={
                                            <React.Fragment>
                                                {(profile && profile.username) && profile.username === element.user_name ?

                                                    <button className={MainStyle.HeadlineFollowButton} onClick={() => {
                                                    }}>
                                                       <CreativeIcon/>studio
                                                    </button>
                                                    :
                                                    <button className={MainStyle.HeadlineFollowButton} onClick={() => {
                                                        FollowUser({username: element.user_name})
                                                    }}>
                                                        {element.followButton ? 'Unfollow' : 'Follow'}
                                                    </button>
                                                }

                                            </React.Fragment>

                                        }
                                        content={
                                            <React.Fragment>
                                                {(element && element.articles && element.articles.length > 0) && element.articles.map(row => {
                                                    return (
                                                        <React.Fragment key={row.publishid}>
                                                            <BoxContent
                                                                Long={false}
                                                                ArticleTitle={row.title}
                                                                ArticleImage={row.imagew}
                                                                Avatar={row.avatar}
                                                                AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                                                ArticleHeader={row.typename}
                                                                ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                                                SaveFunc={() => {
                                                                    dispatch(GetOverlayRx({
                                                                        sidebarCreate: {
                                                                            ov: true,
                                                                            title: 'Save in library',
                                                                            listState: true,
                                                                            buttonName: 'Create',
                                                                            collectionName: '',
                                                                            articleId: row.publishid
                                                                        }
                                                                    }))
                                                                }}
                                                                ShareFunc={() => {
                                                                    dispatch(GetOverlayRx({
                                                                        share: {
                                                                            ov: true
                                                                        }
                                                                    }))
                                                                }}
                                                                ContentClick={() => {
                                                                    navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                                                }}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                })
                                                }
                                            </React.Fragment>


                                        }
                                    />
                                </React.Fragment>


                            )
                        }):
                            <EmptyDiv marginTop= {'20px'}>
                        <span>Currently following no one.</span>
                            </EmptyDiv>

                        }
                    </React.Fragment>
                </div>

            }

            {HeadlineType === 'History' &&
                <HeadlineBox name={
                    <React.Fragment>
                       <HistoryIcon size={33}/>
                        <NameSpan style={{fontSize: '22px'}}>History</NameSpan>
                    </React.Fragment>
                }
                             type={'History'}
                             ClearName={'Clear history'}
                             RemoveFunc={() => {
                                 DeleteHistoryList()
                             }}
                             DropButton={(e) => {
                                 typesData.current = update(typesData.current, {$merge: {topicName: e.textContent}})
                                 HistoryList(typesData.current)
                             }
                             }
                             DropButton2={(e) => {
                                 typesData.current = update(typesData.current, {$merge: {typeName: e.textContent}})
                                 HistoryList(typesData.current)
                             }
                             }
                             Empty={(!(historyLine && historyLine.length > 0))}
                             EmptyName={'Currently have no history. '}



                             content={
                    <React.Fragment>
                        {(historyLine && historyLine.length > 0) && historyLine.map(row => {
                            return (
                                <React.Fragment key={row.publishid}>
                                    <BoxContent
                                        Long={false}
                                        ArticleTitle={row.title}
                                        ArticleImage={row.imagew}
                                        Avatar={row.avatar}
                                        AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                        ArticleHeader={row.typename}
                                        ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                        SecondButton={'Remove'}
                                        ShareFunc={() => {
                                            dispatch(GetOverlayRx({
                                                share: {
                                                    ov: true
                                                }
                                            }))
                                        }}
                                        RemoveFunc={() => {
                                            DeleteHistory({articlePublishedId: row.publishid})
                                            setHistoryLine(historyLine.filter((element) => {
                                                return element.publishid !== row.publishid
                                            }))
                                        }}
                                        ContentClick={() => {
                                            navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                        }}
                                    />
                                </React.Fragment>
                            )
                        })
                        }
                    </React.Fragment>
                }/>
            }

            {HeadlineType === 'Liked' &&
                <HeadlineBox
                    name={
                    <React.Fragment>
                        <LikeHeartIcon size={29.5} color={'white'} type={'like'}/>
                        <NameSpan style={{fontSize: '22px'}}>Liked</NameSpan>
                    </React.Fragment>
                }
                    type={'History'}
                    ClearName={'Clear liked'}
                    RemoveFunc={() => {
                        DeleteLikeList()
                    }}
                    DropButton={(e) => {
                        typesData.current = update(typesData.current, {$merge: {topicName: e.textContent}})
                        LikeList(typesData.current)
                    }
                    }
                    DropButton2={(e) => {
                        typesData.current = update(typesData.current, {$merge: {typeName: e.textContent}})
                        LikeList(typesData.current)
                    }
                    }
                    Empty={(!(likeLine && likeLine.length > 0))}
                    EmptyName={'Currently have no liked article. '}

                    content={
                    <React.Fragment>
                        {(likeLine && likeLine.length > 0) && likeLine.map(row => {
                            return (
                                <React.Fragment key={row.publishid}>
                                    <BoxContent
                                        Long={false}
                                        ArticleTitle={row.title}
                                        ArticleImage={row.imagew}
                                        Avatar={row.avatar}
                                        AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                        ArticleHeader={row.typename}
                                        ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                        SecondButton={'Remove'}
                                        ShareFunc={() => {
                                            dispatch(GetOverlayRx({
                                                share: {
                                                    ov: true
                                                }
                                            }))
                                        }}
                                        RemoveFunc={() => {
                                            DeleteLike({articlePublishedId: row.publishid})
                                            setLikeLine(likeLine.filter((element) => {
                                                return element.publishid !== row.publishid
                                            }))
                                        }}
                                        ContentClick={() => {
                                            navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                        }}
                                    />
                                </React.Fragment>
                            )
                        })
                        }
                    </React.Fragment>
                }/>
            }

            {HeadlineType === 'Explore' &&
                <div>
                    <div className={MainStyle.TopicsName}>
                       <ExploreIcon size={36}/><span>Explore</span>
                    </div>
                    <React.Fragment>
                        {(allFollowing && allFollowing.length > 0) && allFollowing.map(element=>{
                            return(
                                <React.Fragment key={element.user_name}>
                                    <HeadlineBox
                                        type={'AllFollowing'}
                                        name={
                                            <NameSpan>{element.fullname ? element.fullname : element.user_name}</NameSpan>}
                                        avatar={element.avatarlocation ? element.avatarlocation : av}
                                        Empty={(!(element && element.articles.length > 0))}
                                        EmptyName={'Currently have no article saved. '}
                                        FollowButton={
                                            <React.Fragment>
                                                {(profile && profile.username) && profile.username === element.user_name ?

                                                    <button className={MainStyle.HeadlineFollowButton} onClick={() => {
                                                        window.location.href = "/studio/home/my-home"
                                                    }}>
                                                       <CreativeIcon/> &nbsp; Studio
                                                    </button>
                                                    :
                                                    <button className={MainStyle.HeadlineFollowButton} onClick={() => {
                                                        FollowUser({username: element.user_name})
                                                    }}>
                                                        {element.followButton ? 'Unfollow' : 'Follow'}
                                                    </button>
                                                }

                                            </React.Fragment>
                                        }
                                        content={
                                            <React.Fragment>
                                                {(element && element.articles && element.articles.length > 0) && element.articles.map(row => {
                                                    return (
                                                        <React.Fragment key={row.publishid}>
                                                            <BoxContent
                                                                Long={false}
                                                                ArticleTitle={row.title}
                                                                ArticleImage={row.imagew}
                                                                Avatar={row.avatar}
                                                                AvatarName={row.typename === 'Opinion' ?  row.fullname ? row.fullname : row.username: ''}
                                                                ArticleHeader={row.typename}
                                                                ArticleStats={[row.readcount, GetTimeMoments(row.publisheddate)]}
                                                                SaveFunc={() => {
                                                                    dispatch(GetOverlayRx({
                                                                        sidebarCreate: {
                                                                            ov: true,
                                                                            title: 'Save in library',
                                                                            listState: true,
                                                                            buttonName: 'Create',
                                                                            collectionName: '',
                                                                            articleId: row.publishid
                                                                        }
                                                                    }))
                                                                }}
                                                                ShareFunc={() => {
                                                                    dispatch(GetOverlayRx({
                                                                        share: {
                                                                            ov: true
                                                                        }
                                                                    }))
                                                                }}
                                                                ContentClick={() => {
                                                                    navigate(`/njt/feed/article/${row.topicname}/${row.publishid}`)
                                                                }}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                })
                                                }
                                            </React.Fragment>

                                        }
                                    />
                                </React.Fragment>


                            )
                        })
                        }
                    </React.Fragment>
                </div>
            }
        </React.Fragment>
    );
};

export default Headline;