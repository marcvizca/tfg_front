import useAuth from './useAuth';
import { refreshToken } from '../controllers/services.controller';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await refreshToken();
        setAuth(prev => {
            const userId = localStorage.getItem ('userId');
            return { ...prev, userId: userId,  accessToken: response }
        });
        return response;
    }
    return refresh;
};

export default useRefreshToken;