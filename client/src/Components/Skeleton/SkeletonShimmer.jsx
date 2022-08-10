import React from 'react'
import VariableStyle from '../../Assets/scss/VariableTwo.module.css'

const SkeletonShimmer = () =>{
    return (
        <div className={VariableStyle.SkeletonShimmerWrapper}>
            <div className={VariableStyle.SkeletonShimmer}/>
        </div>
    )
}

export default SkeletonShimmer;