import React, { useState, useEffect } from "react";
import "./NewUser.css";

const NewUser = (props) => {
    const [userName, setUserName] = useState("");
    const [newUserMessage, setNewUserMessage] = useState("");
    const [newUserError, setNewUserError] = useState(false);

    useEffect(() => {
        if (newUserMessage) {
            const timer = setTimeout(() => {
                setNewUserMessage("");
                setNewUserError(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [newUserMessage]);

    const handleNewUser = async (e) => {
        e.preventDefault();

        if (!userName.trim()) {
            setNewUserMessage("El nombre no puede estar vacío");
            setNewUserError(true);
            return;
        }

        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userName,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear el usuario");
            }


            const data = await response.json();
            console.log(data)

            setNewUserMessage("Usuario creado con éxito!");
            setNewUserError(false);
            setUserName("");
            props.onNewUser(data)

            if (props.userAdded) {
                props.userAdded();
            }

        } catch (error) {
            setNewUserMessage("Error: " + error.message);
            setNewUserError(true);
        }
    };

    return (
        <>
            <div className="new-user">
                <input
                    type="text"
                    placeholder="Nombre del usuario"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button onClick={handleNewUser}>Agregar usuario</button>

            </div>
            {newUserMessage && (
                <p className="text-center mb-2 " style={{ color: newUserError ? "red" : "green" }}><strong>{newUserMessage}</strong></p>
            )}
        </>

    );
};

export default NewUser;