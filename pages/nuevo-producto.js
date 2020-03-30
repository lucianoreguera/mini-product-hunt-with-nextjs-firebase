import { useState, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import FileUploader from 'react-firebase-file-uploader';
import { css } from '@emotion/core';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import { FirebaseContext } from '../firebase';
import Error404 from '../components/layout/404';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    // imagen: '',
    url: '',
    descripcion: ''
};

const NuevoProducto = () => {

    const [nombreimagen, guardarNombre] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlImagen] = useState('');
    
    const [error, guardarError] = useState(false);

    const { valores, errores, handleChange, handleSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
    const { nombre, empresa, imagen, url, descripcion } = valores;

    const router = useRouter();

    const { usuario, firebase } = useContext(FirebaseContext);

    async function crearProducto() {
        if (!usuario) {
            router.push('/login');
        }

        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        };

        firebase.db.collection('productos').add(producto);
        return router.push('/');
    }

    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    };

    const handleProgress = progreso => guardarProgreso(progreso);

    const handleUploadError = error => {
        guardarSubiendo(error);
        console.error(error);
    };

    const handleUploadSuccess = nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombre(nombre);
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                guardarUrlImagen(url);
            });
    };

    return (
        <Layout>
            { !usuario ? <Error404 /> : (
                <>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >Nuevo Producto</h1>
                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <fieldset>
                            <legend>Información General</legend>
                            <Campo>
                                <label htmlFor="nombre">Nombre</label>
                                <input 
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    placeholder="Nombre del producto"
                                    value={nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            { errores.nombre && <Error>{ errores.nombre }</Error> }
                            <Campo>
                                <label htmlFor="empresa">Empresa</label>
                                <input 
                                    type="text"
                                    name="empresa"
                                    id="empresa"
                                    placeholder="Nombre Empresa o Compañia"
                                    value={empresa}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            { errores.empresa && <Error>{ errores.empresa }</Error> }
                            <Campo>
                                <label htmlFor="imagen">Imagen</label>
                                <FileUploader
                                    accept="image/*"
                                    name="imagen"
                                    id="imagen"
                                    randomizeFileName
                                    storageRef={firebase.storage.ref("productos")}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress}
                                />
                            </Campo>
                            <Campo>
                                <label htmlFor="url">URL</label>
                                <input 
                                    type="url"
                                    name="url"
                                    id="url"
                                    placeholder="URL de tu producto"
                                    value={url}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            { errores.url && <Error>{ errores.url }</Error> }
                        </fieldset>

                        <fieldset>
                            <legend>Sobre tu producto</legend>
                            <Campo>
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea 
                                    name="descripcion"
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            { errores.descripcion && <Error>{ errores.descripcion }</Error> }
                        </fieldset>

                        { error && <Error>{error}</Error> }
                        <InputSubmit 
                            type="submit" 
                            value="Crear Producto"
                        />
                    </Formulario>
                </>
            ) }
            
        </Layout>
    );
}

export default NuevoProducto;