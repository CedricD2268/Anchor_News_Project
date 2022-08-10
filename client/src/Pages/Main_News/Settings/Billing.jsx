import React, {useEffect} from 'react';
import SettingStyle from '../../../Assets/scss/Main_News/Settings.module.css'


const Billing = () => {

    return (
        <div >
            <span  style={{fontSize: '18px'}}>(Coming Soon)</span>
            <div className={SettingStyle.Header}>Payment method </div>
            <div className={SettingStyle.Billing}>
                <div className={SettingStyle.BillingA}>
                    <div className={SettingStyle.HeaderFlex}>
                        <h2>Current card</h2>
                    </div>
                    <span style={{marginTop: 5, fontSize: 16.5}}>This account currently holds no payment method</span>
                    <hr/>
                </div>
                    <div className={SettingStyle.HeaderFlex}>
                        <h2>Add Payment method</h2>
                    </div>

                <form className={SettingStyle.BillingCardInfo}>
                    <div className={SettingStyle.BillingCardName}>
                        <label>Name on card</label>
                        <input disabled={true}/>
                    </div>
                    <div className={SettingStyle.BillingCardNumber}>
                        <label>Card number</label>
                        <input disabled={true}/>
                    </div>
                    <div className={SettingStyle.BillingCardSecurities}>
                        <div>
                            <label>Expiry date</label>
                            <input disabled={true}/>
                        </div>
                        <div>
                            <label>Security code</label>
                            <input disabled={true}/>
                        </div>
                    </div>
                    <div className={SettingStyle.BillingCardZip}>
                        <label>Zip code</label>
                        <input disabled={true}/>
                    </div>
                    <hr/>
                    <div className={SettingStyle.MainPortfolioF}>
                        <button disabled={true} type='submit'>Save payment changes</button>
                    </div>
                </form>

            </div>

        </div>

    );
};

export default Billing;