import React from 'react'
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'
import SkeletonElement from "./SkeletonElement";

const SkeletonStudioArticleFooter = () => {
    return (
        <div className={VariableStyle.SkeletonStudioArticleFooter}>
            <SkeletonElement Type={'Title'}/>
            <SkeletonElement Type={'Text'}/>
        </div>
    )
}

export default SkeletonStudioArticleFooter;