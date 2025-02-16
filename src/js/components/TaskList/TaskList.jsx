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
                            <button onClick={() => props.selectTask(task)} type="button" className="btn btn-warning float-end">
                                Edit
                            </button>
                            <button onClick={() => props.delete(task.id)} type="button" className="btn btn-danger float-end">
                                Delete
                            </button>
                            {props.selectedTask?.id === task.id && (
                                <button onClick={props.update} className="btn btn-success float-end">
                                    Update
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )

            }
        </>
    );
};
export default TaskList;