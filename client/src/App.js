import React, { useEffect, useState} from 'react';
import './App.css';
import LoginRegister from './Pages/Login_Register/Login-Register'
import Login from './Pages/Login_Register/Login'
import Register from "./Pages/Login_Register/Register";
import Identification from "./Pages/Login_Register/Identification";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Reset from "./Pages/Login_Register/Reset";
import MainNews from "./Pages/Main_News/MainNews";
import Settings from "./Pages/Main_News/Settings/Settings";
import Footer from "./Pages/Main_News/Footer/Footer";
import Article from "./Pages/Main_News/Main/Article";
import HeaderStudio from "./Pages/NewsStudio/HeaderStudio";
import EditorStudio from "./Pages/NewsStudio/EditorStudio";
import styles from "./Assets/scss/Main_News/Base.module.css";
import PageNotFound from "./Pages/PageNotFound";
import {useSelector, useDispatch} from 'react-redux';
import {GetOverlayRx, LoginRx, ViewProfileRx} from './Actions';
import {LogoutRx} from './Actions';
import SidebarTwo from "./Pages/Main_News/Sidebar/SidebarTwo";
import EditorPageStudio from "./Pages/NewsStudio/EditorPageStudio";
import VariableStyle from "./Assets/scss/VariableTwo.module.css";
import LoadingSpinnerTwoIcon from "./Components/Icon/LoadingSpinnerTwoIcon";
import Headline from "./Pages/Main_News/Main/Headline";
import SidebarGetLibrary from "./Pages/Main_News/Sidebar/SidebarGetLibrary";
import RemoveAccount from "./Pages/Main_News/Settings/RemoveAccount";
import Main from "./Pages/Main_News/Main/Main";
import Share from "./Pages/Main_News/Main/Share";
import Support from "./Pages/Main_News/Main/Support";
import Logout from "./Components/LoginRegister/Logout";
import update from "react-addons-update";

const LoginRegisterRoutes = () => {
    return (
        <div>
            <Routes>
                <Route  exact path={`login`} element={<LoginRegister pageName={"Login"} pageUrlName={<Login/>}/>}/>
                <Route  exact path={`register`} element={<LoginRegister pageName={"Register"} pageUrlName={<Register/>}/>}/>
                <Route  path={`login/identify`} element={<LoginRegister pageName={"Forgot Password"} pageUrlName={<Identification/>}/>}/>
                <Route  path={`login/reset/:email/:id/:token`} element={<LoginRegister pageName={"Reset Password"} pageUrlName={<Reset/>}/>}/>
                <Route path='*' element={<Navigate to={'/404'}/>}/>
             </Routes>
        </div>
    )
};


const FeedRoutes = () => {
    return (
        <div className={styles.wrapper}>
            <Routes>
                <Route exact path={`article/:article_name/:article_id`} element={<Article/>}/>
                <Route exact path={`topics/science`} element={<Main type={'Topic'} name={'Politics'} />}/>
                <Route exact path={`follow/:follow_user_name/:follow_full_name`} element={<Headline HeadlineType={'Following'}/>}/>
                <Route exact path={`library/collection/:collection_name/:collection_id`} element={<Headline HeadlineType={'Library'}/>}/>
                <Route exact path={`homeT/search/:home_query`} element={<Headline HeadlineType={'Search'}/>}/>
                <Route exact path={`homeT/allfollowing`} element={<Headline HeadlineType={'AllFollowing'}/>}/>
                <Route exact path={`homeT/history`} element={<Headline HeadlineType={'History'}/>}/>
                <Route exact path={`homeT/liked`} element={<Headline HeadlineType={'Liked'}/>}/>
                <Route exact path={`homeT/explore/:explore_id`} element={<Headline HeadlineType={'Explore'}/>}/>
                <Route path='*' element={<Navigate to={'/404'}/>}/>
            </Routes>
        </div>
    )
};


const HomeButtonRoutes = () => {
    return (
        <div className={styles.wrapper}>
            <Routes>
                <Route exact path={'saved/:topic_name'} element={<Main type={'Home'}/>}/>
                <Route exact path={'unsaved/:routeId'} element={<Main type={'Topic'}/>}/>
                <Route path='*' element={<Navigate to={'/404'}/>}/>
            </Routes>
        </div>
    );
};

const StudioEditorRoutes = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route exact path={`home/*`} element={<HeaderStudio/>}/>
                <Route exact path={`editor/:articleId`} element={<EditorStudio/>}/>
                <Route exact path={`editor_page/:rowName/:rowId`} element={<EditorPageStudio/>}/>
                <Route path='*' element={<Navigate to={'/404'}/>}/>
            </Routes>
        </React.Fragment>
    )
};

const SpinnerStudio = () => {
    return (
        <div className={VariableStyle.LoadingSpinnerTwo}>
            <LoadingSpinnerTwoIcon size={100}/>
        </div>
    )
}

const NJTOverlays = () => {
const overlay = useSelector((state) => state.overlay)
    return (
        <div style={{width: '100%'}}>
            <div className={styles.wrapper}>
                <SidebarTwo OverlayRX={overlay.sidebarTwo} Radius={'8px'}/>
            </div>
            <RemoveAccount/>
            <Support/>
            <Share/>
            <SidebarGetLibrary/>
        </div>
    );
};


const NJTRoutes = () => {
    const [spinner, setSpinner] = useState(false)
    const [empty, setEmpty] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setEmpty(true)
            setSpinner(true)
        }, 1500);
    }, [])

    return (
        <div className='MainPageContainer'>
            <div className='ContentWrapper'>
                <NJTOverlays/>
                {empty &&(<MainNews/>)}
                <Routes>
                    <Route path={`home/*`} element={spinner ?(<HomeButtonRoutes/>):(<SpinnerStudio/>) }/>
                    <Route path={`settings/*`} element={spinner? (<Settings/>): (<SpinnerStudio/>)}/>
                    <Route path={`feed/*`} element={spinner? (<FeedRoutes/>):(<SpinnerStudio/>) }/>
                    <Route path='*' element={spinner? <Navigate to={'/404'}/>:(<SpinnerStudio/>)}/>
                </Routes>
            </div>
            {empty && (
                <div className={styles.wrapper}>
                     <Footer/>
                </div>
               )}
        </div>
    )
};

const App = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.logged);
    const profile = useSelector((state) => state.profileView);
    const location = useLocation()

    const Verify = async () => {
        try {
            const res = await fetch('http://localhost:5000/auth/verify', {
                method: "GET",
                headers: {"Content-Type": "application/json"},
                credentials: 'include'
            });
            const parseRes = await res.json()
            if (parseRes.token) {
                dispatch(LoginRx())
            } else {
                dispatch(LogoutRx())
                await Logout()
            }
        } catch (err) {
            console.error(err.message)
        }
    }


    const ViewProfile = async () => {
        try {
            const res = await fetch('http://localhost:5000/home/view/profile', {
                method: "GET",
                credentials: 'include'
            });
            const data = {name: 'AllCollection'}
            const response = await fetch('http://localhost:5000/home/mainfunction/collection', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            let responseOne = await res.json()
            const responseTwo = await response.json()
            if (responseOne === 'Not Authorize')
                return
            responseOne = update(responseOne,{$merge: {collection: responseTwo}})
            dispatch(ViewProfileRx(responseOne))
        } catch (err) {
            console.error(err.message)
        }
    }
    const accountsPath = [
        '/accounts/login',
        '/accounts/register',
        '/accounts/login/identify',
        '/accounts/login/reset',
    ]

    useEffect(() => {
            Verify()
        }, [location.pathname, isAuth]);

    useEffect(() => {
            ViewProfile()
        }, [isAuth]);


    return (
        <div className="App">
            <Routes>
                <Route exact path="" element={<Navigate to={`accounts/login`}/>}/>
                <Route path='accounts/*' element={ !isAuth ? (<LoginRegisterRoutes/>) : (<Navigate to={`../njt/home/saved/${(profile && profile.defaulttopic) ? profile.defaulttopic.toLowerCase().replace(/\s/g, ''): 'home'}`}/>)}/>
                <Route path='njt/*' element={isAuth  ? (<NJTRoutes/>) :
                    (accountsPath.includes(location.pathname) || accountsPath.includes(location.pathname.slice(0,21)) ) ? (<Navigate to={`..${location.pathname}`}/>): (<Navigate to={'../accounts/login'}/>)  }/>
                <Route path='studio/*' element={isAuth ? (<StudioEditorRoutes/>) :
                    (accountsPath.includes(location.pathname) || accountsPath.includes(location.pathname.slice(0,21)) ) ? (<Navigate to={`..${location.pathname}`}/>): (<Navigate to={'../accounts/login'}/>)}/>
                <Route path='/404' element={<PageNotFound/>}/>
                <Route path='*' element={<Navigate to={'/404'}/>}/>
            </Routes>
        </div>
    )

}

export default App;
