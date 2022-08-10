import React, {useEffect,useState} from 'react';
import styled from "styled-components";
import { darken} from 'polished';
import {RiArrowDropDownLine} from "react-icons/ri";
import {useLocation} from "react-router-dom";


const Div = styled.div.attrs(props =>({
    className: props.className
}))`
  display: flex;
  flex-direction: column;
  a {
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }

  svg {
    pointer-events: none;
  }
  
  button {
    color: ${(props) => props.allColor};
    cursor: pointer;
    height: ${(props) => props.buttonHeight};
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px;
    justify-content: center;
    background: ${(props) => props.backgroundColor};
    border: none;
    outline: none;
    font-size: ${(props) => props.fontSize};
    font-family: "Patua One", serif;;
    border-radius: 0;
    transition-duration: 0.30s;

    &:focus {
      outline: none;
    }
    &:hover {
      background: ${(props) => darken(0.05, props.backgroundColor)};
      -webkit-transition-duration: 0.30s; /* Safari */
      transition-duration: 0.30s;
    }

    &:active {
      background: ${(props) => darken(0.1, props.backgroundColor)};
    }
  }

  svg {
    color: ${(props) => props.color};
  }
`;

const DownButton = styled.button.attrs(props =>({
    className: props.className
}))`
  color : ${props => props.color} !important;
  svg{
    fill : ${props => props.color} ;
  }
  margin-left: auto;
  border-radius: ${props => props.radius} !important;
  width: ${(props) => props.width} !important;
  position: relative !important;
  box-shadow: ${props => props.shadow};
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${(props) => props.background} !important;
  transition-duration: 0.30s;
  &:hover {
    background: ${(props) => darken(0.05, props.background)} !important;
    -webkit-transition-duration: 0.30s; /* Safari */
    transition-duration: 0.30s;
  }

  &:active {
    background: ${(props) => darken(0.08, props.background)} !important;
  }

  svg {
    margin-left: auto;
  }
  span {
    flex: 1;
  }
`;

const DropdownList = styled.div.attrs(props => ({
    className: props.className
}))`
  position: absolute;
  z-index: 1;
  display: none;
  margin-top: 5px;
  flex-direction: column;
  //height: auto;
  height: ${(props) => props.allHeight};
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: ${(props) => props.overflow ? 'auto' : 'hidden'};
    -webkit-overflow-scrolling: touch;
  scrollbar-color: #98AFB3 #002329;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
     width: 18px;
  }

  &::-webkit-scrollbar:vertical {
    width: 10px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0px ${(props) => props.radius} ${(props) => props.radius} 0px;
    background-color: ${(props) => props.trackColor };;
  }

  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    border-radius: 0px ${(props) => props.radius} ${(props) => props.radius} 0px;
    background-clip: content-box;
    background-color: ${(props) => props.thumbColor};;
  }
  //transition:  .2s;
  //transition-duration: .5s;
  //transition-delay: .2s;
  //animation: zoom-in-zoom-out 2s;
  animation: zoom-out .15s;
    @keyframes zoom-out {
    0% {
      transform: scale(0.5, 0.5);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  
  //@keyframes zoom-in-zoom-out {
  //  0% {
  //    transform: scale(1, 1);
  //  }
  //  50% {
  //    transform: scale(1.5, 1.5);
  //  }
  //  100% {
  //    transform: scale(1, 1);
  //  }
  //}
  border-radius: ${(props) => props.radius};
  //overflow: hidden;
  margin-top: calc(${(props) => props.height} + ${(props) => props.top});
  margin-left: ${(props) => props.left};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  button {
    border-top: ${(props) => props.borderTwo};
    height: ${(props) => props.height};
    padding: ${(props) => props.overflow ? '15px 0px 15px 0px' : '0px'};

    width: ${(props) => props.width};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    //span {
    //  margin-right: auto;
    //}
    //svg {
    //  margin-right: auto;
    //}
  }
  button:nth-child(1){
    border-top: none;
  }
}
`;

const DropdownButton = ({
                            ButtonPrimaryTextColor,
                            ButtonAllTextColor,
                            FontSize,
                            ButtonAllBackground,
                            ButtonAllWidth,
                            ButtonAllHeight,
                            ButtonAllRadius,
                            ButtonPrimaryRadius,
                            ButtonPrimaryShadow,
                            ButtonBoxBorder,
                            ButtonPrimaryBackground,
                            ButtonPrimaryWidth = ButtonAllWidth,
                            ButtonPrimaryIcon,
                            Overflow,
                            BoxOverflowColor,
                            BoxAllHeight,
                            ButtonPrimaryChar,
                            BoxPosition,
                            Function,
                            ButtonFunctionChange,
                            ButtonCharList,
                            reset,
                            initialPrimary
                        }) => {

    //Primary Button all changeable functions///
    const [buttonPrimaryShadow, setButtonPrimaryShadow] = useState(ButtonPrimaryShadow)
    const [buttonPrimaryChar, setButtonPrimaryChar] = useState(ButtonPrimaryChar)

    //All Buttons changeable functions///
    const [buttonBoxBorder, setButtonBoxBorder] = useState(ButtonBoxBorder)

    const location = useLocation()



    const DropDown = (e) => {

        const closeDiv = e.target.parentElement.children[1]
        // closeDiv.style.opacity = closeDiv.style.opacity === 1 ? 0 : 1;
        // closeDiv.style.display = closeDiv.style.display === 'flex' ? 'none' : 'flex';
        closeDiv.style.display === 'flex' ? closeDiv.style.display = 'none' : closeDiv.style.display = 'flex';
        const closeDivs = document.querySelectorAll(".DropdownButtonDivX");
        for (let i = 0; i < closeDivs.length; i++) {
            if (closeDivs[i] !== closeDiv) {
                // closeDiv.style.opacity = 0;
                closeDivs[i].style.display = 'none';
            }
        }
        e.stopPropagation()
    }

    const ElseDrop = () => {
        // const DontTarget = ['DropdownButtonDivX', 'DontTargetMe']
        document.addEventListener('click', function (e) {
            let target = ''
            if (!e.target.closest){
                target = e.target.parentElement.className;
            }
            const closeDiv = document.querySelectorAll(".DropdownButtonDivX")
            if (!target.toString().includes("DontTargetMeXX")) {
                closeDiv.forEach(function(element){
                    // element.style.opacity = 0;
                    element.style.display = 'none';
                })
            }
        })
    }

    const ListClick = (e) => {
        const dis = e.target.innerHTML;
        setButtonPrimaryChar(ButtonFunctionChange === true ? dis : buttonPrimaryChar);
        Function(e.target)
        const closeDiv = document.querySelectorAll(".DropdownButtonDivX")
        closeDiv.forEach(function (element) {
            element.style.display = 'none';
        })
        e.stopPropagation()

    }

    const ChangeState = () => {
        setButtonPrimaryShadow(buttonPrimaryShadow !== true ? 'none' : 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' );
        setButtonBoxBorder(buttonBoxBorder !== true ? ['none', 'none']: ['1.3px solid lightgrey', '1.3px solid lightgrey']);
    }


    useEffect(() => {
        ElseDrop()
        ChangeState()
    }, []);

    useEffect(() => {
        setButtonPrimaryChar(ButtonPrimaryChar)
    }, [reset]);

    useEffect(() => {
        if (ButtonFunctionChange && ButtonCharList[0] !== 'Hello' && !reset)
            setButtonPrimaryChar(ButtonCharList[0] )
    }, [location.pathname]);

    return (
        <Div
            allColor={ButtonAllTextColor}
            buttonHeight={ButtonAllHeight}
            backgroundColor={ButtonAllBackground}
            fontSize={FontSize}
            className={"DontTargetMeXX"}
        >
            <DownButton onClick={DropDown}
                        type={'button'}
                        width={ButtonPrimaryWidth}
                        className={"DontTargetMeXX"}
                        background={ButtonPrimaryBackground}
                        color={ButtonPrimaryTextColor}
                        radius={ButtonPrimaryRadius}>
                <span>{buttonPrimaryChar}</span><RiArrowDropDownLine size={33} style={{display: ButtonPrimaryIcon}}/>
            </DownButton>
            <DropdownList
                allHeight={BoxAllHeight}
                overflow={Overflow}
                height={ButtonAllHeight}
                width={ButtonAllWidth}
                trackColor={BoxOverflowColor[0]}
                thumbColor={BoxOverflowColor[1]}
                className={"DropdownButtonDivX DontTargetMeXX"}
                left= {BoxPosition[0]}
                top = {BoxPosition[1]}
                radius = {ButtonAllRadius}
                border ={buttonBoxBorder[0]}
                borderTwo = {buttonBoxBorder[1]}
            >
                {ButtonCharList.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            <button type={'button'} onClick={ListClick}>{item}</button>
                        </React.Fragment>

                    )
                })
                }
            </DropdownList >
        </Div>
    );
};

DropdownButton.defaultProps = {
    ButtonPrimaryTextColor:'black',
    ButtonAllTextColor:'black',
    FontSize : '15px',
    ButtonAllBackground : 'white',
    ButtonAllHeight: '35px',
    ButtonAllWidth: '100px',
    ButtonAllRadius: '3px' ,
    ButtonPrimaryRadius: '3px',
    ButtonPrimaryShadow : true,
    ButtonBoxBorder : false,
    BoxAllHeight: 'auto',
    ButtonPrimaryBackground : 'red',
    ButtonPrimaryWidth : '100px',
    ButtonPrimaryIcon : 'none',
    BoxOverflowColor: ['black', 'white'],
    Overflow: false,
    ButtonPrimaryChar : 'none',
    BoxPosition : ['0', '10px'],
    Function : function (e) {
    },
    ButtonFunctionChange : true,
    ButtonCharList : ['Hello', 'Hello'],
    reset: true,
    initialPrimary: 'Select name'
};

export default DropdownButton;