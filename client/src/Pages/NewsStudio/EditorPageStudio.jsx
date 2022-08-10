import React, {useEffect, useRef, useState} from 'react';
import StudioStyle from "../../Assets/scss/Main_News/Studio.module.css";
import styles from "../../Assets/scss/Main_News/Base.module.css";
import MainStyle from "../../Assets/scss/Main_News/Main.module.css";
import DropdownButton from "../../Components/MainStudio/DropdownButton";
import update from "react-addons-update";
import {AiOutlinePlus, GrClose} from "react-icons/all";
import VariableStyle from "../../Assets/scss/VariableTwo.module.css";
import {GetArticleTopicTypeName as ArticleSub} from "../../Components/MainStudio/GetArticleTopicTypeName";
import {useParams} from "react-router-dom";
import {BiSearchAlt2} from "react-icons/bi";



const EditorPageStudioSelect = ({State, ClearFunction, UpdateName, Reload}) => {
    const [type, setType] = useState()
    const {rowId, rowName} = useParams()
    const [rows, setRows] = useState()
    const [typeName, setTypeName] = useState('')

    const PageQuery = async (QueryName) => {
        let data = {name: 'publishedTypeTopicByModifiedDate', type: typeName, topic: rowName}
        if (QueryName === 'title'){
            data = {name: 'publishedTypeTopicByTitle', type:typeName, topic: rowName}
        }
        try {
            const res = await fetch('http://localhost:5000/studio/view/article_by_home', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
            let newRow = []
            for (let element of parseRes) {
                newRow.push(`${element.title}: ${element.publishid}`)
            }
            setRows(newRow)
        } catch (err) {
            console.error(err.message)
        }
    }

    const ClearClick = () => {
        ClearFunction()
    }


    useEffect(async () => {
        setType(await ArticleSub('typeNames'))
    }, [])


    return (
        <React.Fragment>
            {State && (
                <div className={VariableStyle.PopUpOverlayTwo}>
                <div className={StudioStyle.PageBoxSelect}>
                    <div className={StudioStyle.PageBoxSelectClose}><button onClick={ClearClick}><GrClose size={23}/></button></div>
                    <span style={{fontSize: '20px', marginTop: '-25px'}}> SELECT ARTICLE</span>
                    <div className={StudioStyle.PageBoxSelectOption}>
                        <DropdownButton
                            ButtonAllTextColor={"white"}
                            ButtonPrimaryTextColor={'white'}
                            ButtonPrimaryBackground={'#335c67'}
                            ButtonAllBackground={"#335c67"}
                            ButtonFunctionChange={true}
                            ButtonAllWidth={'160px'}
                            ButtonPrimaryWidth={'160px'}
                            ButtonPrimaryRadius={'2px'}
                            ButtonPrimaryIcon={'flex'}
                            BoxPosition={['0px', '5px']}
                            FontSize={'15px'}
                            BoxAllHeight={'120px'}
                            Overflow={true}
                            BoxOverflowColor={['#e8e8e4', '#94d2bd']}
                            ButtonBoxBorder={false}
                            ButtonAllRadius={'2px'}
                            ButtonAllHeight={'35px'}
                            ButtonPrimaryChar={'Select type'}
                            ButtonCharList={type}
                            Function={function (e) {
                                setTypeName(e.textContent)
                            }}
                        />
                        <DropdownButton
                            ButtonAllTextColor={"white"}
                            ButtonPrimaryTextColor={'white'}
                            ButtonPrimaryBackground={'#335c67'}
                            ButtonAllBackground={"#335c67"}
                            ButtonFunctionChange={true}
                            ButtonAllWidth={'160px'}
                            ButtonPrimaryWidth={'160px'}
                            ButtonPrimaryRadius={'2px'}
                            ButtonPrimaryIcon={'flex'}
                            BoxPosition={['0px', '5px']}
                            FontSize={'15px'}
                            Overflow={false}
                            ButtonBoxBorder={false}
                            ButtonAllRadius={'2px'}
                            ButtonAllHeight={'35px'}
                            ButtonPrimaryChar={'Last modified'}
                            ButtonCharList={['Last modified', 'Title']}
                            Function={function (e) {
                                setTypeName(e.textContent)
                            }}
                        />
                    </div>
                    <div className={StudioStyle.PageBoxSelectSearch}>
                        <button onClick={()=>{
                            PageQuery('null')
                        }}>Search <BiSearchAlt2 size={19}/></button>
                    </div>

                    <div className={StudioStyle.PageBoxSelectArticle}>
                        <DropdownButton
                            ButtonAllTextColor={"white"}
                            ButtonPrimaryTextColor={'white'}
                            ButtonPrimaryBackground={'#335c67'}
                            ButtonAllBackground={"#335c67"}
                            ButtonFunctionChange={false}
                            ButtonAllWidth={'800px'}
                            ButtonPrimaryWidth={'220px'}
                            ButtonPrimaryRadius={'2px'}
                            ButtonPrimaryIcon={'flex'}
                            BoxPosition={['-290px', '5px']}
                            FontSize={'16px'}
                            BoxAllHeight={'120px'}
                            Overflow={true}
                            BoxOverflowColor={['#e8e8e4', '#94d2bd']}
                            ButtonBoxBorder={false}
                            ButtonAllRadius={'2px'}
                            ButtonAllHeight={'35px'}
                            ButtonPrimaryChar={'Select article'}
                            ButtonCharList={rows}
                            Function={async(e) => {
                                UpdateName[Object.keys(UpdateName)[0]] = e.textContent.split(': ')[1]
                                let data = UpdateName
                                data = update(data, {$merge: {topic: rowName}})
                                try {
                                    const res = await fetch('http://localhost:5000/studio/update/row_article', {
                                        method: "POST",
                                        headers: {"Content-Type": "application/json;charset=UTF-8"},
                                        credentials: 'include',
                                        body: JSON.stringify(data)
                                    });
                                    const parseRes = await res.json()
                                } catch (err) {
                                    console.error(err.message)
                                }
                                Reload()
                                ClearClick()
                            }}
                        />
                    </div>
                </div>
            </div>
            )}
        </React.Fragment>
    );
};

EditorPageStudioSelect.defaultProps = {
    State: false,
    ClearFunction: function (e) {
    },
    UpdateName: {nothing: null},
    Reload: ()=>{

    }
};


const EditorPageStudioBox = ({State, OpenFunction, UpdateName, Reload, Aspect}) =>{

    const [data, setData] = useState()
    const {rowId, rowName} = useParams()

    const DeleteQuery = async () => {
        let data = UpdateName
        data = update(data, {$merge: {topic: rowName}})
        try {
            const res = await fetch('http://localhost:5000/studio/update/row_article', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()
        } catch (err) {
            console.error(err.message)
        }
        Reload()
    }

    return (
        <div className={StudioStyle.EditorPageBox}>
            {State ? (
                <React.Fragment>
                    <button className={StudioStyle.ClearPageBox} onClick={DeleteQuery}>CLEAR ARTICLE</button>
                    {Aspect === 'Long' ?(
                        <img src={State.imagel}/>
                    ): <img src={State.imagew}/>}
                    <div className={StudioStyle.ContextPageBox}>
                        <span>{State.typename}</span>
                        <span>{State.title} </span>
                    </div>
                </React.Fragment>
            )
            : (
            <button onClick={OpenFunction} className={StudioStyle.CreatePageBox}><AiOutlinePlus size={25}/>IMPORT ARTICLE</button>
            )}
        </div>
    )
}

EditorPageStudioBox.defaultProps = {
    State: null,
    OpenFunction: function (e) {
    },
    UpdateName: {Nothing: null},
    Reload: ()=>{

    },
    Aspect: 'Long'
};

const EditorPageStudio = () => {
    const [select, setSelect] = useState(false)
    const [updateRow, setUpdateRow] = useState(null)
    const [rowInfo, setRowInfo] = useState({})
    const {rowId, rowName} = useParams()

    const DisplayAll =  async() =>{
        const data = {name:'viewRowByTopic', topic: rowName}
        try {
            const res = await fetch('http://localhost:5000/studio/view/row_article', {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json()

            const keys = Object.keys(parseRes)
            let newRow = {}
            for (const key in keys) {
                if (keys[key] !== 'adminid' && keys[key] !== 'rowid' && keys[key] !== 'topicname') {
                    const data = {name: 'viewArticleByPublishId', publishId: parseRes[keys[key]]}
                    try {
                        const res = await fetch('http://localhost:5000/studio/view/article', {
                            method: "POST",
                            headers: {"Content-Type": "application/json;charset=UTF-8"},
                            credentials: 'include',
                            body: JSON.stringify(data)
                        });
                        const parseRes = await res.json()
                        let newInfo = {}
                        newInfo[keys[key]] = parseRes ? parseRes: ''
                        newRow = update(newRow, {$merge: newInfo})
                        setRowInfo(update(newRow, {$merge: newInfo}))
                        setRowInfo((state)=>{
                            return state
                        })
                    } catch (err) {
                        console.error(err.message)
                    }
                }
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(()=>{
        DisplayAll()
    },[])

    return (
        <React.Fragment>
            <EditorPageStudioSelect State={select}  Reload={()=>{
                DisplayAll()
            }} UpdateName={updateRow} ClearFunction={()=>{
                setSelect(false)
            }}/>
            <div className={StudioStyle.EditorBody}>
                <div className={[styles.wrapper, StudioStyle.Editor].join(' ')}>
                    <div className={StudioStyle.EditorHeader}>
                        <div className={StudioStyle.EditorHeaderName}>
                            <span>Studio Page Editor</span><span> AutoSave</span>
                        </div>
                        <div className={StudioStyle.EditorHeaderNavbar}>
                        </div>
                    </div>
                    <div className={MainStyle.HeadlineTwoHeaderOne}>
                <span>
                    Politics Headline Page
                </span>
                    </div>
                    <div className={StudioStyle.EditorPageHeaderOne}>
                        <EditorPageStudioBox UpdateName={{RowHOne: null}}
                                             State={rowInfo && rowInfo.articlehone ? rowInfo.articlehone : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowHOne: null})
                        }}/>
                        <EditorPageStudioBox UpdateName={{RowHTwo: null}}
                                             State={rowInfo && rowInfo.articlehtwo ? rowInfo.articlehtwo : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowHTwo: null})
                        }}/>
                        <EditorPageStudioBox UpdateName={{RowHThree: null}}
                                             State={rowInfo && rowInfo.articlehthree ? rowInfo.articlehthree : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowHThree: null})
                        }}/>
                        <EditorPageStudioBox UpdateName={{RowHFour: null}}
                                             State={rowInfo && rowInfo.articlehfour ? rowInfo.articlehfour : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowHFour: null})
                        }}/>
                    </div>
                    <div className={MainStyle.HeadlineTwoHeaderOne}>
                <span>
                    Politics Second Headline Page
                </span>
                    </div>
                    <div className={StudioStyle.EditorPageHeaderOne}>
                        <EditorPageStudioBox UpdateName={{RowSOne: null}}
                                             State={rowInfo && rowInfo.articlesone ? rowInfo.articlesone : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowSOne: null})
                        }}/>
                        <EditorPageStudioBox UpdateName={{RowSTwo: null}}
                                             State={rowInfo && rowInfo.articlestwo ? rowInfo.articlestwo : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowSTwo: null})
                        }}/>
                        <EditorPageStudioBox UpdateName={{RowSThree: null}}
                                             State={rowInfo && rowInfo.articlesthree ? rowInfo.articlesthree : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowSThree: null})
                        }}/>
                        <EditorPageStudioBox UpdateName={{RowSFour: null}}
                                             State={rowInfo && rowInfo.articlesfour ? rowInfo.articlesfour : null}
                                             Reload={() => {
                                                 DisplayAll()
                                             }} OpenFunction={() => {
                            setSelect(true)
                            setUpdateRow({RowSFour: null})
                        }}/>
                    </div>
                </div>
            </div>

        </React.Fragment>


    );
};


export default EditorPageStudio;
