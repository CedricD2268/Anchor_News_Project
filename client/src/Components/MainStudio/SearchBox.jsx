import React, { useEffect,  useState} from 'react';
import '../../Assets/scss/Login_Register/login_register.module.css';
import HeaderStyle from "../../Assets/scss/Main_News/Header.module.css";
import {IoCloseCircle} from "react-icons/io5";
import VerticalLineIcon from "../Icon/VerticalLineIcon";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {GetBoxChart} from "../../Actions";
import styled from "styled-components";



const SearchInput = styled.div.attrs(props => ({
    className: props.className
}))`
  width: 100%;
  position: relative;
  max-width: ${(props) => props.maxWidth};
`;

const SearchBox = ({BorderColor,Border, BorderRadius, Icon, InputVisibility, ClearButtonId, BoxHeight, CloseIconSize, Placeholder, SearchX, maxWidth}) => {
    const [inputSearch, setInputSearch] = useState('');
    const [rows, setRows] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const {studio_query, home_query} = useParams()
    const params = useParams()
     const dispatch = useDispatch();
    const [focused, setFocused] = useState(false)
    const [search, setSearch] = useState('')
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    const handleBlur = (e) => {
        if (e.currentTarget) {
            setFocused(false)
            return;
        }
    }
    const handleFocus = () => {
        setFocused(true)
    }

    const validationSchema = Yup.object().shape({
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset } = useForm(formOptions);

    const onSubmit = async() => {
        if (home_query || SearchX){
            if (!inputSearch) {
                navigate(`/njt/feed/homeT/search/q=`)
                setFocused(false)
                return false
            }
            navigate(`/njt/feed/homeT/search/q=${inputSearch}`)
            setFocused(false)
            return false
        } else {
            if (!inputSearch && params){
                const studio_query = Object.values(params)[0]
                const SearchCheck = studio_query.slice(0, 6)
                const search = studio_query.slice(7)
                if (SearchCheck === 'search') {
                    navigate(`search/${search}`)
                    return false
                }
            }
            navigate(`search/q=${inputSearch}`)
            setFocused(false)
        }
    }

    const onReload = () =>{
        if (home_query){
            setSearch(home_query.slice(2))
            return false
        }
        let studio_query = null
        if (params){
            studio_query = Object.values(params)[0]
            const SearchCheck = studio_query.slice(0,6)
            const search = studio_query.slice(9)
            if (SearchCheck === 'search') {
                setSearch(search)
                return false
            }
        }
        setSearch('')
    }


    const handleChange = (event) => {
        setInputSearch(event.target.value);
        setFocused(true)
        RowQuery(event.target.value)
    }

    const ButtonClearClicked = () => {
        reset({
            text: '',
          })
        setInputSearch('')
        setFocused(false)
    }


    const DropSearchButton = (row) => {
        if (home_query || SearchX) {
            //ARTICLE PGE REDIRECT
            navigate(`/njt/feed/homeT/search/${row.title}`)
            return false
        }
        navigate(`/studio/home/search/${row.title}`)
    }

    const InputStyle = () => {
        const style = {
            border: Border,
            borderRadius: `${BorderRadius} 0 0 ${BorderRadius}`,

        }
        const style2 = {
            border: Border,
            borderRadius: `${BorderRadius} 0 0 0`,

        }

        if ((Array.isArray(rows) && rows.length > 0) && focused && inputSearch ){
            return style2
        }else{
            return style
        }
    }

    const InputSubmitStyle = () => {
        const style = {
            border: Border,
            borderLeft: 'none',
            borderRadius: `0 ${BorderRadius} ${BorderRadius} 0`,

        }
        const style2 = {
            border: Border,
            borderLeft: 'none',
            borderRadius: `0 ${BorderRadius} 0 0`,
        }
        if ((Array.isArray(rows) && rows.length > 0) && focused && inputSearch ){
            return style2
        }else{
            return style
        }
    }

    const BoxListStyle = () => {
        const style = {
            borderRadius: `0 0 ${BorderRadius} ${BorderRadius}`,
            border: Border,
            borderTop: 'none'
        }
        return style
    }

    const RowQuery = async (value) => {
        let data = {name: 'searchStudio', search: value}
        let url = 'https://njanchor.com/studio/view/article_by_home'
        if (home_query || SearchX){
            url = 'https://njanchor.com/home/mainfunction/search'
            data = {name: 'publishedByDate', search: value}
        }
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                credentials: 'include',
                body: JSON.stringify(data)
            });
            let parseRes = await res.json()
            parseRes = parseRes.slice(0, 6)
            setRows(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(()=>{
        onReload()
    }, [location.pathname])


    useEffect(()=>{
        if (SearchX) {
            reset({
                text: '',
            })
            setInputSearch('')
        }
    }, [InputVisibility, location.pathname])

    return (
        <SearchInput
            tabIndex="0"
            maxWidth={maxWidth}
             onBlur={handleBlur}
            onFocus={handleFocus}

        >
            <form onSubmit={handleSubmit(onSubmit)} className={HeaderStyle.SearchInputButton} style={{height: BoxHeight}}>
                <input defaultValue={inputSearch ? inputSearch: search } type="text" {...register('text')} name="text" className="form-control" onChange={handleChange}
                       placeholder={Placeholder}
                       autoComplete="off"
                       style={InputStyle()}
                />
                <button id={ClearButtonId} className={HeaderStyle.ClearButton} disabled={!inputSearch}
                        onClick={ButtonClearClicked} type="button"
                        style={{borderColor: BorderColor}}
                ><span style={{visibility: inputSearch ? 'visible': 'hidden'}}><IoCloseCircle
                    size={CloseIconSize} color={'#273A40'}/><VerticalLineIcon size={CloseIconSize}/></span>
                </button>
                <button className={HeaderStyle.SearchButton} type="submit"
                        style={InputSubmitStyle()}>
                    {Icon}
                </button>
            </form>
            {((Array.isArray(rows) && rows.length > 0) && focused && inputSearch ) ? (
                <div className={HeaderStyle.SearchBoxList}
                     style={BoxListStyle()}
                >
                    {rows.map(row => {
                        return (
                            <React.Fragment>
                                <button type="button" onMouseDown={()=>{DropSearchButton(row)}}>
                                    <span>{row.title}</span>
                                </button>
                            </React.Fragment>
                        )
                    })}
                </div>
            ) : (<React.Fragment/>)
            }
        </SearchInput>
    );
};

export default SearchBox;

SearchBox.defaultProps = {

    InputVisibility: true,
    SearchX: false,
    maxWidth: '400px'
};
