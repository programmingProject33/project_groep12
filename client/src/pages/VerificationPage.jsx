import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import './VerificationPage.css';

const VerificationPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Je e-mailadres wordt geverifieerd...');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setMessage('Geen verificatietoken gevonden.');
            setError(true);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/verify?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message + ' Je wordt nu doorgestuurd...');
                    setError(false);
                    
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);

                } else {
                    setMessage(data.error || 'Er is een fout opgetreden bij het verifiëren.');
                    setError(true);
                }
            } catch (err) {
                setMessage('Kon geen verbinding maken met de server.');
                setError(true);
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    return (
        <div className="verification-container">
            <div className={`verification-box ${error ? 'error' : 'success'}`}>
                <h1>E-mail Verificatie</h1>
                <p className="message">{message}</p>
                {!error && (
                    <Link to="/login" className="link-button">
                        Ga direct naar Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerificationPage; 