import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Carrito.css';

const Pago = () => {
    const navigate = useNavigate();
    const [direccionEncontrada, setDireccionEncontrada] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedDireccion, setEditedDireccion] = useState({ ...direccionEncontrada });
    const [checkoutDetails, setCheckoutDetails] = useState({
        numeroTarjeta: '',
        fechaExpiracion: '',
        codigoSeguridad: '',
    });

    useEffect(() => {
        const userId = localStorage.getItem('id_usuario');

        if (userId) {
            fetch('https://entreraices-production.up.railway.app/api/user')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Error al obtener los datos relacionados con id_direccion');
                })
                .then(data => {
                    const direccion = data.find(item => item.id_usuario === userId);

                    if (direccion) {
                        const idDireccion = direccion.id_direccion;

                        fetch(`https://entreraices-production.up.railway.app/api/address`)
                            .then(response => {
                                if (response.ok) {
                                    return response.json();
                                }
                                throw new Error('Error al obtener los datos de la dirección');
                            })
                            .then(data => {
                                const direccionEncontrada = data.data.find(
                                    item => item.id_direccion === idDireccion
                                );

                                if (direccionEncontrada) {
                                    setDireccionEncontrada(direccionEncontrada);
                                } else {
                                    console.log('No se encontraron detalles para esta dirección');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = () => {
        setEditedDireccion({ ...direccionEncontrada });
        setEditMode(true);
    };

    const handleSave = async () => {
        let idDireccion = editedDireccion.id_direccion;
    
        if (!idDireccion && direccionEncontrada) {
            idDireccion = direccionEncontrada.id_direccion;
        }
    
        if (!idDireccion) {
            console.error('No se encontró el ID de dirección.');
            return;
        }
    
        const { numero_casa, calle, poblacion, descripcion, sector } = editedDireccion;
    
        const requestBody = {
            address_id: idDireccion,
            number_house: numero_casa,
            street: calle,
            town: poblacion,
            description: descripcion,
            sector: sector
        };
    
        try {
            const response = await fetch('https://entreraices-production.up.railway.app/api/address/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (response.ok) {
                setDireccionEncontrada({ ...editedDireccion });
                setEditMode(false);
            } else {
                console.error('Error al actualizar la dirección:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleChange = (field, value) => {
        setEditedDireccion({ ...editedDireccion, [field]: value });
    };

    const prepareCheckout = async () => {
        const userId = localStorage.getItem('id_usuario');
        const requestBodyTicket = {
            user_id: userId,
        };

        const { numeroTarjeta, fechaExpiracion, codigoSeguridad } = checkoutDetails;

        if (!numeroTarjeta || !fechaExpiracion || !codigoSeguridad) {
            alert('Por favor, completa todos los campos de pago para continuar.');
            return;
        }

        try {
            const responseTicket = await fetch('https://entreraices-production.up.railway.app/api/ticket/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBodyTicket),
            });

            if (responseTicket.ok) {
                const responseDataTicket = await responseTicket.json();
                console.log('Respuesta del servidor (Ticket):', responseDataTicket);
            } else {
                console.error('Error al enviar la solicitud (Ticket):', responseTicket.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        localStorage.removeItem('carrito');
        window.location.href = '/Compra';
    };

    const handleCancelarPedido = async () => {
        const userId = localStorage.getItem('id_usuario');
    
        if (userId) {
            const requestBody = {
                client_id: userId,
            };
    
            try {
                const response = await fetch('https://entreraices-production.up.railway.app/api/cart/remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
    
                if (response.ok) {
                    console.log('Carrito vaciado correctamente.', requestBody);
                } else {
                    console.error('Error al vaciar el carrito:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
        setCheckoutDetails({
            numeroTarjeta: '',
            fechaExpiracion: '',
            codigoSeguridad: '',
        });
        navigate('/carrito');
    };    

    return (
        <div className="fondo-pago-container">
            <div className="pago">
                <center>*Por el momento, solo aceptamos pagos con tarjetas de crédito o débito.</center>
                {direccionEncontrada && (
                    <>
                        <div className="seccion-direccion">
                            <h3>Detalles de dirección</h3>
                            {editMode ? (
                                <>
                                    <p><strong>Calle:</strong>
                                    <input
                                        type="text"
                                        value={editedDireccion.calle}
                                        onChange={(e) => handleChange('calle', e.target.value)}
                                    /></p>
                                    <p><strong>Numero Casa:</strong>
                                    <input
                                        type="text"
                                        value={editedDireccion.numero_casa}
                                        onChange={(e) => handleChange('numero_casa', e.target.value)}
                                    /></p>
                                    <p><strong>Poblacion:</strong>
                                    <input
                                        type="text"
                                        value={editedDireccion.poblacion}
                                        onChange={(e) => handleChange('poblacion', e.target.value)}
                                    /></p>
                                    <p><strong>Descripcion:</strong>
                                    <input
                                        type="text"
                                        value={editedDireccion.descripcion}
                                        onChange={(e) => handleChange('descripcion', e.target.value)}
                                    /></p>
                                    <p><strong>Sector:</strong>
                                    <input
                                        type="text"
                                        value={editedDireccion.sector}
                                        onChange={(e) => handleChange('sector', e.target.value)}
                                    /></p>
                                    <div className='direction-button'>
                                        <button onClick={handleSave}>Guardar</button>
                                        <button onClick={handleCancelEdit}>Cancelar</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Calle: {direccionEncontrada.calle}</p>
                                    <p>Numero casa: {direccionEncontrada.numero_casa}</p>
                                    <p>Poblacion: {direccionEncontrada.poblacion}</p>
                                    <p>Descripcion: {direccionEncontrada.descripcion}</p>
                                    <p>Sector: {direccionEncontrada.sector}</p>
                                    <button onClick={handleEdit}>¿Desea modificar su dirección?</button>
                                </>
                            )}
                        </div>
                        <div className="seccion-pago">
                            <h3>Detalles de Pago</h3>
                            <input
                                type="text"
                                placeholder="Número de Tarjeta"
                                value={checkoutDetails.numeroTarjeta}
                                onChange={e => {
                                const inputValue = e.target.value;
                                const cleanedValue = inputValue.replace(/-/g, '');
                                const formattedValue = cleanedValue
                                    .replace(/\D/g, '')
                                    .slice(0, 16)
                                    .match(/.{1,4}/g)
                                    ?.join('-') || '';

                                setCheckoutDetails({
                                    ...checkoutDetails,
                                    numeroTarjeta: formattedValue,
                                });
                                }}
                                maxLength={19}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Fecha de Expiración (MM/YY)"
                                value={checkoutDetails.fechaExpiracion}
                                onChange={e => {
                                const inputValue = e.target.value;
                                const cleanedValue = inputValue.replace(/\//g, '');
                                const formattedValue = cleanedValue
                                    .replace(/\D/g, '')
                                    .slice(0, 4)
                                    .match(/.{1,2}/g)
                                    ?.join('/') || '';

                                setCheckoutDetails({
                                    ...checkoutDetails,
                                    fechaExpiracion: formattedValue,
                                });
                                }}
                                maxLength={5}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Código de Seguridad"
                                value={checkoutDetails.codigoSeguridad}
                                onChange={e => {
                                const inputValue = e.target.value;
                                const formattedValue = inputValue.replace(/\D/g, '').slice(0, 3);

                                setCheckoutDetails({
                                    ...checkoutDetails,
                                    codigoSeguridad: formattedValue,
                                });
                                }}
                                maxLength={3}
                                required
                            />
                            <div>
                                <button onClick={prepareCheckout} className="boton-pago">
                                    Realizar pago
                                </button>
                                <button onClick={handleCancelarPedido} className="boton-cancelar">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default Pago;
