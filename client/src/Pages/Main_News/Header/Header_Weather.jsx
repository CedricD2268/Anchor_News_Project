import React, {useEffect, useState} from 'react';
import HeaderStyle from '../../../Assets/scss/Main_News/Header.module.css';
import WeatherIcons from "../../../Components/Icon/WeatherIcons";
import {useDispatch, useSelector} from "react-redux";
import Icon13d from "../../../Components/Icon/WeatherIcons/Icon13d";
import TextError from "../../../Components/LoginRegister/text_error";
import {useLocation} from "react-router-dom";
import {ViewProfileRx} from "../../../Actions";
import update from "react-addons-update";


const HeaderWeather = ({settings}) => {

    const [weather, setWeather] = useState({})
    const [error, setError] = useState()
    const profile = useSelector((state) => state.profileView);
    const dispatch = useDispatch()
    const location = useLocation()

    const states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['American Samoa', 'AS'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['Armed Forces Americas', 'AA'],
        ['Armed Forces Europe', 'AE'],
        ['Armed Forces Pacific', 'AP'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District Of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Guam', 'GU'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Marshall Islands', 'MH'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Northern Mariana Islands', 'NP'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['US Virgin Islands', 'VI'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];


    const weatherBalloon = async (cityName, stateName) => {
        const data = {cityName: cityName, stateName: stateName}
        setError(false)
        try{
            const response = await fetch('https://njanchor.com/service/weather', {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const result = await response.json()
            if (result.error) {
                dispatch(ViewProfileRx({weatherSubmit: false}))
                setError(true)
                return

            }

            setWeather({
                    description: result.weather[0].description,
                    iconId: result.weather[0].icon,
                    city: result.name,
                    state: ()=>{
                        let newStateName;
                        for (const element of states){
                            if (element.includes(stateName)){
                                newStateName = element[0]
                                return newStateName;
                            }
                        }

                    },
                    country: result.sys.country,
                value: result.main.temp
                })

            const data2 = {city: cityName, state: stateName}
            const res = await fetch('https://njanchor.com/home/update/customization', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: 'include',
                    body: JSON.stringify(data2)
                });
                let parseRes = await res.json();
                parseRes = update(parseRes, {$merge: {weatherSubmit: true}})
            setTimeout(() => {
                    dispatch(ViewProfileRx(parseRes))
                }, 2000)

        } catch (err) {
            console.error(err.message);
            dispatch(ViewProfileRx({weatherSubmit: false}))
            setError(true)
        }

    }

    useEffect(() => {
        weatherBalloon(profile.cityname, profile.state)
    },[profile.cityname, profile.state]);

    useEffect(() => {
        if (error)
            dispatch(ViewProfileRx({
                cityName: 'Brooklyn',
                stateName: 'US-NY'
            }))
    }, [location.pathname]);

    return (
        <div className={[HeaderStyle.Weather, !settings ? HeaderStyle.DesktopX: ''].join(' ')}>
            {(error && settings) &&
                <TextError name={'Sorry the city name might be incorrect.'}/>
            }
            <div className={HeaderStyle.WeatherBox} style={{marginLeft: !settings ? '70px' : '0'}}>
                <div>
                    {WeatherIcons[weather.iconId]}
                </div>
                <div className={HeaderStyle.WeatherValue}>{weather && weather.value ? `${weather.value}°F` : '' }</div>
                <div className={HeaderStyle.WeatherInfo}>
                    <div style={{fontSize: 14, textTransform: "capitalize"}}>{weather && weather.description ? weather.description : ''}</div>
                    <div style={{fontSize: 14, display: "block", width: !settings ? '180px': '250px', overflow: "hidden", textOverflow: 'ellipsis' }}>
                        {weather && weather.state ? `${weather.state()}, ` : ''} {weather && weather.city ? weather.city : ''}
                    </div>
                </div>
            </div>
        </div>
    );
};

HeaderWeather.defaultProps={
    settings: false
}

export default HeaderWeather;
