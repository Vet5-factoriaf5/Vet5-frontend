// Página de inicio de la aplicación de la veterinaria

import React from "react";
import "./Home.css";
import bannerImage from "../assets/images/banner-ok.webp";

function Home() {
    return (
        <div
            className="home"
            /* Estilos en línea para la imagen de fondo */
            style={{
                backgroundImage: `url(${bannerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                width: "100%",
            }}
        >
            <header className="home__header">
                <h2>Happy Paws</h2>
                <h1>
                    El amor que los une,
                    el cuidado que nos
                    inspira.
                </h1>
                <p>
                    Sabemos que tu mascota es parte de tu vida. Por eso, en Happy Paws,
                    combinamos el trato cercano de un amigo con la precisión de la tecnología avanzada,
                    para que cada visita sea una experiencia de confianza y tranquilidad.
                    Estamos aquí para cuidar de él como si fuera nuestro.
                </p>
                <h3>
                    Regístrate junto a tu mascota y accede a promociones exclusivas y servicios prioritarios.
                </h3>
                <div className="home__cta">
                    <h3>¡Únete a nuestra familia!.</h3>
                    <button
                        className="btn-registrate"
                    >
                        Regístrate
                    </button>
                </div>
            </header>
        </div>
    );
}

export default Home;