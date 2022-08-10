import React from "react";
import styled from "styled-components";
import { Tooltip } from '@mui/material';

const InputDiv = styled.div.attrs(props => ({
    className: props.className
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: ${(props) => props.width};
  height: ${(props) => props.height};
  border: ${(props) => props.border};
  border-radius: ${(props) => props.borderRadius};
  outline: none;
  padding: ${(props) => props.padding};
  transition: all 0.7s ease 0s;
  background: ${(props) => props.background};
  input {
    border: none;
    height: 100%;
    width: 100%;
    margin-right: auto;
    &::-ms-reveal, &::-ms-clear {
      display: none;
    }
  }
  &:focus-within {
    border-color: ${(props) => props.borderFocusColor};
  }


`;


const SvgDiv = styled.div.attrs(props => ({
    className: props.className
}))`
  
  margin-left: auto;
  //width: 20px !important;
  svg {
    padding-left: 2px;
  }

`;

const InputFieldSave = ({
                            Width,
                            Height,
                            Border,
                            BorderRadius,
                            BorderFocusColor,
                            Onchange,
                            ClassName,
                            Icon,
                            PlaceHolder,
                            DefaultValue,
    Padding,
    Background,
                        }) => {

    return (
        <Tooltip title={'flgjnhgfs'}>
        <InputDiv width={Width}
                  height={Height}
                  border={Border}
                  borderRadius={BorderRadius}
                  padding={Padding}
        background={Background}
                  borderFocusColor={BorderFocusColor}>
            <input type={'text'} placeholder={PlaceHolder} onChange={Onchange} className={ClassName}
                   defaultValue={DefaultValue}/>
                <SvgDiv>
                    {Icon}
                </SvgDiv>

        </InputDiv>
        </Tooltip>
    );
};

InputFieldSave.defaultProps = {
    Width: "200px",
    Height: "30px",
    Border: "none",
    BorderFocusColor: 'black',
    OnChange: null,
    ClassName: 'form-control',
    Icon: '',
    PlaceHolder: 'Original',
    Padding: '5px',
    Background: 'white'

};


export default InputFieldSave;