import React, { useEffect, useRef, useState } from 'react';
import InputTask from '../InputTask/InputTask.jsx';
import TaskList from '../TaskList/TaskList.jsx';

const MyList = () => {

    const [allMyTasks, setAllMyTasks] = useState(() => {
        const savedTasks = sessionStorage.getItem('items');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    useEffect(() => {
        sessionStorage.setItem('items', JSON.stringify(allMyTasks))
    }, [allMyTasks]);


    const [inputValue, setInputValue] = useState('');

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    const [message, setMessage] = useState('');

    const [body, setBody] = useState('');

    /*const msg = useRef(null)*/



    useEffect(() => {

        const fetchDocs = async () => {
            try {
                const response = await fetch(
                    'https://jsonplaceholder.typicode.com/posts'
                );

                if (!response.ok) {
                    throw new Error('Houston we have a problem!!')
                }

                const data = await response.json();


                setAllMyTasks(data.slice(0, 5))
                setLoading(false);

            } catch (error) {
                setError(error.message);
                setLoading(false);
            };
        };

        fetchDocs();

    }, []);



    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }


    const handleValue = (e) => {
        setInputValue(e.target.value);
    };

    const handleTask = async (e) => {

        e.preventDefault();

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: inputValue,
                    }),
                });

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const data = await response.json();

            setAllMyTasks([...allMyTasks, {...data, id: Math.floor(Math.random() * 100)}]);
            setMessage('We did it!! ID: ' + data.id);
            setError(false);
            setInputValue('');


        } catch (error) {
            setMessage(error.message)
            setError(true)
        };
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleTask(e);
        }
    };

    const deleteTask = async (taskId) => {

        if (!window.confirm('Are you sure?')) {
            return
        }

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${taskId}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Something went wrong in the execution');
            };

            setAllMyTasks(allMyTasks.filter(task => task.id !== taskId));
            setMessage('Target annihilated');
            setError(false);
        } catch (error) {
            setMessage(error.message);
            setError(true);
        }
    };

    /*useEffect(() => {
        if (msg.current) {
            const timeoutId = setTimeout(() => {
                msg.current.style.display = 'none';
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [message]);*/

    return (
        <>
            {message && (
                <div /*ref={msg}*/ className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <InputTask
                task={inputValue}
                newValue={handleValue}
                sendTask={handleKeyDown}
            />

            <TaskList
                myTaskList={allMyTasks}
                delete={deleteTask}
            />


        </>
    );
};

export default MyList;