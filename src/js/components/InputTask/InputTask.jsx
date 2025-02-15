import React from 'react';
import './InputTask.css';

const InputTask = (props) => {
    return (
        <>
            <input 
                type="text"
                placeholder='Write your task here :'
                value={props.task} 
                onChange={props.newValue}
                onKeyDown={props.sendTask}
            />
        </>
    );
};

export default InputTask;