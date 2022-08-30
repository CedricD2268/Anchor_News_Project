import React from 'react';
import BaseStyle from '../Assets/scss/Main_News/Base.module.css'
import {createGlobalStyle} from "styled-components";
import background from "../Assets/Images/website_background_images/404.jpg";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const PageNotFound = () => {

    const navigate = useNavigate()
    const profile = useSelector((state) => state.profileView);

    return (
        <div className={BaseStyle.errorPage}>
            <img alt={'background'} src={background}/>
            <div>
                <button onClick={()=>{
                    navigate(`/njt/home/saved/${profile && profile.defaulttopic ? profile.defaulttopic: 'undef'}`)
                }}>Return Home</button>
            </div>
        </div>

    )
}

export default PageNotFound;