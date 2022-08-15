import React from 'react';
import HeaderStyle from '../../../Assets/scss/Main_News/Header.module.css';
import {useState, useEffect} from "react";
import SearchBox from "../../../Components/MainStudio/SearchBox";
import {FaSearch, RiSearchEyeLine} from "react-icons/all";
import {
  useWindowWidth,
} from '@react-hook/window-size'

const HeaderForm = () => {
    const [visibility, setVisibility] = useState(true)
    const size = useWindowWidth()

    const boxWidth = () =>{
        if (size > 1110 ){
            return '265px'
        }
        if (size < 1105 && size > 1080 ){
            return '250px'
        }
        if (size < 1080 && size > 1065 ){
            return '235px'
        }
        if (size < 1065 && size > 1040 ){
            return '220px'
        }
        if (size < 1040 && size > 1015 ){
            return '205px'
        }
        if (size < 1015){
            return '200px'
        }
    }

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
                        maxWidth={boxWidth()}
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
