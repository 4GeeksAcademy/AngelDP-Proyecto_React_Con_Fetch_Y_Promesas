import React, { useState, useEffect } from "react";
import "./NewTask.css";


const NewTask = (props) => {

    const [newTask, setNewTask] = useState("");
    const [newTaskMessage, setNewTaskMessage] = useState("");
    const [newTaskError, setNewTaskError] = useState(false);


    useEffect(() => {
        if (newTaskMessage) {
            const timer = setTimeout(() => {
                setNewTaskMessage("");
                setNewTaskError(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [newTaskMessage]);


    const handleNewTask = async (e) => {

        e.preventDefault();

        if (!newTask.trim()) {
            setNewTaskMessage("La tarea no puede estar vacía");
            setNewTaskError(true);
            return;
        }

        try {
            const response = await fetch(
                `https://playground.4geeks.com/todo/todos/${props.selectedUser.name}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    label: newTask,
                    is_done: false,
                }),
            });

            if (!response.ok) {
                throw new Error("No hemos podido modificar la tarea.");
            };

            await response.json();

            setNewTaskMessage("Tarea añadida!");
            setNewTaskError(false);
            setNewTask("");

            if (props.onTaskAdded) {
                props.onTaskAdded();
            }

        } catch (error) {
            setNewTaskMessage(error.message);
            setNewTaskError(true);
        };
    }


    return (
        <div className="new-task">

            <input
                type="text"
                placeholder="Nueva tarea : "
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />

            <button onClick={handleNewTask}>Agregar tarea</button>

            <button onClick={props.onDeleteAllTasks}>Borrar tareas</button>

            {newTaskMessage && (
                <p style={{ color: newTaskError ? "red" : "green" }}>{newTaskMessage}</p>
            )}

        </div>
    );
};
export default NewTask;