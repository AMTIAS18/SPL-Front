import React from 'react';
import '../styles/SobreNosotros.css';

function SobreNosotros() {
  return (
    <div className="sobre-nosotros-page">
      <h1>Sobre Nosotros</h1>
      
      <div className="content-container">
        <div className="video-container">
          <video controls>
            <source src="/entre.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
        
        <div className="info-container">
          <h2>Historia de la Empresa</h2>
          <p>
          "Entre Pueblos" nació en 2017 de la mano de José y su primo, iniciando como una pequeña empresa de cervezas artesanales. A pesar de un comienzo modesto, su participación en ferias locales en Curepto y la distribución en botillerías de la comuna les otorgó reconocimiento. Aunque el primo de José decidió seguir otro camino, José continuó con la visión, manteniendo el nombre original. La adversidad de la pandemia llevó a José y su pareja, Aida, a diversificar hacia la gastronomía, iniciando con hamburguesas caseras. Con esfuerzo y dedicación, lo que comenzó en casa evolucionó a un restobar en el corazón de Curepto. Hoy, en 2023, "Entre Pueblos" se enorgullece de ofrecer una amplia variedad de comidas y tragos, y continúa creciendo gracias al compromiso y pasión de sus fundadores.
          </p>
          
          <h2>Misión</h2>
          <p>
          Ofrecer a nuestros clientes experiencias gastronómicas y cerveceras únicas, fusionando tradiciones locales con innovación. En "Entre Pueblos", nos comprometemos a brindar productos de alta calidad y un servicio excepcional, reflejando la pasión y dedicación de nuestros fundadores.
          </p>
          
          <h2>Visión</h2>
          <p>
          Ser reconocidos en la región como el restobar de elección para quienes buscan autenticidad y calidad. Aspiramos a expandir nuestra presencia, manteniendo nuestras raíces y compromiso con la comunidad de Curepto, y convirtiéndonos en un emblema de la gastronomía y cerveza artesanal local.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SobreNosotros;