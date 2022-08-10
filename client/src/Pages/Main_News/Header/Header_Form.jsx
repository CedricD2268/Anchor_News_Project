import React from 'react';
import HeaderStyle from '../../../Assets/scss/Main_News/Header.module.css';
import {useState, useEffect} from "react";
import SearchBox from "../../../Components/MainStudio/SearchBox";
import {FaSearch, FaSearchPlus, RiSearchEyeLine} from "react-icons/all";

const HeaderForm = () => {
    const [visibility, setVisibility] = useState(true)

    return (
        <React.Fragment>
            <div className={ [HeaderStyle.HeaderSearch ,HeaderStyle.DesktopX].join(' ')}>
                <div className={HeaderStyle.HeaderSearchButton}>
                    <button onClick={()=>{
                        setVisibility(!visibility)
                    }}><RiSearchEyeLine size={18.5} color={'white'}/></button>
                </div>
                <div style={{visibility: visibility ? 'visible' : 'hidden', width: '100%'}}>
                    <SearchBox
                        Border={'1px solid #273A40'}
                        BorderColor={'#273A40'}
                        BorderRadius={'6px'}
                        BoxHeight={39}
                        SearchX={true}
                        maxWidth={'265px'}
                        CloseIconSize={22}
                        InputVisibility={visibility}
                        Icon={<FaSearch size={18.5} color={'#273A40'}/>}
                        Placeholder={'Search in Anchor....'}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default HeaderForm;
