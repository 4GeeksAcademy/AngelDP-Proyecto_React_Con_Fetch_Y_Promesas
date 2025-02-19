import React, { useState } from 'react';
import "./UsersList.css";

const UsersList = (props) => {
    const [selectedUser, setSelectedUser] = useState('');

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        setSelectedUser(selectedId);
        
        
        const selectedUserData = props.users.find(user => user.id === parseInt(selectedId));
        
        if (props.onUserSelect) {
            props.onUserSelect(selectedUserData);
        }
    };

    return (
        <>
            {props.loading ? (
                <p>Cargando usuarios ... </p>
            ) : props.error ? (
                <p>Error: {props.error}</p>
            ) : (
                <select 
                    className="form-select " 
                    value={selectedUser}
                    onChange={handleSelectChange}
                    aria-label="Default select example"
                >
                    <option value="">Selecciona un usuario</option>
                    {props.users.map((user) => (
                        <option key={user.id} value={user.id} className='form-select'>
                            {user.name}
                        </option>
                    ))}
                </select>
            )}
        </>
    );
};

export default UsersList;