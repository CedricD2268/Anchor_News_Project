import React, {useEffect, useState} from 'react';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css'
import AnchorTwoIcon from "../../../Components/Icon/AnchorTwoIcon";
import DropdownButton from "../../../Components/MainStudio/DropdownButton";
import update from "react-addons-update";
import HeaderWeather from "../Header/Header_Weather";
import InputFieldSave from "../../../Components/MainStudio/InputFieldSave";
import {GetArticleTopicTypeName as ArticleSub} from "../../../Components/MainStudio/GetArticleTopicTypeName";
import SavedIcon from "../../../Components/Icon/SavedIcon";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {ViewProfileRx} from "../../../Actions";
import TextError from "../../../Components/LoginRegister/text_error";
import {useDispatch, useSelector} from "react-redux";
import LoadingSpinnerIcon from "../../../Components/Icon/LoadingSpinnerIcon";
import {FaCheckCircle} from "react-icons/fa";
import {useLocation} from "react-router-dom";

const Customize = () => {
    const [nameList, setNameList] = useState([]);
    const [nameDefault, setNameDefault] = useState('');
    const [nameADefault, setNameADefault] = useState('');
    const [stateName, setStateName] = useState()
    const [states, setStates] = useState([]);
    const [allStateCode, setAllStateCode] = useState()
    const [allTopicNames, setAllTopicNames] = useState([])
    const [dropReset, setDropReset] = useState(true)
    const [stateError, setStateError] = useState(false)
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profileView);

    const [render, setRender] = useState()
    const [load, setLoad] = useState({a:false})
    const [submit, setSubmit] = useState({a:false})
    const [errorSubmit, setErrorSubmit] = useState({a:false})
    const location = useLocation()


    const GetStates = async() => {
          const data = {country: 'United States'}
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });
            const parseRes = await response.json()
            const OtherUsStates = ['UM-81', 'UM-84', 'UM-86', 'UM-67', 'UM-89', 'UM-76', 'UM-71', 'MP', 'UM-95', 'UM', 'UM-79', 'VI']
            let newStates = []
            let newAllStateCode = {}
            const getStates = () =>{
                parseRes.data.states.forEach((obj) => {
                    if (!OtherUsStates.includes(obj.state_code)){
                       newStates.push(obj.name)
                        newAllStateCode = update(newAllStateCode, {$merge: {[obj.name] : obj.state_code} })
                    }
                })
            }
            getStates()
            setStates(newStates)
            setAllStateCode(newAllStateCode)
        } catch (err) {
            console.error(err.message);
        }
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required( "City name field is required")
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, reset } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = async (data) => {
        setLoad(update(load,{$merge: {a: true}}))

        if(!stateName){
            setStateError(true)
            return
        }
        dispatch(ViewProfileRx({cityname: data.name, state: allStateCode[stateName]}))
        setTimeout(() => {
            setLoad(update(load, {$merge: {a: false}}))
            if (profile.weatherSubmit) {
                setErrorSubmit(update(errorSubmit, {$merge: {a: true}}))
            } else {
                setSubmit(update(submit, {$merge: {a: true}}))
            }
            setTimeout(() => {
                setErrorSubmit(update(errorSubmit, {$merge: {a: false}}))
                setSubmit(update(submit, {$merge: {a: false}}))
            }, 2000)
        }, 1500)
        reset({
            name: '',
        })
        setStateName('')
        setDropReset(!dropReset)
        return false;
    }

    const UpdateCustomization = async (data) => {
        try {
            const res= await fetch('http://localhost:5000/home/update/customization', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const parseRes = await res.json();
            dispatch(ViewProfileRx(parseRes))
            setNameDefault(parseRes.defaulttopic)
        } catch (err) {
            console.error(err.message);
        }
        return false;
    }

    const FiveTopicsClick = (e) => {

        const container = document.querySelector(`.${SettingStyle.CustomizeApb}`)
        const matches = container.querySelectorAll("button")

        e.target.classList.toggle(SettingStyle.CustomizeButtonOne)
        if (e.target.classList.contains(SettingStyle.CustomizeButtonOne)){
            setNameList(update(nameList, {$push: [e.target.textContent]}))
        }else{
             setNameList(nameList.filter(item => item !== e.target.textContent))
        }

        let xButton = 0
        matches.forEach((button) => {
            if (button.classList.contains(SettingStyle.CustomizeButtonOne)){
                xButton += 1
            }
        })
        matches.forEach((button) => {
            if (xButton === 5){
                button.disabled = !button.classList.contains(SettingStyle.CustomizeButtonOne);
            }else{
                button.disabled = false
            }
        })
    }



    const DefaultTwoClick = (e) => {
        const container = document.querySelector(`.${SettingStyle.CustomizeApc}`);
        const matches = container.querySelectorAll("button");
        matches.forEach((button) => {
            if(button.classList.contains(SettingStyle.CustomizeButtonTwo)){
                button.classList.remove(SettingStyle.CustomizeButtonTwo);
            }
        });
        UpdateCustomization({defaultUrl: e.target.textContent })
        e.target.classList.add(SettingStyle.CustomizeButtonTwo);
    }


    useEffect(async() => {
        GetStates()
        setAllTopicNames(await ArticleSub('topicNames'))
        const urls = [profile.topicone, profile.topictwo, profile.topicthree, profile.topicfour, profile.topicfive]
        setNameList(urls)

        const container = document.querySelector(`.${SettingStyle.CustomizeApb}`)
        const containerTwo = document.querySelector(`.${SettingStyle.CustomizeApc}`)
        const matchesTwo = containerTwo.querySelectorAll("button")
        const matches = container.querySelectorAll("button")

        matches.forEach((button) => {
            if (urls.includes(button.textContent)){
                button.classList.toggle(SettingStyle.CustomizeButtonOne)
            }
        })
        matches.forEach((button) => {
            button.disabled = !button.classList.contains(SettingStyle.CustomizeButtonOne);
        })

    }, []);



    useEffect(() => {
        UpdateCustomization({urls: nameList, monster: true })
    }, [nameList]);

    return (
        <div >
            <div className={SettingStyle.Header}>Customize</div>

            <div className={SettingStyle.Customize}>
                <form onSubmit={handleSubmit(onSubmit)} className={SettingStyle.CustomizeWeather}>
                    <div className={SettingStyle.HeaderFlex}>
                        <h2>Change Weather</h2>
                    </div>
                    <div style={{ fontSize: 17}}> Customize weather info(Top right corner) by selecting
                        the state & city.
                    </div>
                    <div className={SettingStyle.CustomizeWeatherForm}>
                        <div>
                            <DropdownButton
                                ButtonAllTextColor={"white"}
                                ButtonPrimaryTextColor={'white'}
                                ButtonPrimaryBackground={'#335c67'}
                                ButtonAllBackground={"#335c67"}
                                ButtonFunctionChange={true}
                                ButtonAllWidth={'160px'}
                                ButtonPrimaryWidth={'160px'}
                                ButtonPrimaryRadius={'6px'}
                                ButtonPrimaryIcon={'flex'}
                                BoxPosition={['0px', '5px']}
                                FontSize={'15.3px'}
                                BoxAllHeight={'140px'}
                                Overflow={true}
                                BoxOverflowColor={['#e8e8e4', '#94d2bd']}
                                ButtonBoxBorder={false}
                                ButtonAllRadius={'6px'}
                                ButtonAllHeight={'36px'}
                                ButtonPrimaryChar={'Select State'}
                                ButtonCharList={states}
                                reset={dropReset}
                                Function={function (e) {
                                    setStateName(e.textContent)
                                    setStateError(false)
                                }}
                            />
                        </div>
                        <div className={SettingStyle.CustomizeWeatherBoxInput}>
                            <input type="name" {...register('name')}
                                   name="name"
                                   className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                   placeholder={'Enter city name'}/>
                        </div>
                    </div>
                    <div className={SettingStyle.CustomizeWeatherBoxSaveButton}>
                        <button type={'submit'}>Save Weather{load.a ?
                            <LoadingSpinnerIcon size={23}/> :
                            submit.a ?
                                <FaCheckCircle size={21} color={'#0d5e32'}/> :
                                <SavedIcon size={22}/>
                        }</button>
                    </div>
                    {(errors.name && stateError) ?
                        <TextError name={'State and city name fields are required'}/> :
                        <React.Fragment>
                            {errors.name && <TextError name={errors.name.message}/>}
                            {stateError && <TextError name={'State field is required'}/>}
                        </React.Fragment>
                    }
                    <div style={{marginRight: 'auto', width: 'auto'}}>
                        <HeaderWeather settings={true}/>
                    </div>
                </form>
                <div className={SettingStyle.CustomizeA}>
                    <div className={SettingStyle.HeaderFlex}>
                        <h2>All Topics</h2>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                         <span style={{fontSize: 16.5}}>Please select at least 5 topics that relates to you.</span>
                    </div>

                    <div className={[SettingStyle.CustomizeAp, SettingStyle.CustomizeApb].join(' ')}>
                        <ul>
                            {allTopicNames.map(buttonName =>
                                <li key={buttonName}>
                                    <button onClick={FiveTopicsClick}>
                                        <span>{buttonName}</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className={SettingStyle.CustomizeA}>
                    <div className={SettingStyle.HeaderFlex}>
                        <h2>Default Topic</h2>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                        <AnchorTwoIcon size={24} /><span style={{fontSize: 16.5}}> Please select one of your topics as the default page</span>
                    </div>

                    <div  className={[SettingStyle.CustomizeAp, SettingStyle.CustomizeApc].join(' ')}>
                        <ul>
                            {nameList.map(buttonName =>
                                <li key={buttonName}>
                                    <button onClick={DefaultTwoClick} className={buttonName === nameDefault ? SettingStyle.CustomizeButtonTwo : '' }>
                                        <span>{buttonName}</span><AnchorTwoIcon size={21} color={"white"}/>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <hr/>
        </div>

    );
};

export default Customize;