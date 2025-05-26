import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    return {
        handleNavigateToJoin: useCallback(() => navigate('/'), [navigate]),
        handleNavigateToHome: useCallback((name: string) => navigate(`/home/${name}`), [navigate]),
        handleNavigateToCall: useCallback((name: string, role: string, peer: string) => navigate(`/call/${name}/${role}/${peer}`), [navigate])
    };
};
