import './Wrapper.css';
import React from 'react';
import { assets } from '../assets/assets';
import Cookies from "js-cookie";
import { googleLogout } from '@react-oauth/google';
import MMRM from "../assets/mmrm.png";
import Cloud from "../assets/public-cloud.png";
import Army from "../assets/military-prosecution.png";

// import { useNavigate } from 'react-router-dom';
const TopBar = () => {

    const icons = [
        {
            src: Army,
            alt: "Army",
            onClick: () => handle_signout(),
        },
        {
            src: Cloud,
            alt: "Cloud",
            onClick: () => handle_signout(),
        },
        {
            src: MMRM,
            alt: "MMRM",
            onClick: () => handle_signout(),
        },
        {
            src: assets.account_icon,
            alt: "Account",
            onClick: () => handle_signout(),
            className: "profile-pic"
        },

    ];

    const handle_signout = () => {
        Cookies.remove("my_mutex");
        Cookies.remove("store_history")
        googleLogout();
        window.location.href = "/"
    }

    return (
        <div className='top-bar-container'>
            <div className="nav1">
                {
                    icons.map((icon, index) => {
                        return (
                            <div className="card1" key={index}>
                                <img
                                    src={icon.src}
                                    alt={icon.alt}
                                    onClick={icon.onClick}
                                    className={icon.className}
                                    style={{ cursor: "Pointer" }}
                                />
                            </div>
                        )
                    })
                }

            </div>
            {/* <div className='top-bar-item'>
                <button className='btn-black'>About the Platform</button>
            </div> */}
        </div>
    );
}

export default TopBar;
