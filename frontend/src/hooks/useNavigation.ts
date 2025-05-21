import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    return {
        handleNavigateToJoin: () => navigate('/'),
        handleNavigateToHome: (name: string) => navigate(`/home/${name}`),
        handleNavigateToCall: (name: string, role: string, peer: string) => navigate(`/call/${name}/${role}/${peer}`)
    };
};
