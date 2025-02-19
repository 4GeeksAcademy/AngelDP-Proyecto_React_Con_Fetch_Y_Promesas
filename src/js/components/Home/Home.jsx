import React from 'react';
import MyList from '../MyList/MyList.jsx';
import "./Home.css";

const Home = () => {
    return (
        <div className="container-fluid py-5">
            <div className='home-container'>
                <h1 className="text-center mb-4">✓ Task Manager</h1>
                <MyList />
            </div>
        </div>
    );
};

export default Home;