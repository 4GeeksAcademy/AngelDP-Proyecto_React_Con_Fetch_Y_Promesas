import React, { useState } from "react";
import "./NewUser.css";

const NewUser = (props) => {
    const [userName, setUserName] = useState("");
    const [newUserMessage, setNewUserMessage] = useState("");
    const [newUserError, setNewUserError] = useState(false);

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


            const newUser = await response.json();

            setNewUserMessage("Usuario creado con éxito!");
            setNewUserError(false);
            setUserName("");

            if(props.userAdded) {
                props.userAdded();
            }
            
        } catch (error) {
            setNewUserMessage("Error: " + error.message);
            setNewUserError(true);
        }
    };

    return (
        <div className="new-user">
            <input
                type="text"
                placeholder="Nombre del usuario"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={handleNewUser}>Agregar usuario</button>
            {newUserMessage && (
                <p style={{ color: newUserError ? "red" : "green" }}>{newUserMessage}</p>
            )}
        </div>
    );
};

export default NewUser;