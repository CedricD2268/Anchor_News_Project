import React, {useState} from 'react';
import styles from '../../Assets/scss/Main_News/Base.module.css'
import {useEffect} from "react";
import Header from './Header/Header'
import Sidebar from "./Sidebar/Sidebar";
import CroppieUser from "./Settings/CroppieUser";
import NavbarButtons from "../../Components/MainStudio/NavbarButtons";


const MainNews = ({pageName}) => {
    const [count, setCount] = useState(0);
    const [dState, setDState] = useState(true);
    const [xD, setXd] = useState(0);
    const [xY, setXy] = useState(0);


    window.addEventListener('resize', function () {
        setCount(window.innerWidth)
    });

    const SidebarSize = "1697px";



    function PageClick() {
        const button = document.querySelector("#SidebarOverlay");
        button.addEventListener('click', () => {
            setDState(false)
        });
    }

    function CloseClick2() {
            setDState(dState === false)
    }


    function SidebarClick(){
        setDState(dState === false);
        if (window.matchMedia("(max-width:" +SidebarSize+")").matches && dState === false) {
            setXd(1);
        }
        if (window.matchMedia("(min-width:" +SidebarSize+")").matches && dState === true) {
            setXd(0);
        }
    }

    function SidebarResize() {
        if (window.matchMedia("(min-width:" +SidebarSize+")").matches && dState === false && xY === 1) {
            setXy(0);
        }
        if (window.matchMedia("(max-width: " +SidebarSize+")").matches && dState === true && xD === 0) {
            setDState(dState === false)
            setXy(1)
        }
        if (window.matchMedia("(min-width: " +SidebarSize+")").matches && dState === true && xD === 1){
            setXd(0);
        }
        if (window.matchMedia("(min-width:" +SidebarSize+")").matches && dState === false && xY === 1) {
            setDState(dState === false)
        }

    }
    useEffect(() =>
        SidebarResize()

    , [count]);

    useEffect(() => {
        PageClick()
    }, []);

    useEffect(() => {
        document.body.classList.add(styles.body_main_news)
    }, []);

    return (
        <div id='MainContentContainer'>
            <Sidebar DisState={dState} Close={()=>{CloseClick2()}} />
            <CroppieUser/>
            <React.Fragment key={1}>
                <NavbarButtons Fixed={true} buttonClick={SidebarClick}/>
            </React.Fragment>
            <div className={styles.wrapper}>
                <Header buttonClick={SidebarClick}/>
                <React.Fragment key={2}>
                    <NavbarButtons/>
                </React.Fragment>
                {pageName}
            </div>
        </div>

    );
};

export default MainNews;
