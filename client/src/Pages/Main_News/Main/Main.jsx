import React, {useEffect} from 'react';
import MainStyle from "../../../Assets/scss/Main_News/Main.module.css";
import Headline from "./Headline";
import {useParams} from "react-router-dom";

const Main = ({type, name}) => {
    const {routeId}  = useParams()

    useEffect(() => {

    }, []);



    return (
        <React.Fragment>
            {type === 'Topic' &&
                <React.Fragment>
                    <div className={MainStyle.TopicsName}>
                <span>
                    {routeId ? routeId : ''}
                </span>
                    </div>
                    <div>
                        {/*<Headline HeadlineType={'HeadlineCombine'}/>*/}
                    </div>
                </React.Fragment>
            }
            {type === 'Home' &&
                    <div>
                        <Headline HeadlineType={'HeadlineCombine'}/>
                    </div>
            }
        </React.Fragment>

    );
};

export default Main;