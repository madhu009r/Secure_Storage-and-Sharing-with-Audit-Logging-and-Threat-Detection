// import { createContext, useContext, useState, useEffect } from 'react';
// import apiClient from '../api/axios';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {

// const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// const [user, setUser] = useState(
//   DEMO_MODE
//     ? { username: 'demo-user', role: 'ADMIN' }
//     : null
// );

//   // const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const response = await apiClient.post('/auth/login', { email, password });
//     const { token, user } = response.data;

//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);

//     return response.data;
//   };

//   const register = async (userData) => {
//     const response = await apiClient.post('/auth/register', userData);
//     const { token, user } = response.data;

//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);

//     return response.data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //const token = localStorage.getItem('token');

    console.log("Auth initializing...");
    const token = localStorage.getItem('token');
    console.log("TOKEN FROM STORAGE:", token);
    // if (token) {
    //   const decoded = jwtDecode(token);

    //   const userData = {
    //     id: decoded.sub,
    //     name: decoded.name,
    //     role: decoded.admin ? 'admin' : 'user'
    //   };

    //   setUser(userData);
    // }
    if (token) {
   const decoded = jwtDecode(token);
    console.log("DECODED:", decoded);

  const userData = {
      username: decoded.sub
    };
console.log("SETTING USER:", userData);
    setUser(userData);
}

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      username: email,
      password
    });

    const token = response.data.token;
console.log("TOKEN RECEIVED:", token);

localStorage.setItem('token', token);

console.log("TOKEN AFTER SAVE:", localStorage.getItem('token'));

    const decoded = jwtDecode(token);

        const userData = {
            username: decoded.sub
           };

    setUser(userData);
    console.log("USER STATE:", userData);
    //console.log("Current User:", userData);

    return response.data;
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};