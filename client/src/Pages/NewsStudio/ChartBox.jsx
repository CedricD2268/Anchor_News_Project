import React, {useEffect, useState} from 'react'
import StudioStyle from '../../Assets/scss/Main_News/Studio.module.css'
import NewDateConvertUtc from "../../Components/MainStudio/NewDateConvertUtc";
import {
    BiBookReader,
    BsFillHeartFill,
    BsFillShareFill, CgComment, FaHeart,
    FaReadme, FaRegEye, GrClose,
    MdDeleteForever,
    MdInsertComment,
} from "react-icons/all";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import DataIcon from "../../Components/Icon/DataIcon";
import {useDispatch, useSelector} from "react-redux";
import {GetBoxChart} from "../../Actions";
import {useLocation, useNavigate} from "react-router-dom";
import update from "react-addons-update";




const ChartBox = () => {
    const dispatch = useDispatch()
    const [interval, setInterval] = useState(0)
    const [dataInfo, setDataInfo] = useState({
            allCommentCount: 0,
            likeCount: 0,
            historyCount: 0,
            readCount: 0,
            readDateCount: []
    })
    const chart = useSelector((state) => state.chartQuery)
    const navigate = useNavigate()


    const DeleteArticle = async (articleId) => {
        const data = {name: articleId}
        try {
            const res = await fetch('http://localhost:5000/studio/delete/article_by_id', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
             await res.json()
        } catch (err) {
            console.error(err.message)
        }
    }



    const GetArticleInfo = async (articleId) => {
        const data = {articleId: articleId}
        try {
            const res = await fetch('http://localhost:5000/studio/article_data_chart', {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
             const response = await res.json()

            if (!response.error){
                setDataInfo(update(dataInfo, {$merge: response}))
            }
        } catch (err) {
            console.error(err.message)

        }
    }

    const IntervalMath = () => {
        if (dataInfo.readDateCount.length >= 7 && dataInfo.readDateCount.length <=15 ){
            setInterval(2)
            return
        }
        let int = 0
        for (let i = 0; i < dataInfo.readDateCount.length; i++) {
            if (i % 15 === 0 && i !== 1 && i !== 0) {
                int += 3
            }
        }
        setInterval(int)
    }
    useEffect(() => {
        IntervalMath()
        if(chart && chart.data && chart.data.publishid){
            GetArticleInfo(chart.data.publishid)
        }
    }, []);




    return (
        <div className={StudioStyle.ChartBox}>
            <div className={StudioStyle.ChartBoxClose}>
                <button onClick={()=>{
                    dispatch(GetBoxChart({active: false}))
                }}>
                    <GrClose size={22}/>
                </button>
            </div>
            <div className={StudioStyle.ChartBoxTitle}>
                <span>Article Data</span> <DataIcon size={32} color={'black'}/>
            </div>
            <div className={StudioStyle.ChartBoxNotice}>

                <span><BiBookReader size={20}/>amount people who read the article.</span>
                <span><FaRegEye size={20} color={'black'}/>amount people who click on the article but did not fully read it.</span>
                <span><CgComment size={20}/>amount people who commented on the article.</span>
                <span><FaHeart size={19}/>amount people who liked the article.</span>
            </div>
            <div className={StudioStyle.ChartBoxTitle}>
                <span style={{fontSize: '17px'}}>#Readers each day(Read/Listen)</span>
            </div>
            <div className={StudioStyle.ChartBoxChart}>
                <AreaChart width={550} height={250} data={dataInfo.readDateCount}
                           margin={{top: 15, right: 40, left: 0, bottom: 0}} title="New Users Over Time">
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#273A40" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#273A40" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="day" interval={interval}/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Area type="monotone" dot={false} dataKey="number_of_readers" stroke="#273A40" fillOpacity={1}
                          fill="url(#colorUv)"/>
                    {/* <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" /> */}
                </AreaChart>
            </div>
            <div className={StudioStyle.ChartBoxInfo}>

                <div className={StudioStyle.ChartBoxInfoOne}>
                    <div>
                        <span>{dataInfo.readCount} <BiBookReader size={22}/></span>
                        <span>{dataInfo.historyCount} <FaRegEye size={20} color={'black'}/></span>
                    </div>
                    <div>
                        <span>{dataInfo.allCommentCount} <CgComment size={20}/></span>
                        <span>{dataInfo.likeCount} <FaHeart size={18} color={'black'}/></span>
                    </div>
                </div>
                <div className={StudioStyle.ChartBoxInfoTwo}>
                        <div><span>Title:</span> {chart && chart.data && chart.data.title  ? chart.data.title: 'unknown'}</div>
                        <div><span>Topic:</span> {chart.data.topicname}</div>
                        <div><span>Type:</span> {chart && chart.data && chart.data.typename ? chart.data.typename : 'unknown'}</div>
                        <div><span>Published:</span> {chart && chart.data && chart.data.publisheddate ? NewDateConvertUtc(chart.data.publisheddate): 'unknown' }</div>
                </div>
            </div>
            <div className={StudioStyle.ChartBoxButton}>
                <button onClick={() => {
                    DeleteArticle(chart && chart.data && chart.data.articleid ? chart.data.articleid : null)
                    dispatch(GetBoxChart({delete: true}))
                    dispatch(GetBoxChart({active: false}))
                }}>
                    <MdDeleteForever size={22}/>
                    Delete article
                </button>
                <button onClick={()=>{
                    dispatch(GetBoxChart({active: false}))
                    window.location.href = `/njt/feed/article/${chart.data.topicname}/${chart.data.publishid}`
                }}>
                    <FaReadme size={19}/>
                    Read article
                </button>
            </div>
        </div>
    )
}


export default ChartBox