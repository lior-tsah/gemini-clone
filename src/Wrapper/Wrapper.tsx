import './Wrapper.css';
import React from 'react';
import TopBar from './TopBar';
// import SideBar from './SideBar';
import SideBar from '../components/Sidebar/Sidebar';
const Wrapper = ({ children }) => {
    return (
        <div className='page'>
            <SideBar />
            <div className='page-content'>
                <TopBar />
                <div className='children'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Wrapper;
