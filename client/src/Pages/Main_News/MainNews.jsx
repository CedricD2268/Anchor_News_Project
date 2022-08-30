import React, {useState} from 'react';
import styles from '../../Assets/scss/Main_News/Base.module.css'
import {useEffect} from "react";
import Header from './Header/Header'
import Sidebar from "./Sidebar/Sidebar";
import CroppieUser from "./Settings/CroppieUser";
import NavbarButtons from "../../Components/MainStudio/NavbarButtons";
import {useWindowWidth} from "@react-hook/window-size";


const MainNews = ({pageName}) => {
    const [dState, setDState] = useState(true);
    const w_size = useWindowWidth()
    const [xD, setXd] = useState(0);
    const [xY, setXy] = useState(0);


    const SidebarSize = 1697;



    function PageClick() {
        const button = document.querySelector("#SidebarOverlay");
        button.addEventListener('click', () => {
            setDState(false)
        });
    }

    function CloseClick2() {
        if (dState){
            setDState(false)
        }
    }


    function SidebarClick(){
        setDState(dState === false);
        if ( w_size < SidebarSize && dState === false) {
            setXd(1);
        }
        if ( w_size > SidebarSize && dState === true) {
            setXd(0);
        }
    }

    function SidebarResize() {
        if ( w_size > SidebarSize && dState === false && xY === 1) {
            setXy(0);
        }
        if (w_size < SidebarSize && dState === true && xD === 0) {
            setDState(dState === false)
            setXy(1)
        }
        if (w_size > SidebarSize && dState === true && xD === 1){
            setXd(0);
        }
        if (w_size > SidebarSize && dState === false && xY === 1) {
            setDState(dState === false)
        }

    }
    useEffect(() =>
        SidebarResize()
    , [w_size]);

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
