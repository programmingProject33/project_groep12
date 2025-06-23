import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../pages/AdminDetail.css';

const Dienstverbanden = () => {
    const [gebruikers, setGebruikers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [statistieken, setStatistieken] = useState([]);
    const [showStats, setShowStats] = useState(false);

    const dienstverbanden = ['Voltijds', 'Deeltijds', 'Freelance', 'Stage'];

    useEffect(() => {
        fetchGebruikers();
        fetchStatistieken();
    }, []);

    const fetchGebruikers = async () => {
        try {
            const response = await fetch('/api/admin/dienstverbanden/gebruikers');
            if (!response.ok) throw new Error('Fout bij ophalen gebruikers');
            const data = await response.json();
            setGebruikers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistieken = async () => {
        try {
            const response = await fetch('/api/admin/dienstverbanden/statistieken');
            if (!response.ok) throw new Error('Fout bij ophalen statistieken');
            const data = await response.json();
            setStatistieken(data);
        } catch (err) {
            console.error('Fout bij ophalen statistieken:', err);
        }
    };

    const updateDienstverband = async (gebruikerId, dienstverband) => {
        setUpdatingId(gebruikerId);
        try {
            const response = await fetch(`/api/admin/dienstverbanden/gebruiker/${gebruikerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dienstverbanden: dienstverband }),
            });

            if (!response.ok) throw new Error('Fout bij updaten dienstverband');
            
            // Update lokale state
            setGebruikers(prev => prev.map(user => 
                user.gebruiker_id === gebruikerId 
                    ? { ...user, dienstverbanden: dienstverband }
                    : user
            ));
            
            // Refresh statistieken
            fetchStatistieken();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const assignAllDienstverbanden = async () => {
        try {
            const response = await fetch('/api/admin/dienstverbanden/toewijzen', {
                method: 'POST',
            });
            
            if (!response.ok) throw new Error('Fout bij toewijzen dienstverbanden');
            
            const result = await response.json();
            alert(result.message);
            
            // Refresh data
            fetchGebruikers();
            fetchStatistieken();
            
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <Layout><div>Laden...</div></Layout>;
    if (error) return <Layout><div className="error">Fout: {error}</div></Layout>;

    return (
        <Layout>
            <div className="admin-detail-container">
                <h1>Dienstverbanden Beheer</h1>
                
                <div className="action-buttons">
                    <button 
                        onClick={assignAllDienstverbanden}
                        className="btn btn-primary"
                    >
                        Automatisch Toewijzen
                    </button>
                    <button 
                        onClick={() => setShowStats(!showStats)}
                        className="btn btn-secondary"
                    >
                        {showStats ? 'Verberg' : 'Toon'} Statistieken
                    </button>
                </div>

                {showStats && (
                    <div className="stats-container">
                        <h3>Statistieken</h3>
                        <div className="stats-grid">
                            {statistieken.map((stat, index) => (
                                <div key={index} className="stat-card">
                                    <h4>{stat.dienstverbanden || 'Niet toegewezen'}</h4>
                                    <p>{stat.aantal} gebruikers</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Naam</th>
                                <th>Email</th>
                                <th>Opleiding</th>
                                <th>Jaar</th>
                                <th>Dienstverband</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gebruikers.map((gebruiker) => (
                                <tr key={gebruiker.gebruiker_id}>
                                    <td>{gebruiker.gebruiker_id}</td>
                                    <td>{gebruiker.voornaam} {gebruiker.naam}</td>
                                    <td>{gebruiker.email}</td>
                                    <td>{gebruiker.opleiding}</td>
                                    <td>{gebruiker.opleiding_jaar || '-'}</td>
                                    <td>
                                        <select
                                            value={gebruiker.dienstverbanden || ''}
                                            onChange={(e) => updateDienstverband(gebruiker.gebruiker_id, e.target.value)}
                                            disabled={updatingId === gebruiker.gebruiker_id}
                                            className="dienstverband-select"
                                        >
                                            <option value="">Selecteer...</option>
                                            {dienstverbanden.map((dv) => (
                                                <option key={dv} value={dv}>
                                                    {dv}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        {updatingId === gebruiker.gebruiker_id && (
                                            <span className="updating">Updaten...</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Dienstverbanden; 