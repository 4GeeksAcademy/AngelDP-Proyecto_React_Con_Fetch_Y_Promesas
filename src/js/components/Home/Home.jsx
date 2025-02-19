import React from 'react';
import MyList from '../MyList/MyList.jsx';
import "./Home.css";

const Home = () => {
    return (
        <div className='container'>
            <div className='home-container'>
                <MyList />
            </div>
        </div>
    );
};

export default Home;