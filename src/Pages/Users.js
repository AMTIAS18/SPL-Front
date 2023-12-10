import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './../styles/Users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        id_usuario: "",
        rut: "",
        nombre: "",
        apellido_p: "",
        apellido_m: "",
        correo: "",
        rol: "",
        num_telefono: "",
        estado_actividad: ""
    });

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchData();
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const rolResponse = await fetch('https://entreraices-production.up.railway.app/api/rol');
            const rolData = await rolResponse.json();
            setRoles(rolData.roles);
        } catch (error) {
            console.error('Error obteniendo los roles:', error);
        }
    };

    const fetchData = async () => {
        try {
            const userResponse = await fetch('https://entreraices-production.up.railway.app/api/user');
            const userData = await userResponse.json();
            const cuentaResponse = await fetch('https://entreraices-production.up.railway.app/api/account');
            const cuentaData = await cuentaResponse.json();
            const rolResponse = await fetch('https://entreraices-production.up.railway.app/api/rol');
            const rolData = await rolResponse.json();

            const usersWithRoles = userData.map(user => {
                const cuenta = cuentaData.find(cuenta => cuenta.nombre_usuario === user.rut);

                if (cuenta) {
                    const rol = rolData.roles.find(role => role.id_rol === cuenta.id_rol);
                    return { ...user, rol: rol ? rol.rol : 'Sin rol', estado_actividad: cuenta.estado_actividad, id_cuenta: cuenta.id_cuenta };
                } else {
                    return { ...user, rol: 'Sin rol', estado_actividad: 'Desconocido' };
                }
            });

            setUsers(usersWithRoles);
        } catch (error) {
            console.error('Error obteniendo los datos:', error);
        }
    };

    const handleEditClick = (user) => {
        setEditedUser(user);
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        try {
            const userUpdateResponse = await fetch('https://entreraices-production.up.railway.app/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: editedUser.id_usuario,
                    rut: editedUser.rut,
                    name: editedUser.nombre,
                    lastname_1: editedUser.apellido_p,
                    lastname_2: editedUser.apellido_m,
                    email: editedUser.correo,
                    id_address: editedUser.id_direccion,
                    phone_number: editedUser.num_telefono,
                }),
            });

            if (!userUpdateResponse.ok) {
                throw new Error('Error al actualizar el usuario en la tabla de usuario');
            }

            const cuentaResponse = await fetch('https://entreraices-production.up.railway.app/api/account');
            const cuentaData = await cuentaResponse.json();
            const userCuenta = cuentaData.find(account => account.id_cuenta === editedUser.id_cuenta);

            if (!userCuenta) {
                throw new Error('No se pudo encontrar la cuenta del usuario');
            }

            const selectedRole = roles.find(role => role.rol === editedUser.rol);

            if (!selectedRole) {
                throw new Error('Rol seleccionado no encontrado');
            }

            const updatedAccountData = {
                id_cuenta: userCuenta.id_cuenta,
                id_cliente: userCuenta.id_cliente,
                id_rol: selectedRole.id_rol,
                estado_actividad: editedUser.estado_actividad,
                nombre_usuario: userCuenta.nombre_usuario,
                id_credencial: userCuenta.id_credencial
            };

            const accountUpdateResponse = await fetch('https://entreraices-production.up.railway.app/api/account/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAccountData),
            });

            if (!accountUpdateResponse.ok) {
                throw new Error('Error al actualizar el estado de actividad de la cuenta');
            }

            const updatedUsers = users.map(user => {
                if (user.id_usuario === editedUser.id_usuario) {
                    return { ...user, rol: editedUser.rol, estado_actividad: editedUser.estado_actividad };
                }
                return user;
            });
            setUsers(updatedUsers);
            await fetchData();

            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar el usuario y la cuenta:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditedUser({
            id_usuario: "",
            rut: "",
            nombre: "",
            apellido_p: "",
            apellido_m: "",
            correo: "",
            rol: "",
            num_telefono: "",
            estado_actividad: ""
        });
        setIsEditing(false);
    };

    return (
        <div className="users-container">
            <div className='users-container-header'>
                <Link to="/AdminPage" className="back-to-admin-link-users">
                    <i className="fas fa-arrow-left"></i> Volver
                </Link>
            </div>
            <h2>Lista de Usuarios</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Correo Electrónico</th>
                        <th>Rol</th>
                        <th>Número de Teléfono</th>
                        <th>Estado de Actividad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id_usuario}>
                            <td>{user.rut}</td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <input
                                        type="text"
                                        value={editedUser.nombre}
                                        onChange={(e) => setEditedUser({ ...editedUser, nombre: e.target.value })}
                                    />
                                ) : (
                                    user.nombre
                                )}
                            </td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <input
                                        type="text"
                                        value={editedUser.apellido_p}
                                        onChange={(e) => setEditedUser({ ...editedUser, apellido_p: e.target.value })}
                                    />
                                ) : (
                                    user.apellido_p
                                )}
                            </td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <input
                                        type="text"
                                        value={editedUser.apellido_m}
                                        onChange={(e) => setEditedUser({ ...editedUser, apellido_m: e.target.value })}
                                    />
                                ) : (
                                    user.apellido_m
                                )}
                            </td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <input
                                        type="text"
                                        value={editedUser.correo}
                                        onChange={(e) => setEditedUser({ ...editedUser, correo: e.target.value })}
                                    />
                                ) : (
                                    user.correo
                                )}
                            </td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <select
                                        value={editedUser.rol}
                                        onChange={(e) => setEditedUser({ ...editedUser, rol: e.target.value })}
                                    >
                                        {roles.map(role => (
                                            <option key={role.id_rol} value={role.rol}>
                                                {role.rol}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    user.rol
                                )}
                            </td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <input
                                        type="text"
                                        value={editedUser.num_telefono}
                                        onChange={(e) => setEditedUser({ ...editedUser, num_telefono: e.target.value })}
                                    />
                                ) : (
                                    user.num_telefono
                                )}
                            </td>
                            <td>
                                {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                    <select
                                        value={editedUser.estado_actividad}
                                        onChange={(e) => setEditedUser({ ...editedUser, estado_actividad: e.target.value })}
                                    >
                                        <option value="ACTIVADO">ACTIVADO</option>
                                        <option value="BLOQUEADO">BLOQUEADO</option>
                                        <option value="ELIMINADO">ELIMINADO</option>
                                    </select>
                                ) : (
                                    user.estado_actividad
                                )}
                            </td>
                            <td>
                            {isEditing && user.id_usuario === editedUser.id_usuario ? (
                                <>
                                        <button className='edit-button' onClick={handleSaveEdit}>Guardar</button>
                                        <button className="edit-button" onClick={handleCancelEdit}>Cancelar</button>
                                </>
                            ) : (
                                    <button className="edit-button" onClick={() => handleEditClick(user)}>Editar</button>
                            )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;