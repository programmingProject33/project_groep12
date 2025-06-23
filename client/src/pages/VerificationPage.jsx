import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerificationPage.css';

const VerificationPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('Verifying...');
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Geen verificatietoken gevonden.');
                setVerificationStatus('Verificatie mislukt');
                return;
            }

            console.log("Verifieer token:", token);

            try {
                const response = await fetch(`/api/confirm/${token}`, {
                    method: 'GET',
                });
                console.log("Response status:", response.status);

                const data = await response.json();
                console.log("Response body:", data);

                if (response.ok) {
                    // Succesvolle verificatie
                    if (data.status === 'success') {
                        setVerificationStatus('✅ Account succesvol geverifieerd!');
                        setError(''); // Clear any previous errors
                        
                        // Redirect after a few seconds
                        setTimeout(() => {
                            navigate(data.redirect || '/login');
                        }, 3000);
                    } else if (data.status === 'already_verified' || data.status === 'token_used') {
                        // Account is al geverifieerd
                        setVerificationStatus('✅ Account al geverifieerd!');
                        setError('Je account is al geverifieerd. Je wordt doorgestuurd naar de loginpagina...');
                        setIsRedirecting(true);
                        setTimeout(() => navigate('/login'), 3000);
                    } else {
                        // Andere succesvolle status
                        setVerificationStatus('✅ Verificatie voltooid!');
                        setError(''); // Clear any previous errors
                        setTimeout(() => navigate('/login'), 3000);
                    }
                } else {
                    // Fout bij verificatie
                    const errorMessage = data.message || 'Er is een onbekende fout opgetreden.';
                    
                    if (data.status === 'invalid_token') {
                        setVerificationStatus('❌ Ongeldige verificatielink');
                        setError('Deze link is niet meer geldig. Je wordt doorgestuurd naar de registratiepagina...');
                        setIsRedirecting(true);
                        setTimeout(() => navigate('/registreer'), 4000);
                    } else if (data.status === 'server_error') {
                        setVerificationStatus('❌ Serverfout');
                        setError('Er is een technische fout opgetreden. Probeer het later opnieuw of neem contact op met de beheerder.');
                    } else {
                        setVerificationStatus('❌ Verificatie mislukt');
                        setError(errorMessage);
                    }
                }
            } catch (err) {
                console.error('Verification error:', err);
                setVerificationStatus('Verificatie mislukt');
                setError('Kan geen verbinding maken met de server. Controleer je internetverbinding en probeer het opnieuw.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    // Only show error message if there's an actual error and verification failed
    const shouldShowError = error && verificationStatus === 'Verificatie mislukt';

    return (
        <div className="verification-container">
            <div className={`verification-box ${
                verificationStatus === '✅ Account succesvol geverifieerd!' ? 'success' : 
                verificationStatus === 'Verificatie mislukt' ? 'error' : ''
            }`}>
                <h1>Accountverificatie</h1>
                <p className="status-message">{verificationStatus}</p>
                
                {verificationStatus === '✅ Account succesvol geverifieerd!' && (
                    <div className="success-content">
                        <p>🎉 Gefeliciteerd! Je account is succesvol geverifieerd.</p>
                        <p>Je kunt nu inloggen en gebruik maken van alle functies van Career Launch.</p>
                        {userType && (
                            <p><strong>Account type:</strong> {userType === 'student' ? 'Student' : 'Bedrijf'}</p>
                        )}
                        <p className="redirect-message">Je wordt automatisch doorgestuurd naar de loginpagina...</p>
                    </div>
                )}

                {shouldShowError && (
                    <div className="error-content">
                        <p className="error-message">{error}</p>
                        {!isRedirecting && (
                            <>
                                <p className="help-text">
                                    Als je problemen ondervindt, probeer dan:
                                </p>
                                <ul className="help-list">
                                    <li>De link opnieuw te kopiëren en plakken</li>
                                    <li>Contact op te nemen met de beheerder</li>
                                    <li>Een nieuwe registratie te proberen</li>
                                </ul>
                            </>
                        )}
                    </div>
                )}

                {(verificationStatus === 'Verificatie mislukt' && !isRedirecting) && (
                    <div className="action-buttons">
                        <button onClick={() => navigate('/login')} className="login-button">
                            Ga naar de loginpagina
                        </button>
                        <button onClick={() => navigate('/registreer')} className="register-button">
                            Nieuwe registratie
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationPage; 