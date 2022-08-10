import React from 'react';
import FooterStyle from '../../../Assets/scss/Main_News/Footer.module.css'
import FacebookIcon from "../../../Components/Icon/FooterIcons/FacebookIcon";
import InstagramIcon from "../../../Components/Icon/FooterIcons/InstagramIcons";
import LinkedinIcon from "../../../Components/Icon/FooterIcons/LinkedinIcon";
import TwitterIcon from "../../../Components/Icon/FooterIcons/TwitterIcons";

const Footer = () => {


    return (
        <footer className={FooterStyle.Footer}>
            <div className={FooterStyle.FooterSectionA}>
                <div className={FooterStyle.FooterServices}>
                    <ul>
                        <li><h3>Services</h3></li>
                        <li>Web Design</li>
                        <li>Web Development</li>
                        <li>Hosting</li>
                    </ul>
                </div>
                <div className={FooterStyle.FooterAbout}>
                    <ul>
                        <li><h3>About</h3></li>
                        <li>Company</li>
                        <li>Team</li>
                        <li>Legacy</li>
                    </ul>
                </div>
                <div className={FooterStyle.FooterCareers}>
                    <ul>
                        <li><h3>Careers</h3></li>
                        <li>Job Openings</li>
                        <li>Benefits</li>
                        <li>Legal Terms</li>
                    </ul>
                </div>
            </div>
            <div className={FooterStyle.FooterSectionB}>
                <div className={FooterStyle.FooterIcons}>
                    <FacebookIcon  size={35} color={'#264653'}/>
                    <InstagramIcon size={35} color={'#264653'}/>
                    <LinkedinIcon size={35} color={'#264653'}/>
                    <TwitterIcon size={35} color={'#264653'}/>
                </div>
                <div className={FooterStyle.FooterLicence}>
                    <span>Copyright @2021 | Designed With by <a>The New Jersey Times</a></span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
