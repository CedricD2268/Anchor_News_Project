import React, {useEffect, useState} from 'react';
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'
import StudioStyle from '../../Assets/scss/Main_News/Studio.module.css'
import {RiDeleteBin2Line} from "react-icons/ri";
import {IoMdOpen} from "react-icons/io";
import CardImage from '../../Assets/Images/website_background_images/FileSave.png'
import SuccessIcon from "../../Components/Icon/SuccessIcon";
import {BsFillFileEarmarkTextFill, BsThreeDotsVertical} from "react-icons/bs";
import DropdownButton from "../../Components/MainStudio/DropdownButton";
import {useNavigate} from "react-router-dom";
import {GetBoxChart} from "../../Actions";
import {useDispatch} from "react-redux";
import {FaReadme} from "react-icons/all";
import NewDateConvertUtc from "../../Components/MainStudio/NewDateConvertUtc";
import SkeletonElement from "../../Components/Skeleton/SkeletonElement";
import SaveStudioIcon from "../../Components/Icon/SaveStudioIcon";

const CardStudio = ({DeleteState,  View, Data}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [date, setDate] = useState('')
    const [skeleton, setSkeleton] = useState(true)

    const DeleteArticle = async (articleId) => {
        const data = {name: articleId}
        try {
            const res = await fetch('http://localhost:5000/studio/delete/article_by_id', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
        } catch (err) {
            console.error(err.message)

        }
    }

    useEffect(() => {

        setDate(NewDateConvertUtc(Data && Data.inreviewdate ? Data.inreviewdate: null))
          setTimeout(() => {
              setSkeleton(false)
          }, 1000);
    }, [])


    return (
        <React.Fragment>
            <div onClick={() => {
                !View.published ? navigate(`../../editor/${Data && Data.articleid ? Data.articleid: null }`) : dispatch(GetBoxChart({active: true, data: Data}))
            }} className={StudioStyle.Card}>
                {skeleton ? (
                    // <SkeletonStudioArticleHeader/>
                    <SkeletonElement Margin={'0px'} BorderRadius={'3px'} Width={'100%'} MinWidth={'100%'}
                                     Height={'140px'} Background={'#ddd'}/>
                ) : (
                    <div className={StudioStyle.CardImage}>
                        {Data && Data.imagew ? (<img alt='Card image' src={Data.imagew}/>)
                            : (
                                // <img alt='Card image' src={CardImage}/>
                                <SaveStudioIcon color={'#CAD2C5'}/>

                            )
                        }
                    </div>
                )
                }
                <div className={StudioStyle.CardFooter}>
                    <div className={StudioStyle.CardFooterOne}>
                        {skeleton ? (
                            <React.Fragment>
                                <SkeletonElement Margin={'3px'} BorderRadius={'3px'} Width={'50%'} MinWidth={'50%'}
                                     Height={'15px'} Background={'#ddd'}/>
                                <SkeletonElement Margin={'3px'} BorderRadius={'3px'} Width={'100%'} MinWidth={'100%'}
                                     Height={'13px'} Background={'#ddd'}/>
                            </React.Fragment>
                            // <SkeletonStudioArticleFooter/>
                        ) : (
                            <React.Fragment>
                                <div>
                            <span>
                                {View && View.success ? (<SuccessIcon size={23}/>) :
                                    (<BsFillFileEarmarkTextFill size={23} color={'#cad2c5'}/>)}
                                {Data && Data.title ? Data.title : 'Untitled document'}  </span>
                                </div>
                                {View.inReview &&
                                    (<span>InReview since {date}</span>)
                                }
                                {View.published &&
                                    (
                                        <span>Published {Data && Data.modifieddate ? Data.modifieddate : null} ago</span>)
                                }
                                {View.draft &&
                                    (
                                        <span>Last modified {Data && Data.modifieddate ? Data.modifieddate : null} ago</span>)
                                }

                            </React.Fragment>
                        )
                        }
                    </div>
                    {!skeleton && (
                        <div className={StudioStyle.CardFooterTwo}>
                            <DropdownButton
                                ButtonAllTextColor={"white"}
                                ButtonPrimaryTextColor={'black'}
                                ButtonPrimaryBackground={'white'}
                                ButtonAllBackground={"#173b3c"}
                                ButtonFunctionChange={false}
                                ButtonAllWidth={'150px'}
                                ButtonPrimaryWidth={'100%'}
                                ButtonPrimaryIcon={'none'}
                                BoxPosition={['-110px', '-105px']}
                                FontSize={'14.5px'}
                                ButtonBoxBorder={true}
                                ButtonAllRadius={'3px'}
                                ButtonPrimaryRadius={'50%'}
                                ButtonAllHeight={'32px'}
                                ButtonPrimaryChar={<BsThreeDotsVertical size={23}/>}

                                ButtonCharList={[<div className={VariableStyle.DropListDiv}>{View.published ?
                                    (<React.Fragment><IoMdOpen
                                        size={20}/><span>Open data chart</span></React.Fragment>) :
                                    <React.Fragment><IoMdOpen
                                        size={20}/><span>Open article</span></React.Fragment>
                                }
                                </div>,
                                    <div className={VariableStyle.DropListDiv}>{View.published ?
                                        (<React.Fragment> <FaReadme
                                            size={20}/><span>Read article</span></React.Fragment>) :
                                        <React.Fragment><RiDeleteBin2Line size={22}/>
                                            <span>Delete article</span></React.Fragment>
                                    }

                                    </div>]}
                                Function={function (e) {
                                    if (e.textContent === 'Open article') {
                                        navigate(`../../editor/${Data && Data.articleid ? Data.articleid: null}`)
                                    }
                                    if (e.textContent === 'Open data chart') {
                                        dispatch(GetBoxChart({active: true, data: Data}))
                                    }
                                    if (e.textContent === 'Delete article') {
                                        DeleteArticle(Data && Data.articleid ? Data.articleid: null )
                                        DeleteState()
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

        </React.Fragment>

    );
};

CardStudio.defaultProps = {
    Success: false,
    LinkName: '',
    DeleteState: function (e) {
    },
    DateP: '1999-09-01T03:12:41.890Z',
    Data: null
};

export default CardStudio;