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

            try {
                const response = await fetch(`http://localhost:5000/api/confirm/${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setVerificationStatus('✅ Account succesvol geverifieerd!');
                    setUserType(data.type || 'gebruiker');
                    setError(''); // Clear any previous errors
                    
                    // Redirect after a few seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 4000);
                } else {
                    const data = await response.json();
                    const errorMessage = data.error || 'Er is een onbekende fout opgetreden.';
                    
                    setVerificationStatus('Verificatie mislukt');

                    if (errorMessage.includes('Ongeldige of verlopen')) {
                        setError('Deze link is niet geldig. Waarschijnlijk is je account al geverifieerd. We sturen je nu door naar de loginpagina...');
                        setIsRedirecting(true);
                        setTimeout(() => navigate('/login'), 4000);
                    } else {
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