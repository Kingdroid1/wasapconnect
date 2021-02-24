import express from 'express';
import cors from 'cors';
import passport from 'passport';
import db_connection from './src/config/dbconnection.js';
import dotenv from 'dotenv';
import { secrets } from './src/config/secrets.js';
import buffer, { Buffer } from 'buffer'
import axios from 'axios';
import https from 'https'
import fetch from 'node-fetch';
//import { AuthRoutes as api } from './src/routes.index.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());

app.on('error', (err) => {
    console.error(`Express server error ${err}`);
});

const PORT = secrets.PORT;
app.listen(PORT, () => {
    console.info(`magic happens here on port ${PORT}`);
    db_connection();
});

//API route
//app.use('/api', api);
let baseURL = '//etzwhatsappconnekt.herokuapp.com'
let whatsappLogin = '/v1/users/login'
//server default response
app.post('/', async (req, res) => {

    //req objs
    let username = req.body.username.toString();
    let pwd = req.body.password.toString();
    let user = {
        username: buffer.Buffer.from(username).toString('base64'),
        password: buffer.Buffer.from(pwd).toString('base64')
    }
    console.log('req.body', username, pwd);
    let auth = buffer.Buffer.from(`${user.username}:${user.password}`).toString('base64')
    let header = {
        Authorization: `Basic ${auth}`
    }
    let reqOptions = {
        'protocol': 'https:',
        'hostname': baseURL,
        'method': 'POST',
        'path': whatsappLogin,
        'auth': user,
        'headers': {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        }
    }
    //send login payload#
    // https.request(reqOptions, (httpRes) => {
    //     console.log('WAB', httpRes);
    //     let status = httpRes.statusCode;
    //     console.log('theStatus', status)
    //     return res.send(httpRes)
    // });
    // req.on('error', function (e) {
    //     res.send(e);
    // });

    // console.log('the call', apiCall)
    //fetch api
    // try {
    //     const response = await fetch(reqOptions.protocol+reqOptions.hostname+reqOptions.path, {
    //         method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //         mode: 'cors', // no-cors, *cors, same-origin
    //         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: 'same-origin', // include, *same-origin, omit
    //         headers: reqOptions.headers,
    //         redirect: 'follow', // manual, *follow, error
    //         referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify(user) // body data type must match "Content-Type" header
    //       });
    //      return response.json();
    // } catch (error) {
    //     res.send(error)
    // }
    
    axios.post(reqOptions.protocol+reqOptions.hostname+reqOptions.path, reqOptions.auth, reqOptions.headers).then((apiRes) => {
       console.log('blaaa', apiRes.data.token)
        return res.send(apiRes.data.token)
    }).catch((e) => {
        console.log('errrrr', e.message);
        return res.send(e)
    })
})

export { app as server };