import React, {useEffect, useState} from 'react';
import MainStyle from "../../Assets/scss/Main_News/Main.module.css";
import styled from "styled-components";
import GetHeadlineColor from "./GetHeadlineColor";
import Pic from "../../Assets/Images/website_background_images/Image_1.jpg";
import DropdownButton from "./DropdownButton";
import {BsThreeDotsVertical} from "react-icons/bs";
import {MdOutlineLibraryAdd} from "react-icons/md";
import VariableStyle from "../../Assets/scss/VariableTwo.module.css";
import {IoIosShareAlt} from "react-icons/io";
import { MdRemoveCircleOutline} from "react-icons/all";
import SkeletonElement from "../Skeleton/SkeletonElement";
import UseWindowSize from "../../Components/MainStudio/UseWindowSize";
import {useLocation} from "react-router-dom";
import {GetOverlayRx} from "../../Actions";
import {useDispatch} from "react-redux";
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from '@react-hook/window-size'
import LazyLoad from 'react-lazy-load';
import AddCollectionIcon from "../Icon/AddCollectionIcon";


const SvgDiv = styled.div`
  margin-left: auto;
`;

const Footer = styled.div.attrs(props => ({
    className: props.className
}))`
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
`;

const Head = styled.div.attrs(props => ({
    className: props.className
}))`
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;

const Span = styled.span`
  width: 100%;
  @media screen and (max-width: 930px) {
    max-width: 200px;
  }
  @media screen and (max-width: 690px) {
    max-width: 150px;
  }
  @media screen and (max-width: 630px) {
    max-width: 220px;
  }
  @media screen and (max-width: 353px) {
    max-width: 160px;
  }
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;


// const GetHeadlineColor = (target) => {
//         for (const item of HeadlineLineColor) {
//             if (item.headlineTitle === target) {
//                 return (item)
//             }
//         }
// }

const DropDownButtonComponent = ({Color, BoxPosition, ButtonAllWidth, FontSize, IconSize, SecondButton,SaveFunc,ShareFunc, RemoveFunc }) => {

    return (
        <React.Fragment>
            <DropdownButton
                ButtonAllTextColor={"white"}
                ButtonPrimaryTextColor={Color}
                ButtonPrimaryBackground={'transparent'}
                ButtonAllBackground={"#52796f"}
                ButtonFunctionChange={false}
                ButtonAllWidth={ButtonAllWidth}
                ButtonPrimaryWidth={'100%'}
                ButtonPrimaryIcon={'none'}
                BoxPosition={BoxPosition}
                FontSize={FontSize}
                ButtonBoxBorder={true}
                ButtonAllRadius={'6px'}
                ButtonAllHeight={'40px'}
                ButtonPrimaryChar={<BsThreeDotsVertical size={IconSize[0]}/>}
                ButtonCharList={[
                    <div className={VariableStyle.DropListDiv}>
                        <IoIosShareAlt size={IconSize[1]}/>
                        <span>Share article</span>
                    </div>,
                    <div className={VariableStyle.DropListDiv}>
                        {SecondButton === 'Save in library' &&
                            <AddCollectionIcon size={IconSize[2]}/>
                        }
                        {SecondButton === 'Remove' &&
                            <MdRemoveCircleOutline size={IconSize[2]}/>
                        }

                        <span>{SecondButton}</span>
                    </div>
                ]}
                Function={(e) => {
                    if (e.textContent === 'Save in library')
                        SaveFunc()

                    if (e.textContent === 'Share article')
                        ShareFunc()

                    if (e.textContent === 'Remove')
                        RemoveFunc()

                }}
            />
        </React.Fragment>
    )
}

DropDownButtonComponent.defaultProps={
    IconSize: [21, 19, 22],
    ButtonAllWidth:'155px',
    FontSize:'15px',
    SecondButton: 'Save in library',
    SaveFunc: ()=>{},
    ShareFunc:()=>{},
    RemoveFunc:()=>{}
}

const BoxContentOne = ({ArticleTitle,
                        ArticleHeader,
                        ArticleImage,SaveFunc,ShareFunc, RemoveFunc, ContentClick}) => {

    const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)
    const [backgroundColor, setBackgroundColor] = useState();
    const [color, setColor] = useState();
    const [load, setLoad] = useState(false)

    const size = useWindowWidth();


    const location = useLocation()


    useEffect(() => {
        const item = ArticleHeader ? GetHeadlineColor({target: ArticleHeader, option: 'full'}) : GetHeadlineColor({target: 'Opinion', option: 'full'})
        setBackgroundColor(item.background)
        setColor(item.color)
        setTimeout(() => {
            setLoad(true)
        }, 850);
        setLoad(false)
    }, [location.pathname])

    return (
        <div className={MainStyle.HeadlineOneCard}

             style={{margin: load ? '0 auto' : ''}}
             onClick={()=>{ContentClick()}}
        >
            {load ? (<React.Fragment>
                <div className={MainStyle.HeadlineOneCardHeader}>
                    <div className={MainStyle.HeadlineOneCardImage}>
                        <img alt='headline' src={ArticleImage ? ArticleImage : ''}/>
                    </div>
                    <div className={MainStyle.HeadlineOneCardDesc}>
                        <span>
                        <ResponsiveEllipsis
                            text={ArticleTitle}
                            maxLine='3'
                            ellipsis='...'
                            trimRight
                            basedOn='letters'
                        />
                        </span>
                    </div>
                </div>
                <Footer backgroundColor={backgroundColor} color={color} className={MainStyle.HeadlineOneFooter}>
                    <span>
                        {ArticleHeader}
                    </span>
                    <SvgDiv>
                        <DropDownButtonComponent
                            Color={color}
                            BoxPosition={['-111px', '-124px']}
                            IconSize={[25, 23, 23]}
                            ButtonAllWidth={'170px'}
                            FontSize={'16px'}
                            ShareFunc={()=>{SaveFunc()}}
                            RemoveFunc={()=>{RemoveFunc()}}
                            SaveFunc={()=>{ShareFunc()}}/>
                    </SvgDiv>
                </Footer>

            </React.Fragment>) : (<React.Fragment>
                <SkeletonElement
                    Height={'auto'}
                    Width={'auto'}
                    AspectRatio={size > 1000 ? '0.764 / 1' :'0.787 / 1'}
                    Margin={0}/>
                <SkeletonElement Margin={'15px 5px 5px 5px'} BorderRadius={'4px'} Width={'50%'} MinWidth={'50%'} Height={'19.5px'}/>
                <SkeletonElement Margin={'5px'} BorderRadius={'4px'} Width={'90%'} MinWidth={'90%'} Height={'12.5px'}/>
                <SkeletonElement Margin={'5px 5px 15px 5px'} BorderRadius={'4px'} Width={'90%'} MinWidth={'90%'} Height={'12.5px'}/>
            </React.Fragment>)

            }
        </div>

    );
};
BoxContentOne.defaultProps={
    SaveFunc: ()=>{},
    ShareFunc:()=>{},
    RemoveFunc:()=>{},
    ContentClick:()=>{}
}

const BoxContentTwo = ({
                           ArticleTitle,
                           ArticleHeader,
                           ArticleImage,
                           Avatar,
                           AvatarName,
                           ArticleStats,
    SecondButton,SaveFunc,ShareFunc, RemoveFunc, ContentClick
                       }) => {

    const [backgroundColor, setBackgroundColor] = useState();
    const [color, setColor] = useState();
    const [dropPrimaryColor, setDropPrimaryColor] = useState('black');
    const [size, setSize] = useState();
    // const [avatarBoolean, setAvatarBoolean] = useState(false);
    const [load, setLoad] = useState(false)

    const sizeW = useWindowWidth();
    const location = useLocation()


    useEffect(() =>{
        const item = ArticleHeader ? GetHeadlineColor({target: ArticleHeader, option: 'full'}): GetHeadlineColor({target: 'Opinion', option: 'full'})
        setBackgroundColor(item.background)
        setColor(item.color)
        setDropPrimaryColor(item.color)
        setSize('18px')
        if (ArticleHeader === 'Opinion') {
            setSize('15.8px')
        }
        // setAvatarBoolean(AvatarName !== false ? true : false)
        setTimeout(() => {
            setLoad(true)
        }, 850);
        setLoad(false)
    }, [location.pathname])

    return (

        <div className={MainStyle.HeadlineTwoCard} onClick={()=>{ContentClick()}} >

            {load ? (<React.Fragment>
                <div className={MainStyle.HeadlineTwoHeader}>
                    <Head backgroundColor={backgroundColor} size={size} color={color}
                          className={MainStyle.HeadlineTwoCardType}>
                        {AvatarName ? (
                            <React.Fragment>
                                <img alt='User Avatar' src={Avatar}/>
                                <Span>{AvatarName}</Span>
                            </React.Fragment>
                        ) : (
                            <span>
                        {ArticleHeader}
                    </span>
                        )}
                        <SvgDiv>
                            <DropDownButtonComponent
                                Color={color}
                                BoxPosition={['-110px', '6px']}
                                SecondButton={SecondButton}
                                ShareFunc={()=>{SaveFunc()}}
                                RemoveFunc={()=>{RemoveFunc()}}
                                SaveFunc={()=>{ShareFunc()}}/>
                        </SvgDiv>
                    </Head>
                    <div className={MainStyle.HeadlineTwoCardImage}>
                        <img alt='Article' src={ArticleImage ? ArticleImage: ''}/>
                    </div>
                </div>
                        <div className={MainStyle.HeadlineTwoCardFooter}>
                            <div className={MainStyle.HeadlineTwoCardDesc}>

                            <span>

                        <LinesEllipsis
                            text={ArticleTitle}
                            maxLine='3'
                            ellipsis='...'
                            trimRight
                            basedOn='letters'
                        />

                        </span>

                            </div>
                            <div className={MainStyle.HeadlineThreeCardDescTwo}>
                                {ArticleStats[0].length > 0 && (
                                    <React.Fragment>
                                        <span>{ArticleStats && ArticleStats[0]  ? parseInt(ArticleStats[0]) === 1 ? '1 Read' : `${ArticleStats[0]} Reads`: '0 Reads'}</span>
                                        <span>{ArticleStats && ArticleStats[1] ? ArticleStats[1]: '0 days'} ago</span>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                </React.Fragment>) :
                (<React.Fragment>
                    <SkeletonElement
                        Height={'auto'}
                        MinWidth={'160px'}
                        MaxWidth={''}
                        Margin={0}
                        AspectRatio={'1.9 / 1'}
                    Background={'#cad2c5'}/>
                    <SkeletonElement Margin={'10px 3px 3px 3px'} BorderRadius={'3px'} Width={'50%'} MinWidth={'50%'}
                                     Height={'19px'} Background={'#cad2c5'}/>
                    <SkeletonElement Margin={'3px'} BorderRadius={'3px'} Width={'90%'} MinWidth={'90%'}
                                     Height={'12px'} Background={'#cad2c5'}/>
                </React.Fragment>)
            }
        </div>
    );
};


BoxContentOne.defaultProps={
    SaveFunc: ()=>{},
    ShareFunc:()=>{},
    RemoveFunc:()=>{},
    ContentClick:()=>{}
}


const BoxContent = ({
                        Long,
                        ArticleTitle,
                        ArticleHeader,
                        ArticleImage,
                        Avatar,
                        AvatarName,
                        ArticleStats,
    SecondButton,SaveFunc,ShareFunc, RemoveFunc, ContentClick
                    }) => {

    return (
        <React.Fragment>
            {Long ? <BoxContentOne
                    ArticleTitle={ArticleTitle}
                    ArticleImage={ArticleImage}
                    ArticleHeader={ArticleHeader}
                    ShareFunc={(()=>{SaveFunc()})}
                    SaveFunc={(()=>{ShareFunc()})}
                    ContentClick={(()=>{ContentClick()})}
                /> :
                <BoxContentTwo
                    ArticleHeader={ArticleHeader}
                    ArticleImage={ArticleImage}
                    ArticleTitle={ArticleTitle}
                    Avatar={Avatar}
                    AvatarName={AvatarName}
                    ArticleStats={ArticleStats}
                    SecondButton={SecondButton}
                    ShareFunc={()=>{SaveFunc()}}
                    RemoveFunc={()=>{RemoveFunc()}}
                    SaveFunc={()=>{ShareFunc()}}
                    ContentClick={(()=>{ContentClick()})}/>}
        </React.Fragment>
)

}

BoxContent.defaultProps ={
    Long: false,
    ArticleTitle : 'none',
    ArticleHeader : 'Opinion',
    ArticleImage: Pic,
    Avatar: '',
    AvatarName: false,
    ArticleStats: ['', ''],
    SaveFunc: ()=>{},
    ShareFunc: ()=>{},
    RemoveFunc: ()=>{},
    ContentClick:()=>{}

}


export default BoxContent
