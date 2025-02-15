import React from 'react';
import './TaskList.css'

const TaskList = (props) => {
    return (
        <>
            {props.myTaskList.length === 0 ? (
                    <p>"No Pending Tasks..."</p>
                ) : (
                    <ul>
                        {props.myTaskList.map((task) => (
                            <li key={task.id}>
                                {task.title}
                                <button onClick={() => props.delete(task.id)}>
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            
            }
        </>
    );
};
export default TaskList;