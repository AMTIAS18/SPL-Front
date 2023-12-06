import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import '../styles/AdminStats.css';

function AdminStats() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [showProductStats, setShowProductStats] = useState(false);
  const [topCustomers, setTopCustomers] = useState(null);

  const handleDateChange = (event) => {
    const { id, value } = event.target;
    id === 'startDate' ? setStartDate(value) : setEndDate(value);
  };

  const fetchStats = async () => {
    if (startDate === '' || endDate === '') {
      alert('Por favor, elige ambas fechas para obtener estadísticas.');
      return;
    }
  
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/stats/historial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener las estadísticas');
      }
  
      const data = await response.json();
      setStatsData(data);
  
      try {
        const productResponse = await fetch('https://entreraices-production.up.railway.app/api/stats/getproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ start_date: startDate, end_date: endDate }),
        });
        
        if (!productResponse.ok) {
          throw new Error('Error al obtener las estadísticas de productos');
        }
        
        const productData = await productResponse.json();
        setProductStats(productData.data);
        setShowProductStats(true);
  
        await fetchTopCustomers();
      } catch (error) {
        console.error('Error al cargar las estadísticas de productos:', error);
      }
    } catch (error) {
      console.error('Error al cargar las estadísticas:', error);
    }
  };

  const fetchTopCustomers = async () => {
    if (startDate === '' || endDate === '') {
      alert('Por favor, elige ambas fechas para obtener estadísticas.');
      return;
    }
  
    try {
      const response = await fetch('https://entreraices-production.up.railway.app/api/stats/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener las estadísticas de clientes');
      }
  
      const data = await response.json();
      setTopCustomers(data.data);
    } catch (error) {
      console.error('Error al cargar las estadísticas de clientes:', error);
    }
  };
  

  useEffect(() => {
    let chartInstance = null;
  
    if (productStats && showProductStats) {
      const sortedProductStats = productStats.sort((a, b) => parseInt(b.cantidad_total, 10) - parseInt(a.cantidad_total, 10));
    
      const ctx = document.getElementById('productChart');
    
      if (chartInstance) {
        chartInstance.destroy();
      }
    
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedProductStats.map((product) => product.nombre),
          datasets: [{
            label: 'Cantidad Vendida',
            data: sortedProductStats.map((product) => parseInt(product.cantidad_total, 10)),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [productStats, showProductStats]);

  return (
    <div className='fondo-admin-stats'>
      <div className='admin-stats'>
        <h2>Estadísticas</h2>
        <div className='date-selector'>
          <label htmlFor='startDate'>Desde:</label>
          <input type='date' id='startDate' value={startDate} onChange={handleDateChange} />
  
          <label htmlFor='endDate'>Hasta:</label>
          <input type='date' id='endDate' value={endDate} onChange={handleDateChange} />
        </div>
  
        <button onClick={fetchStats}>Obtener Estadísticas</button>
  
        {statsData && statsData.success && (
          <div className='stats-result'>
            <h3>Ingreso Total: ${statsData.data[0].ingreso_total}</h3>
          </div>
        )}
  
        {showProductStats && statsData && statsData.success && ( // Mostrar solo si showProductStats es verdadero y statsData es exitoso
          <div className='charts-container'>
            <div className='chart'>
              <h4>Productos mas vendidos:</h4>
              <canvas id='productChart' width='400' height='200'></canvas>
            </div>
          </div>
        )}
  
        {statsData && !statsData.success && (
          <div className='stats-error'>
            <p>Error al obtener las estadísticas: {statsData.message}</p>
          </div>
        )}
        {topCustomers && (
        <div className='customer-stats'>
            <h4>Mejores Clientes:</h4>
            <ul>
            {topCustomers.slice(0, 10).map((customer, index) => (
                <li key={customer.id_usuario}>
                <p>
                    <strong>{index + 1}. Nombre:</strong> {customer.nombre} {customer.apellido_p} {customer.apellido_m}
                </p>
                <p>
                    <strong>Rut:</strong> {customer.rut}
                </p>
                <p>
                    <strong>Número teléfono:</strong> {customer.num_telefono}
                </p>
                <p>
                    <strong>Total Compras:</strong> {customer.total_compras}
                </p>
                </li>
            ))}
            </ul>
        </div>
        )}
      </div>
    </div>
  );
}

  export default AdminStats;
