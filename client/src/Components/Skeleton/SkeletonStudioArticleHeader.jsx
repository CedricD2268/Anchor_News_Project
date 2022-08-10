import React from 'react'
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'
import SkeletonShimmer from "./SkeletonShimmer";

const SkeletonStudioArticleHeader = () =>{
    return(
        <div className={VariableStyle.SkeletonStudioArticleHeader}>
            <SkeletonShimmer/>
        </div>
    )
}

export default SkeletonStudioArticleHeader;