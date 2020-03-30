import { useState } from 'react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/core';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';
import firebase from '../firebase';

const STATE_INICIAL = {
    email: '',
    password: ''
};

const Login = () => {

    const [error, guardarError] = useState(false);

    const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
    const { nombre, email, password } = valores;

    async function iniciarSesion() {
        try {
            await firebase.login(email, password);
            Router.push('/');
        } catch (error) {
            console.log('Hubo un error al iniciar sesión', error.message);
            guardarError(error.message);
        }
    }

    return (
        <Layout>
            <>
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                >Iniciar Sesión</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Ingresa tu email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    { errores.email && <Error>{ errores.email }</Error> }
                    <Campo>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Ingresa tu password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    { errores.password && <Error>{ errores.password }</Error> }
                    { error && <Error>{error}</Error> }
                    <InputSubmit 
                        type="submit" 
                        value="Iniciar Sesión"
                    />
                </Formulario>
            </>
        </Layout>
    );
};

export default Login;