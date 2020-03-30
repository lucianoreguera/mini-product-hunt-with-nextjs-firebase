import { useState } from 'react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { css } from '@emotion/core';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import firebase from '../firebase';

const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
};

const CrearCuenta = () => {

    const [error, guardarError] = useState(false);

    const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
    const { nombre, email, password } = valores;

    async function crearCuenta() {
        try {
            await firebase.registrar(nombre, email, password);
            Router.push('/');
        } catch (error) {
           console.error('Hubo un error al crear el usuario', error.message);
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
                >Crear Cuenta</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input 
                            type="text"
                            name="nombre"
                            id="nombre"
                            placeholder="Ingresa tu nombre"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    { errores.nombre && <Error>{ errores.nombre }</Error> }
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
                        value="Crear Cuenta"
                    />
                </Formulario>
            </>
        </Layout>
    );
};

export default CrearCuenta;