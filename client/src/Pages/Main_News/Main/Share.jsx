import React, {useEffect, useRef, useState} from 'react'
import MainStyle from '../../../Assets/scss/Main_News/Main.module.css';
import {GetOverlayRx} from "../../../Actions";
import {
    AiFillTwitterCircle,
    BsFacebook,
    BsPinterest,
    BsReddit,
    GrClose,
    IoCopySharp,
    TiSocialLinkedinCircular
} from "react-icons/all";
import VariableStyle from "../../../Assets/scss/VariableTwo.module.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";
import {BsWhatsapp} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";
import { Tooltip } from '@mui/material';
import {useLocation} from "react-router-dom";


const Share = ()=>{

    const location = useLocation()
    const dispatch = useDispatch()
    const overlay = useSelector((state) => state.overlay)
    const [copied, setCopied] = useState(false)

    const copiedText = <span style={{fontSize: '17px', transition: 'all 0.5s ease 0s' }}> COPIED!</span>

    useEffect(() => {
        setTimeout(() => {
            setCopied(false)
        }, 2000);
    }, [copied]);

    useEffect(() => {
        dispatch(GetOverlayRx({
            share: {
                ov: false,
                url: ''
            }
        }))
    }, [location.pathname]);


    return(
        <React.Fragment>
            {
            overlay.share.ov &&
                <div className={VariableStyle.PopUpOverlayTwo} onClick={(e)=>{
                    if (e.target && e.target.classList && e.target.classList.contains(VariableStyle.PopUpOverlayTwo) )
                    dispatch(GetOverlayRx({share: {ov: false}}))
                }}>
                    <div className={MainStyle.ShareBox}>
                        <div className={MainStyle.ShareTitleClose}>
                            <span>Share</span>
                            <button onClick={() => {
                                dispatch(GetOverlayRx({
                                    share: {
                                        ov: false,
                                        url: ''
                                    }
                                }))
                            }}><GrClose size={20}/></button>
                        </div>
                        <div className={MainStyle.ShareButtons}>
                            <WhatsappShareButton url={overlay.share.url}>
                                <BsWhatsapp size={42}/>
                            </WhatsappShareButton>
                            <FacebookShareButton url={overlay.share.url}>
                                <BsFacebook size={40}/>
                            </FacebookShareButton>
                            <TwitterShareButton url={overlay.share.url}>
                                <AiFillTwitterCircle size={47}/>
                            </TwitterShareButton>
                            <RedditShareButton url={overlay.share.url}>
                                <BsReddit size={43}/>
                            </RedditShareButton>
                            <LinkedinShareButton url={overlay.share.url}>
                                <TiSocialLinkedinCircular size={56}/>
                            </LinkedinShareButton>

                        </div>
                        <div className={MainStyle.ShareCopy}>
                            <span>{overlay.share.url}</span>
                            <CopyToClipboard text={overlay.share.url} onCopy={()=>{
                            setCopied(true)
                            }}>
                            <Tooltip title={copied ? copiedText: ''}>
                            <button><IoCopySharp color={'white'} size={17.5}/></button>
                            </Tooltip>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
        }

        </React.Fragment>
    )
}

export default  Share