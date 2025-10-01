import api from './axiosConfig';

/**
 * Login con Basic Auth (GET /login)
 */
export const login = async (identifier, password) => {
    try {
        const credentialsBase64 = btoa(`${identifier}:${password}`);

        const response = await api.get('/login', {
            headers: {
                'Authorization': `Basic ${credentialsBase64}`,
            },
        });

        console.log("Login response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Registro de usuario (POST /register)
 * IMPORTANTE: El backend espera 'username' (DNI), no 'dni'
 */
export const register = async (userData) => {
    try {
        // Mapear campos del frontend al backend
        const backendUserData = {
            fullName: userData.name,        // 'name' en frontend → 'fullName' en backend
            username: userData.dni,         // 'dni' en frontend → 'username' en backend  
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            confirmPassword: userData.confirmPassword
        };

        console.log("Enviando registro al backend:", backendUserData);

        const response = await api.post('/register', backendUserData);
        console.log("Register response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error);

        // Mejorar mensajes de error
        if (error.response?.status === 409) {
            throw new Error("El usuario con este DNI ya existe");
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data || "Datos de registro inválidos");
        } else {
            throw new Error("Error del servidor: " + (error.response?.data || error.message));
        }
    }
};

/**
 * Logout (POST /logout)
 */
export const logout = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};