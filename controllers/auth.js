const { response } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        //verificar si email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg:'Usuario inexistente'
            });
        }
        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg:'Usuario inactivo'
            });
        }
        //verificar pass
        const validPass = bcryptjs.compareSync( password, usuario.password )
        if (!validPass) {
            return res.status(400).json({
                msg:'Alguno de los datos ingresados no son correctos'
            });
        }
        //generar jwt
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal'
        });
    }
}

module.exports = {
    login
}