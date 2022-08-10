import React, {useEffect, useState} from 'react';
import SkeletonShimmer from "./SkeletonShimmer";
import update from "react-addons-update";

const SkeletonElement = ({
                             Type, Background,
                             Margin,
                             BorderRadius,
                             Width,
                             Height,
                             MinWidth,
                             MaxWidth,
    AspectRatio
                         }) => {

    const [option, setOption] = useState()


    const TypeClass = () => {
        let props = {
            Background: Background,
                Margin: Margin,
                BorderRadius: BorderRadius,
                MinWidth: MinWidth,
                Width: Width,
                Height: Height,
                AspectRatio: AspectRatio
            }
        if (Type === 'Title') {
            setOption(update(props,{$merge: { Width: '50%', Height: '18px', MinWidth: '50%'}}))
            return
        }
        if (Type === 'Text') {
            setOption(update(props, {$merge: {Width: Width, Height: '11px'}}))
            return
        }
        setOption(props)

    }


    useEffect(()=>{
        TypeClass()
    }, [])

    return (
        // <div className={[VariableStyle.Skeleton, className].join(' ')}>
        <div style={{
            // backgroundColor: option && option.Background ? option.Background :'' ,
            // margin: option && option.Margin ? option.Margin:'',
            // borderRadius: option && option.BorderRadius ? option.BorderRadius :'',
            // width: option && option.Width ? option.Width :'',
            // height: option && option.Height ? option.Height :'',
            //
            // minWidth: option && option.MinWidth ? option.MinWidth :''
            height: Height,
            backgroundColor: Background,
            margin: Margin,
            borderRadius: BorderRadius,
            width: Width,
            minWidth: MinWidth,
            maxWidth: MaxWidth,
            overflow: 'hidden',
            aspectRatio: AspectRatio
        }}>
            <SkeletonShimmer/>
        </div>


    )
}

SkeletonElement.defaultProps ={
    Background: '#ddd',
    Margin: "5px 0",
    BorderRadius: '4px',
    Width: '100%',
    Height: '40px',
    MinWidth: '100%'
}

export default SkeletonElement;