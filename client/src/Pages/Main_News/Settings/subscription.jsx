import React from 'react';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css'
import StarIcon from "../../../Components/Icon/StarIcon";
import PremiumIcon from '../../../Assets/Icons/SocialMedia/best-seller.png'
import {FaCheck} from "react-icons/all";
import PlansIcon from "../../../Components/Icon/PlansIcon";


const Subscription = () => {

    return (
        <div>
            <div className={SettingStyle.Header}>Subscription</div>
            <div className={SettingStyle.Subscription}>
                <div className={SettingStyle.HeaderFlex}>
                    <PlansIcon size={45}/>
                    <h2>Available Plans</h2>
                </div>
                <div className={SettingStyle.SubscriptionA}>
                    <div className={SettingStyle.SubscriptionAp}>
                        <div>
                            <span style={{fontSize: 20, display: 'flex', gap: 8, alignItems: 'center'}} ><StarIcon size={28}/> Monthly Premium</span>
                            <span style={{fontSize: 20, marginBottom: 10}}>$9.99 <span style={{fontSize: 17}}>/month</span></span>
                        </div>
                        <div className={SettingStyle.SubscriptionApList}>
                            <div><FaCheck/><span>24/7 News Coverage</span></div>
                            <div><FaCheck/><span>Latest news/articles on wide-range of topics</span></div>
                            <div><FaCheck/><span>Ability to read/listen</span></div>
                            <div><FaCheck/><span>Write & publish opinion articles</span></div>
                        </div>
                        <div>
                            <button>Coming Soon</button>
                        </div>
                    </div>
                    <div className={SettingStyle.SubscriptionAp}>
                        <div>
                            <div>
                                <span style={{fontSize: 20, display: 'flex', gap: 8, alignItems: 'center' }}><StarIcon size={28}/> Yearly Premium</span>
                                <span style={{fontSize: 20, marginBottom: 10}}>$99.99 <span style={{fontSize: 17}}>/yearly</span></span>
                            </div>
                        </div>
                        <div className={SettingStyle.SubscriptionApList}>
                            <div><FaCheck/><span>24/7 News Coverage</span></div>
                            <div><FaCheck/><span>Latest news/articles on wide-range of topics</span></div>
                            <div><FaCheck/><span>Ability to read/listen</span></div>
                            <div><FaCheck/><span>Write & publish opinion articles</span></div>
                        </div>
                        <div>
                            <button>Coming Soon</button>
                        </div>
                    </div>

                </div>
                {/*<div className={SettingStyle.MainPortfolioF}>*/}
                {/*    <button type='submit'>Save changes</button>*/}
                {/*</div>*/}
            </div>
        </div>

    );
};

export default Subscription;