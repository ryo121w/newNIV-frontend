import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import StaticGraph from './StaticGraph';
import DynamicGraph from './Dynamic/DynamicGraph';
import EntryPage from './EntryPage';
import FUVGraph from './FUVGraph/FUVGraph';
import Other from './Other/Other';
import Login from './Login';
import AuthChoice from './AuthChoice';
import SuperUserLogin from './SuperUserLogin';
import Signup from './Signup';
import WaitingForApproval from './WaitingForApproval';
import LogoutButton from './LogoutButton';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState(null);
    const [logoutTimer, setLogoutTimer] = useState(null);
    const [isSuperUserAuthenticated, setIsSuperUserAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [shouldNavigateToEntry, setShouldNavigateToEntry] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setLogoutTimer(setTimeout(() => {
                setIsAuthenticated(false);
            }, 2 * 60 * 60 * 1000));
        }
        return () => clearTimeout(logoutTimer);
    }, [isAuthenticated]);

    const handleAuthChoice = (choice) => {
        setAuthView(choice);
    };

    const handleSuperUserLogin = (user) => {
        setIsAuthenticated(true);
        setIsSuperUserAuthenticated(true);
        setCurrentUser(user);
        setAuthView(null);
        setShouldNavigateToEntry(true);
        setLogoutTimer(setTimeout(() => {
            setIsAuthenticated(false);
        }, 2 * 60 * 60 * 1000));
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setAuthView(null);
        setShouldNavigateToEntry(true);
        setLogoutTimer(setTimeout(() => {
            setIsAuthenticated(false);
        }, 2 * 60 * 60 * 1000));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        clearTimeout(logoutTimer);
        setAuthView(null);
    };

    useEffect(() => {
        return () => clearTimeout(logoutTimer);
    }, []);

    if (!isAuthenticated && !authView) {
        return <AuthChoice onChoice={handleAuthChoice} />;
    }

    return (
        <Router basename="/forntend">


            <Routes>
                {authView === 'login' && <Route path="/" element={<Login onLogin={() => { handleLogin(); setShouldNavigateToEntry(true); }} />} />}
                {authView === 'superuser-login' && <Route path="/" element={<SuperUserLogin onSuperUserLogin={(user) => { handleSuperUserLogin(user); setShouldNavigateToEntry(true); }} />} />}
                {authView === 'signup' && <Route path="/" element={<Signup onSignup={() => setAuthView('waitingForApproval')} />} />}
                {authView === 'waitingForApproval' && <Route path="/" element={<WaitingForApproval />} />}
                {isAuthenticated ? <Route path="/entry" element={<EntryPage isSuperUserAuthenticated={isSuperUserAuthenticated} currentUser={currentUser} />} /> : <Route path="*" element={<Navigate to="/" replace />} />}
                <Route path="/static" element={<StaticGraph />} />
                <Route path="/dynamic" element={<DynamicGraph />} />
                <Route path="/fuv" element={<FUVGraph />} />
                <Route path="/other" element={<Other />} />
            </Routes>
            {shouldNavigateToEntry && <Navigate to="/entry" replace onNavigate={() => setShouldNavigateToEntry(false)} />}
            {isAuthenticated && <LogoutButton onLogout={handleLogout} />}
        </Router>
    );
}

export default App;
