// src/features/Auth/LoginPage.jsx
import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;