import React, { useEffect, useRef, useState } from 'react';
import InputTask from '../InputTask/InputTask.jsx';
import TaskList from '../TaskList/TaskList.jsx';

const MyList = () => {


    // SE DECARAN LOS ESTADOS NECESARIOS SOBRE LA MARCHA.

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

    const [showMessage, setShowMessage] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null)


    // SE USA UN "USEEFFECT" PARA ACTUALIZAR EL MENSAJE DADO EL CASO NECESARIO.

    useEffect(() => {
        let timeoutId;
        if (message) {
            setShowMessage(true);
            timeoutId = setTimeout(() => {
                setShowMessage(false);
                setMessage('');
            }, 2000);
        }
        return () => clearTimeout(timeoutId);
    }, [message]);


    // SE HACE CONTACTO CON EL METODO "GET" LA BASE DE DATOS Y TRAEMOS LOS PRIMEROS 5.

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


    //MANEJO DE ERROR Y DE PANTALLA DE CARGA.

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


    // SE MANEJA EL VALOR DEL INPUT.

    const handleValue = (e) => {
        setInputValue(e.target.value);
    };


    //SE COMPRUEBA QUE EL VALOR DEL INPUT NO SEA " ".

    const validateInput = () => {
        if (!inputValue.trim()) {
            setMessage("You can't create an empty task");
            return false;
        }
        return true;
    };


    //SE CREA UNA FUNCION PARA MANEJAR LA TAREA SELECCIONADA.

    const handleSelectedTask = (task) => {
        setSelectedTask(task); 
        setInputValue(task.title);
    };


    // SE CONFIGURA EL EVENTO PARA QUE CUANDO SE PRESIONE "ENTER" SE EJECUTE EL "POST".

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            handleTask(e);
        }
    };


    // SE HACE CONTACTO CON EL METODO POST PARA AGREGAR UNA TAREA.

    const handleTask = async (e) => {

        e.preventDefault();

        if (!validateInput()) {
            return;
        }

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

            setAllMyTasks([...allMyTasks, { ...data, id: Math.random() * 100 }]);
            setMessage('We did it!!');
            setError(false);
            setInputValue('');


        } catch (error) {
            setMessage(error.message)
            setError(true)
        };
    };


    // SE HACE CONTACTO CON EL METODO "DELETE" PARA ELIMINAR UNA TAREA.

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


    //SE CEA LA LLAMADA CON EL METODO "PUT" PARA ACTUALIZAR LAS TAREAS.

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();

        if (!selectedTask) {
            setMessage("No task selected for update!");
            return;
        }

        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${selectedTask.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        id: selectedTask.id,
                        title: inputValue,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Something went wrong while updating the task.");
            }

            const updatedTask = await response.json();
            setMessage("Task updated successfully!");
            setError(false);

            setAllMyTasks(
                allMyTasks.map((task) =>
                    task.id === selectedTask.id ? { ...task, title: inputValue } : task
                )
            );

            setSelectedTask(null);
            setInputValue("");
        } catch (error) {
            setMessage(error.message);
            setError(true);
        }
    };

    
    return (
        <>
            {showMessage && message && (
                <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
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
                updateValue={handleSelectedTask}
                update={handleUpdate}
                selectedTask={selectedTask}
            />
        </>
    );
};

export default MyList;