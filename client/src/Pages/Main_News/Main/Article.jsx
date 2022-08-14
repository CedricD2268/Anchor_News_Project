import React, {useEffect, useRef, useState} from 'react';
import MainStyle from '../../../Assets/scss/Main_News/Main.module.css';
import GetHeadlineColor from "../../../Components/MainStudio/GetHeadlineColor";
import FlipFlipSvg from "../../../Components/MainStudio/FlipFlipSvg";
import {BsCheckCircle} from "react-icons/bs";
import {MdKeyboardArrowDown, MdSort} from "react-icons/md";
import CommentIcon from "../../../Components/Icon/CommentIcon";
import DropdownButton from "../../../Components/MainStudio/DropdownButton";
import ShareIcon from "../../../Components/Icon/ShareIcon";
import AddCollectionIcon from "../../../Components/Icon/AddCollectionIcon";
import {GetOverlayRx} from "../../../Actions";
import styled from "styled-components";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import update from "react-addons-update";
import LikedIcon from "../../../Components/Icon/LikedIcon";
import LikeHeartIcon from "../../../Components/Icon/LikeHeartIcon";
import {useNavigate, useParams} from "react-router-dom";
import {Interweave} from "interweave";
import SkeletonElement from "../../../Components/Skeleton/SkeletonElement";
import NewDateConvertUtc from "../../../Components/MainStudio/NewDateConvertUtc";
import userface from "../../../Assets/Images/UserFaces/user3.png"
import ReactPlayer from 'react-player'
import EarIcon from "../../../Components/Icon/EarIcon";
import {useDispatch, useSelector} from "react-redux";
import GetTimeMoments from "../../../Components/MainStudio/GetTimeMoments";
import {BiBookReader} from "react-icons/all";


const CommentDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: auto;
  width: ${(props) => props.width};
`;


const PlayerDiv = styled.div`
  width: 100%;
  div {
    width: 100%;
    max-width: 600px;
  }
`;




const PostComment = ()=>{
    const TextareaHeight = (e) => {
        e.target.style.height = '55px';
        let autoHeight = e.target.scrollHeight;
        e.target.style.height = `${autoHeight}px`;
    }
    return (
        <div className={MainStyle.ArticleMainFooterB}>
            <textarea placeholder='Add a public comment....' onChange={TextareaHeight}/>
            <div style={{display: 'flex', flexDirection: "row", gap: 5, marginLeft: 'auto'}}>
                <button className={MainStyle.ArticleMainFooterBCancel}>Cancel</button>
                <button>Post comment</button>
            </div>
        </div>

    )
}






const Comment = ({avatar, avatarName, commentBody, date, commentId, commentReplyId, commentLike, commentLikeCount, replyButton}) => {

    const [likeComment, setLikeComment] = useState(commentLike)
     const [likeCount, setLikeCount] = useState(commentLikeCount)

    const PostCommentLike = async () => {
        let url = 'http://localhost:5000/homeExtend/mainfunction/comment/likes'
        let data = {name: 'InsertCommentLike', commentId: commentId}
        if (!commentId) {
            url = 'http://localhost:5000/homeExtend/mainfunction/reply_comment/likes'
            data = {name: 'InsertReplyCommentLike', commentReplyId: commentReplyId}
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            await res.json()
            setLikeComment(!likeComment)
            if (likeComment){
                setLikeCount(likeCount - 1)
            }else{
                setLikeCount(likeCount + 1)
            }

        } catch (err) {
            console.error(err.message)
        }
    }


    return (
        <div className={MainStyle.ArticleMainFooterC}>
            <div className={MainStyle.ArticleMainFooterCA}>
                <img alt='user avatar' src={avatar}/>
                <p>
                    <span style={{fontSize: 16.5}}>{avatarName}</span>
                    <span style={{fontSize: 14, color: '#adb5bd'}}>  {`. ${date} ago`}</span>
                </p>
            </div>
            <div className={MainStyle.ArticleMainFooterCB}>
                <span style={{fontSize: 17, color: '#6c757d'}}>
                    {commentBody}
                </span>
            </div>
            <div className={MainStyle.ArticleMainFooterCC}>
                <button className={MainStyle.ArticleMainFooterCC} onClick={()=>{replyButton()}}>Reply</button>
                <div>
                    <button onClick={PostCommentLike}>
                        {likeComment ? <LikedIcon type={'like'}/> :  <LikedIcon/>}
                    </button>
                    <span >{ likeCount > 0 && likeCount}</span>
                </div>
            </div>
        </div>

    )
}

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

const Article = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {article_id, article_topic} = useParams()
    const [commentBody, setCommentBody] = useState('')
    const [replyCommentBody, setReplyCommentBody] = useState({})
    const [postedComment, setPostedComment] = useState([])
    const [postedReplyComment, setPostedReplyComment] = useState({})
    const profile = useSelector((state) => state.profileView);
    const itemsRef = useRef([])
    const pageRef = useRef()
    const [windowCheck, setWindowCheck] = useState(false)
    const [audioCheck, setAudioCheck] = useState(false)
    const [waitCheck, setWaitCheck] = useState(false)
    const audioLenght = useRef()
    const [played, setPlayed] = useState()
    const [commentCount, setCommentCount] = useState(0)
    const [commentLoad, setCommentLoad] = useState(false)
    const [likeArticle, setLikeArticle ] = useState(false)
    const [articleView, setArticleView] = useState();
    const [load, setLoad] = useState(false)
    const [commentUrlName, setCommentUrlName] = useState('AllComments')

    const TextareaHeight = (e) => {
        e.target.style.height = '55px';
        let autoHeight = e.target.scrollHeight;
        e.target.style.height = `${autoHeight}px`;
    }

    const AddCollection = () => {
        dispatch(GetOverlayRx({
            sidebarCreate: {
                ov: true,
                title: 'Save in library',
                listState: true,
                buttonName: 'Create',
                collectionName: '',
                articleId: article_id
            }
        }))
    }

    const ShareArticle = () => {
        dispatch(GetOverlayRx({
            share: {
                ov: true
            }
        }))
    }

    const GetArticle = async () => {
        try {
            const data = {name: 'viewArticleByPublishId', publishId: article_id}
            const res = await fetch('http://localhost:5000/studio/view/article', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const Res = await res.json()
            setArticleView(Res)
            setLoad(true)

        } catch (err) {
            console.error(err.message)
        }
    }

    const LikeArticle = async(Name) => {
        let data = {articlePublishedId: article_id, name: 'InsertArticleLike'}
        if (Name === 'getLike'){
            data = {articlePublishedId: article_id, name: 'GetArticleLike'}
        }
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/article/like', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const res = await response.json()
            if (Name === 'getLike') {
                setLikeArticle(res)
                return
            }
            setLikeArticle(!likeArticle)
        } catch (err) {
            console.error(err.message);
        }
    }

    const HistoryArticle = async() => {
        let data = {articlePublishedId: article_id, name: 'InsertHistory'}
        try {
            const response = await fetch('http://localhost:5000/home/mainfunction/history', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
             await response.json()
        } catch (err) {
            console.error(err.message);
        }
    }

    const GetComments = async (DataName) => {
        if (!DataName)
            return
        try {
            const data = {name: DataName, publishId: article_id}
            const res = await fetch('http://localhost:5000/homeExtend/mainfunction/comments', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const ResOne = await res.json()
            let newPostedComment = []
            let newPostedReplyComment = {}
            for (let element of ResOne) {
                const data = {name: 'GetCommentLike', commentId: element.comment_id}
                const result = await fetch('http://localhost:5000/homeExtend/mainfunction/comment/likes', {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    credentials: 'include',
                    body: JSON.stringify(data)
                })
                const Result = await result.json()
                const data2 = {name: 'ViewCommentLikeCount', commentId: element.comment_id}
                const result2 = await fetch('http://localhost:5000/homeExtend/mainfunction/comment/likes', {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    credentials: 'include',
                    body: JSON.stringify(data2)
                });
                const Result2 = await result2.json()
                const data3 = {name: 'AllReplyComments', commentId: element.comment_id}
                const result3 = await fetch('http://localhost:5000/homeExtend/mainfunction/reply_comments', {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    credentials: 'include',
                    body: JSON.stringify(data3)
                });

                const Result3 = await result3.json()
                let newReply = []
                for (let element2 of Result3) {

                    const dataB = {name: 'GetReplyCommentLike', commentReplyId: element2.comment_reply_id}
                    const resultB = await fetch('http://localhost:5000/homeExtend/mainfunction/reply_comment/likes', {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=UTF-8"},
                        credentials: 'include',
                        body: JSON.stringify(dataB)
                    })
                    const ResultB = await resultB.json()

                    const data2B = {name: 'ViewReplyCommentLikeCount', commentReplyId: element2.comment_reply_id}
                    const result2B = await fetch('http://localhost:5000/homeExtend/mainfunction/reply_comment/likes', {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=UTF-8"},
                        credentials: 'include',
                        body: JSON.stringify(data2B)
                    });
                    const Result2B = await result2B.json()

                    element2 = update(element2, {
                        $merge: {
                            like: !!(ResultB && ResultB.comment_reply_id),
                            likeCount: parseInt(Result2B.count),
                            [`post${element2.comment_reply_id}`]: false,
                            viewReply: false
                        }
                    })
                    newReply = update(newReply, {$push: [element2]})

                }
                newPostedReplyComment = update(newPostedReplyComment, {$merge: {[`comment${element.comment_id}`]: newReply ? newReply : []}})

                element = update(element, {
                    $merge: {
                        like: !!(Result && Result.comment_id),
                        likeCount: parseInt(Result2.count),
                        [`post${element.comment_id}`]: false,
                        viewReply: false
                    }
                })
                newPostedComment = update(newPostedComment, {$push: [element]})
            }
            setPostedReplyComment(newPostedReplyComment);
            setPostedComment(newPostedComment)
            setCommentLoad(true)
        } catch (err) {
            console.error(err.message)
        }
    }

    const PostComment = async () => {
        try {
            const data = {name: 'InsertComment', publishId: article_id, commentBody: commentBody}
            const res = await fetch('http://localhost:5000/homeExtend/mainfunction/comments', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            let Res = await res.json()
            Res = update(Res[0], {$merge: {like: false, likeCount: 0,
                    // [`post${Res[0].comment_id}`]
                      postBox : false
            }})
            setPostedReplyComment(update(postedReplyComment, {$merge: {[`comment${Res.comment_id}`]: []} }))
            setPostedComment(update(postedComment, {$unshift: [Res]}))
            setCommentBody('')
        } catch (err) {
            console.error(err.message)
        }
    }

    const PostReplyComment = async (Data) => {
        try {
            const data = update(Data, {$merge:{name : 'InsertReplyComment'}})
            const res = await fetch('http://localhost:5000/homeExtend/mainfunction/reply_comments', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });

            let Res = await res.json()
            Res = update(Res[0], {$merge: {like: false, likeCount: 0, postBox: false}})
            let object = {[`comment${Data.commentId}`]: update(postedReplyComment[`comment${Data.commentId}`],{$unshift: [Res]})}

            if (Data && Data.newObject) {
                object = {[`comment${Data.commentId}`]: update(Data.newObject[`comment${Data.commentId}`], {$unshift: [Res]})}
            }
            setPostedReplyComment(update(postedReplyComment, {$merge: object}))
        } catch (err) {
            console.error(err.message)
        }
    }

    const PostReplyCommentID = (original, commentId, replyCommentId, index) => {
        let mergeUpdate = null
        if (!original) {
            const newUpdate = postedReplyComment[`comment${commentId}`].map(obj => {
                if (obj.comment_reply_id === replyCommentId) {
                    return {
                        ...obj,
                        postBox: false
                    };
                }
                return obj;
            })
             mergeUpdate = {[`comment${commentId}`]: newUpdate}
            // setPostedReplyComment(update(postedReplyComment, {$merge: {[`comment${commentId}`]: newUpdate}}))
        }
        PostReplyComment({commentId: commentId, commentBody: replyCommentBody[`reply${commentId}`] , newObject: mergeUpdate})
        if (original) {
            setPostedComment(current =>
                current.map(obj => {
                    if (obj.comment_id === commentId) {
                        return {
                            ...obj,
                            viewReply: true,
                            postBox: false
                        };
                    }
                    return obj;
                }),
            );
            const svg = itemsRef.current[index] ? itemsRef.current[index].querySelector('svg') : ''
            if (svg) {
                svg.style.transform = 'rotate(180deg)'
            }
        }
        setReplyCommentBody(update(replyCommentBody, {$merge: {[`reply${commentId}`]: ''}}))
    }

    const ReplyBoxButton = (original, commentId, replyCommentId) => {
        if (original) {
            setPostedComment(current =>
                current.map(obj => {
                    if (obj.comment_id === commentId) {
                        return {
                            ...obj,
                            postBox: true
                        };
                    }
                    return obj;
                }),
            );
            return
        }

        const newUpdate = postedReplyComment[`comment${commentId}`].map(obj => {
            if (obj.comment_reply_id === replyCommentId) {
                return {
                    ...obj,
                    postBox: true
                };
            }
            return obj;
        })
        setPostedReplyComment(update(postedReplyComment, {$merge: {[`comment${commentId}`]: newUpdate}}))

    }

    const TextAreaOnchange = (commentId, target, targetValue)=>{
        TextareaHeight(target)
        setReplyCommentBody(update(replyCommentBody, {$merge: {[`reply${commentId}`]: targetValue}}))
    }

    const CancelReplyComment = (original, commentId, replyCommentId) => {
        if (original) {
            setPostedComment(current =>
                current.map(obj => {
                    if (obj.comment_id === commentId) {
                        return {
                            ...obj,
                            postBox: false
                        };
                    }
                    return obj;
                }),
            );
        } else {
            const newUpdate = postedReplyComment[`comment${commentId}`].map(obj => {
                if (obj.comment_reply_id === replyCommentId) {
                    return {
                        ...obj,
                        postBox: false
                    };
                }
                return obj;
            })
            setPostedReplyComment(update(postedReplyComment, {$merge: {[`comment${commentId}`]: newUpdate}}))
        }
    }

    const ViewReplies = (commentId, elementViewReply, target) => {
        setPostedComment(current =>
            current.map(obj => {
                if (obj.comment_id === commentId) {
                    return {
                        ...obj,
                        viewReply: !elementViewReply
                    };
                }
                return obj;
            }),
        );
        FlipFlipSvg(target)
    }

    const CountComments = async() => {
        try {
            const data = {name: 'AllCommentsCount', publishId: article_id}
            const res = await fetch('http://localhost:5000/homeExtend/mainfunction/comments', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const Res = await res.json()
            setCommentCount(Res? Res: 0)
        } catch (err) {
            console.error(err.message)
        }
    }

    const getRead = async() => {
        try {
            const data = {name: 'AllCommentsCount', publishId: article_id}
            const res = await fetch('http://localhost:5000/homeExtend/mainfunction/get_read', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            await res.json()
        } catch (err) {
            console.error(err.message)
        }
    }

    const handleWindowResize = () => {
        const dimension = getWindowSize()
        if ((dimension.innerHeight > 1100 && dimension.innerWidth > 1000) || (dimension.innerHeight > 980 && dimension.innerWidth < 1001)) {
            setWindowCheck(true)
        }
    }

    const handleWindowScroll = () => {
        if (window.pageYOffset > 550) {
            setWindowCheck(true)
        }
    }




    useEffect(() => {
        setTimeout(() => {
            GetArticle()
            LikeArticle('getLike')
            HistoryArticle()
        }, 850);
        setLoad(false)
    }, []);

    const CommentTimeout = (urlName) => {
        setTimeout(() => {
            GetComments(urlName)
        }, 800)
    };

    useEffect(() => {
        clearTimeout(CommentTimeout(commentUrlName))
        setCommentLoad(false)
    }, [commentUrlName]);

    useEffect(() => {
        CountComments()
    }, [postedReplyComment, postedComment]);




    useEffect(() => {
        handleWindowResize()
        window.addEventListener('scroll', handleWindowScroll);
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
            window.removeEventListener('scroll', handleWindowScroll);
        };
    }, []);

    useEffect(() => {
        const WaitChecking = () => {
            setTimeout(() => {
                setWaitCheck(true)
            }, 20000)
        }
        clearTimeout(WaitChecking())
    }, []);


    const OndurationTest = (e)=>{
        audioLenght.current = e
    }

    useEffect(() => {
          if (audioLenght.current){
              const lenght = audioLenght.current
              if (lenght < 30 && played > 10){
                  setAudioCheck(true)
              }
              if ( lenght > 30 && played > 30 ){
                  setAudioCheck(true)
              }
          }
    }, [played]);

    useEffect(() => {
        if ((waitCheck && windowCheck) || audioCheck) {
            getRead()
        }
    }, [audioCheck, waitCheck, windowCheck]);



    return (
        <div className={MainStyle.Article}>
            <div className={MainStyle.ArticleHead}>
                {!load ?
                    <div style={{marginTop: '30px'}}>
                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'30%'} MinWidth={'30%'}
                                         Height={'22px'}/>
                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'} MinWidth={'50%'}
                                         Height={'21px'}/>
                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'} MinWidth={'50%'}
                                         Height={'21px'}/>
                    </div> :
                    <React.Fragment>
                        <div className={MainStyle.ArticleHeadTopic}>
                            <p>
                                <span>{articleView && articleView.topicname ? articleView.topicname : 'Unknown'}</span>
                                &nbsp;
                                &nbsp;
                                <span
                                    style={{color: articleView && articleView.typename ? GetHeadlineColor({target: articleView.typename, option: 'textOnly'}).color: 'black' }}>{articleView && articleView.typename ? articleView.typename : 'Unknown'}</span>
                            </p>
                        </div>
                        <div className={MainStyle.ArticleHeadTitle}>
                            <span>{articleView && articleView.title ? articleView.title : 'Unknown'}</span>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className={MainStyle.ArticleHeadShareSaved}>
                            <button onClick={ShareArticle}><ShareIcon size={24}/></button>
                            <button onClick={AddCollection}><AddCollectionIcon size={25}/></button>
                        </div>
                        <div className={MainStyle.ArticleHeadListen}>
                            <span><EarIcon size={25} color={'white'}/></span>
                            <PlayerDiv>
                            {/*    <AudioPlayer  src={articleView.audio}*/}
                            {/*                  showJumpControls={false}*/}
                            {/*                  autoPlayAfterSrcChange={false}*/}
                            {/*                 />*/}
                                <ReactPlayer controls={true} height={50}  width={'100%'} url={articleView.audio}
                                             onDuration={OndurationTest}
                                             onProgress={(progress) => {
                                                 setPlayed(progress.playedSeconds);
                                             }}/>
                            </PlayerDiv>

                        </div>
                    </React.Fragment>
                }
            </div>
            <div className={MainStyle.ArticleMain}>
                <div className={MainStyle.ArticleMainImage}>
                    <div className={MainStyle.ArticleMainImageOne}>
                        {!load ?
                            <SkeletonElement BorderRadius={'3px'} Height={'auto'} Width={'auto'}
                                             AspectRatio={'3 / 1'}/> :
                            <img alt='article image'
                                 src={articleView && articleView.image ? articleView.image : ''}/>
                        }
                    </div>
                    {load &&
                        <span>Amazon packages move along a conveyor at an Amazon warehouse facility in Goodyear, Ariz</span>
                    }
                </div>
                <div className={MainStyle.ArticleMainPublisher}>
                    {!load ?
                        <div style={{ marginTop: '15px'}}>
                            <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'50%'} Width={'30px'}
                                             MinWidth={'30px'}
                                             Height={'30px'}/>
                            <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'250px'}
                                             MinWidth={'250px'}
                                             Height={'21px'}/>
                        </div> :
                        <React.Fragment>
                            <div onClick={()=>{
                                if(articleView && articleView.username){
                                    navigate(`/njt/feed/follow/${articleView.username}/ ${articleView && articleView.fullname ? articleView.fullname: null}`)
                                }
                            }} style={{cursor: 'pointer'}}>
                                <img alt='publisher photo' src={articleView && articleView.avatar ? articleView.avatar : userface}/>
                                <span> {articleView && articleView.fullname ? articleView.fullname: articleView && articleView.username ? articleView.username: 'unknown' }</span>
                                <BsCheckCircle/>
                            </div>
                            <div>
                                <span>Posted: {articleView && articleView.publisheddate ? NewDateConvertUtc(articleView.publisheddate): 'unknown'}</span>
                            </div>

                        </React.Fragment>

                    }
                </div>
                <div className={MainStyle.ArticleMainP}>
                    <div  className={MainStyle.ArticleMainPA}>
                        {!load ?
                            <div style={{marginBottom: '300px', marginTop: '30px'}}>
                                <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'100%'}
                                                 MinWidth={'100%'}
                                                 Height={'21px'}/>
                                <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'90%'}
                                                 MinWidth={'90%'}
                                                 Height={'21px'}/>
                                <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'85%'}
                                                 MinWidth={'85%'}
                                                 Height={'21px'}/>
                                <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'85%'}
                                                 MinWidth={'85%'}
                                                 Height={'21px'}/>
                                <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'85%'}
                                                 MinWidth={'85%'}
                                                 Height={'21px'}/>
                            </div> :
                            <div style={{ marginTop: '25px'}}>
                                <Interweave content={articleView && articleView.body ? articleView.body : 'Unknown'}/>
                            </div>
                        }
                    </div>
                    {load &&
                        <React.Fragment>
                            <div className={MainStyle.ArticleMainFooter}>
                                <div className={MainStyle.ArticleMainFooterLike}>
                                    <button onClick={LikeArticle}>
                                        {likeArticle ?
                                            <LikeHeartIcon size={50} color={'black'} type={'like'}/> :
                                            <LikeHeartIcon size={50} color={'black'}/>
                                        }
                                    </button>
                                    <div>
                                        <span>{articleView && articleView.readcount ? articleView.readcount : 0} Reads</span> <BiBookReader size={28}/>
                                    </div>

                                </div>
                                <hr/>
                                <div className={MainStyle.ArticleMainFooterA}>
                                    <div className={MainStyle.ArticleMainFooterAHeader}>
                                        <CommentIcon size={150} color={'rgb(40, 54, 24)'}/>
                                        <span>Welcome to The New Jersey Times comments! Please keep conversations polite
                                    and don't be mean. Have Fun.
                                </span>
                                    </div>
                                    <div className={MainStyle.ArticleMainFooterASort}>
                                        <span> All comments ({commentCount})</span>
                                        <div className={MainStyle.ArticleMainFooterASortA}>
                                            <DropdownButton
                                                ButtonAllTextColor={"black"}
                                                ButtonPrimaryTextColor={'black'}
                                                ButtonPrimaryBackground={'#f8f9fa'}
                                                ButtonAllBackground={"#f8f9fa"}
                                                ButtonFunctionChange={false}
                                                ButtonAllWidth={'150px'}
                                                ButtonPrimaryWidth={'150px'}
                                                ButtonPrimaryIcon={'block'}
                                                BoxPosition={['0', '5px']}
                                                FontSize={'15.5px'}
                                                ButtonBoxBorder={false}
                                                ButtonAllRadius={'4px'}
                                                ButtonPrimaryRadius={'4px'}
                                                ButtonAllHeight={'32px'}
                                                ButtonPrimaryChar={<span style={{
                                                    display: "flex",
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}><MdSort size={20}/> Sort by</span>}
                                                ButtonCharList={['Newest comments', 'Oldest comments', 'Most liked']}
                                                Function={function (e) {
                                                    setCommentUrlName(e.textContent)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className={MainStyle.ArticleMainFooterB}>
                                    <textarea placeholder='Add a public comment....'
                                              onChange={(e) => {
                                                  TextareaHeight(e)
                                                  setCommentBody(e.target.value)
                                              }}
                                              value={commentBody}/>
                                    <div style={{display: 'flex', flexDirection: "row", gap: 5, marginLeft: 'auto'}}>
                                        <button
                                            onClick={PostComment}
                                            disabled={!commentBody}
                                        >
                                            Post comment
                                        </button>
                                    </div>
                                </div>

                                {!commentLoad ?
                                    <div style={{marginTop: '30px'}}>
                                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'30%'}
                                                         MinWidth={'60%'}
                                                         Height={'22px'}/>
                                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'}
                                                         MinWidth={'80%'}
                                                         Height={'21px'}/>
                                        <SkeletonElement Margin={'20px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'}
                                                         MinWidth={'60%'}
                                                         Height={'21px'}/>
                                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'}
                                                         MinWidth={'80%'}
                                                         Height={'21px'}/>
                                        <SkeletonElement Margin={'20px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'}
                                                         MinWidth={'60%'}
                                                         Height={'21px'}/>
                                        <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'}
                                                         MinWidth={'80%'}
                                                         Height={'21px'}/>
                                    </div> :
                                    <CommentDiv width={'100%'}>
                                        {postedComment && postedComment.map((element, index) => {
                                                return (
                                                    <div key={element && element.comment_id ? element.comment_id : null}>
                                                        <Comment
                                                            avatar={element && element.avatarlocation ? element.avatarlocation : userface}
                                                            avatarName={element && element.fullname ? element.fullname : null}
                                                            date={element && element.created_on ? GetTimeMoments(element.created_on) : null}
                                                            commentBody={element && element.comment_body ? element.comment_body : null}
                                                            commentId={element && element.comment_id ? element.comment_id : null}
                                                            commentReplyId={null}
                                                            commentLike={(element && element.like ? element.like : false)}
                                                            commentLikeCount={element && element.likeCount ? element.likeCount : 0}
                                                            replyButton={() => {
                                                                ReplyBoxButton(true, element.comment_id, null)
                                                            }}
                                                        />

                                                        {element && element.postBox &&
                                                            <div style={{marginTop: '10px'}}
                                                                 className={MainStyle.ArticleMainFooterB}>
                                                            <textarea
                                                                placeholder='Reply to comment....'
                                                                onChange={(e) => {
                                                                    TextAreaOnchange(element.comment_id, e, e.target.value)
                                                                }}/>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    flexDirection: "row",
                                                                    gap: 5,
                                                                    marginLeft: 'auto'
                                                                }}>
                                                                    <button style={{
                                                                        height: '33px',
                                                                        borderRadius: '2.5px',
                                                                        fontSize: '14px'
                                                                    }}
                                                                            className={MainStyle.ArticleMainFooterBCancel}
                                                                            onClick={() => {
                                                                                CancelReplyComment(true, element.comment_id, null)
                                                                            }}>
                                                                        Cancel
                                                                    </button>
                                                                    <button style={{
                                                                        height: '33px',
                                                                        borderRadius: '2.5px',
                                                                        fontSize: '14px'
                                                                    }}
                                                                            disabled={!replyCommentBody[`reply${element.comment_id}`]}
                                                                            onClick={() => {
                                                                                PostReplyCommentID(true, element.comment_id, null, index)
                                                                            }}>
                                                                        Post comment
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }

                                                        {postedReplyComment && postedReplyComment[`comment${element.comment_id}`] && postedReplyComment[`comment${element.comment_id}`].length > 0 &&
                                                            <React.Fragment>
                                                                <div className={MainStyle.CommentViewRepliesButton}>
                                                                    <button ref={el => itemsRef.current[index] = el}
                                                                            onClick={(e) => {
                                                                                ViewReplies(element.comment_id, element.viewReply, e)
                                                                            }}>
                                                                        <MdKeyboardArrowDown size={22}/>View replies
                                                                    </button>
                                                                </div>
                                                                <CommentDiv width={'92%'}>
                                                                    {element && element.viewReply &&
                                                                        <React.Fragment>
                                                                            {postedReplyComment && postedReplyComment[`comment${element.comment_id}`] && postedReplyComment[`comment${element.comment_id}`].map((element2) => {
                                                                                return (
                                                                                    <div
                                                                                        key={element2 && element2.comment_id ? element2.comment_id : null}>
                                                                                        <Comment
                                                                                            avatar={element2 && element2.avatarlocation ? element2.avatarlocation : userface}
                                                                                            avatarName={element2 && element2.fullname ? element2.fullname : null}
                                                                                            date={element2 && element2.created_on ? GetTimeMoments(element2.created_on) : null}
                                                                                            commentBody={element2 && element2.comment_body ? element2.comment_body : null}
                                                                                            commentId={null}
                                                                                            commentReplyId={element2 && element2.comment_reply_id ? element2.comment_reply_id : null}
                                                                                            commentLike={(element2 && element2.like ? element2.like : false)}
                                                                                            commentLikeCount={element2 && element2.likeCount ? element2.likeCount : 0}
                                                                                            replyButton={() => {
                                                                                                ReplyBoxButton(false, element.comment_id, element2.comment_reply_id)
                                                                                            }}
                                                                                        />
                                                                                        {
                                                                                            element2 && element2.postBox &&

                                                                                            <div style={{marginTop: '10px'}}
                                                                                                 className={MainStyle.ArticleMainFooterB}>
                                                                                            <textarea
                                                                                                placeholder='Reply to comment....'
                                                                                                defaultValue={element2 && element2.fullname ? `@${element2.fullname}` : null}
                                                                                                onChange={(e) => {
                                                                                                    TextAreaOnchange(element.comment_id, e, e.target.value)
                                                                                                }}/>
                                                                                                <div style={{
                                                                                                    display: 'flex',
                                                                                                    flexDirection: "row",
                                                                                                    gap: 5,
                                                                                                    marginLeft: 'auto'
                                                                                                }}>
                                                                                                    <button style={{
                                                                                                        height: '33px',
                                                                                                        borderRadius: '2.5px',
                                                                                                        fontSize: '14px'
                                                                                                    }}
                                                                                                            className={MainStyle.ArticleMainFooterBCancel}
                                                                                                            onClick={() => {
                                                                                                                CancelReplyComment(false, element.comment_id, element2.comment_reply_id)
                                                                                                            }}>
                                                                                                        Cancel
                                                                                                    </button>
                                                                                                    <button style={{
                                                                                                        height: '33px',
                                                                                                        borderRadius: '2.5px',
                                                                                                        fontSize: '14px'
                                                                                                    }}
                                                                                                            disabled={!replyCommentBody[`reply${element.comment_id}`]}
                                                                                                            onClick={() => {
                                                                                                        PostReplyCommentID(false, element.comment_id, element2.comment_reply_id, index)
                                                                                                    }}>Post comment
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            })
                                                                            }
                                                                        </React.Fragment>
                                                                    }

                                                                </CommentDiv>
                                                            </React.Fragment>
                                                        }
                                                    </div>
                                                )
                                            }
                                        )
                                        }
                                    </CommentDiv>
                                }
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>

        </div>

    );
};

export default Article;