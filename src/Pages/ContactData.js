import React, { useState } from 'react';
import '../styles/ContactData.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function ContactData() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        cardNumber: '',
        ccv: '',
        expirationDate: '',
        address: '',
        subtotal: 0
    });

    const [mapLocation, setMapLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleMapClick = (e) => {
        setMapLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setShowMap(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="contact-data">
            <h2>Finaliza tu pedido</h2>
            <p>Por favor, ingresa tus datos para completar la compra.</p>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <input type="text" name="name" placeholder="Nombre" onChange={handleChange} />
                    <input type="tel" name="phoneNumber" placeholder="Número de teléfono" onChange={handleChange} />
                </div>
                <input type="email" name="email" placeholder="Correo para enviar comprobante" onChange={handleChange} />
                <div className="row">
                    <input type="text" name="cardNumber" placeholder="Número de tarjeta" onChange={handleChange} />
                    
                    <input 
                        type="text" 
                        name="cvv" 
                        placeholder="cvv" 
                        maxLength="3"
                        pattern="\d{3}" 
                        title="Por favor, ingresa 3 números para el CVV." 
                        onChange={handleChange} 
                    />
                </div>
                <input 
                    type="text" 
                    name="expirationDate" 
                    placeholder="Fecha de expiración (MM/AA)" 
                    maxLength="5" 
                    pattern="(0[1-9]|1[0-2])/\d{2}" 
                    title="Por favor, ingresa en el formato MM/AA." 
                    onChange={handleChange} 
                />
                <hr />
                <input type="text" name="address" placeholder="Dirección de entrega" onChange={handleChange} />
                <button onClick={() => setShowMap(true)}>Seleccionar ubicación con Google Maps</button>
                {showMap && (
                    <LoadScript googleMapsApiKey="TU_CLAVE_DE_API">
                        <GoogleMap
                            mapContainerStyle={{ width: '400px', height: '400px' }}
                            center={{ lat: -34.397, lng: 150.644 }}
                            zoom={10}
                            onClick={handleMapClick}
                        >
                            {mapLocation && <Marker position={mapLocation} />}
                        </GoogleMap>
                    </LoadScript>
                )}
                <input type="number" name="subtotal" placeholder="Subtotal" readOnly value={formData.subtotal} />
                <button type="submit">Pagar</button>
            </form>
        </div>
    );
}

export default ContactData;