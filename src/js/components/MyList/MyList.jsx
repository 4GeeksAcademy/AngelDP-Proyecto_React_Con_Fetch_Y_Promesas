import React, { useEffect, useState } from 'react';
import UsersList from '../UsersList/UsersList.jsx';
import NewUser from '../NewUser/NewUser.jsx';
import NewTask from '../NewTask/NewTask.jsx';
import "./MyList.css";

const MyList = () => {

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {

        try {
            const response = await fetch(
                'https://playground.4geeks.com/todo/users'
            );

            if (!response.ok) {
                throw new Error("No hemos podido cargar los usuarios.")
            }

            const data = await response.json();
            console.log(data)
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchLabel = async () => {

        try {
            const response = await fetch(
                `https://playground.4geeks.com/todo/users/${selectedUser.name}`
            );

            if (!response.ok) {
                throw new Error("No hemos podido cargar las tareas.")
            }

            const data = await response.json();
            console.log(data)
            setTasks(data.todos);

        } catch (error) {
            setError(error.message);
            setTasks("");
        }
    }


    const handleToggleTask = async (taskId, currentStatus) => {
        try {
            const response = await fetch(
                `https://playground.4geeks.com/todo/todos/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    is_done: !currentStatus
                }),
            });

            if (!response.ok) {
                throw new Error("No hemos podido actualizar el estado.")
            }

            fetchLabel();
            setError(false);

        } catch (error) {
            setError(true)
        }
    }




    useEffect(() => {
        if (selectedUser) {
            fetchLabel();
        }
    }, [selectedUser]);


    const handleUserAdded = () => {
        fetchUsers();
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        console.log('Usuario seleccionado:', user);
    };

    const handleTaskAdded = () => {
        fetchLabel();
    };



    const handleDelete = async (e) => {
        try {

            await Promise.all(tasks.map(async (task) => {
                const response = await fetch(
                    `https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error(`Error al eliminar la tarea con id ${task.id}`);
                }
            }));


            setTasks([]);
            setError(null);

            fetchLabel();

        } catch (error) {
            setError(error.message)
        }

    }




    return (
        <>
            <NewUser userAdded={handleUserAdded} onNewUser={handleUserSelect} />
            <UsersList
                users={users}
                loading={loading}
                error={error}
                onUserSelect={handleUserSelect}
            />

            {selectedUser && (
                <div className='mylist-container'>
                    <div className='d-flex align-items-center'>
                        <h3>Usuario seleccionado: {selectedUser.name.charAt(0).toUpperCase() + selectedUser.name.slice(1)}</h3>
                    </div>
                    <h4>Tareas del usuario:</h4>
                    {tasks.length > 0 ? (
                        <ul className="task-list">
                            {tasks.map((task) => (
                                <li key={task.id} className="task-item">
                                    <div className="d-flex align-items-center w-100">
                                        <input
                                            type="checkbox"
                                            checked={task.is_done}
                                            onChange={() => handleToggleTask(task.id, task.is_done)}
                                            className="task-checkbox"
                                        />
                                        <span className={`task-label ${task.is_done ? 'completed' : ''}`}>
                                            {task.label}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted">No hay tareas para este usuario</p>
                        </div>
                    )}
                    <NewTask
                        tasks={tasks}
                        selectedUser={selectedUser}
                        onTaskAdded={handleTaskAdded}
                        onDeleteAllTasks={handleDelete}
                    />
                </div>
            )}
        </>
    );
};

export default MyList;