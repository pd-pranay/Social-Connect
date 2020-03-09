import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, AUTH_ERROR, USER_LOADED, LOGIN_SUCCESS, LOGIN_FAIL } from './type';
import { setAlert } from './alert';

import setAuthToken from '../utils/setAuthToken';

// load user 
// refreshing of token/
// load token form storage  and send to server for check
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        console.log(res);
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// register

export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ name, email, password });
    try {
        let res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data.data
        });
        dispatch(loadUser());

        console.log(res);
    } catch (error) {
        console.log(error.message)
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(element => dispatch(setAlert(element.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
}
// login

export const login = (email, password) => async dispatch => {
    console.log('func actions')
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ email, password });
    try {
        let res = await axios.post('/api/auth', body, config);
        console.log('hit send')
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data.data
        });
        dispatch(loadUser());
        console.log(res);
    } catch (error) {
        console.log(error.message)
        const errors = error.response.data;
        console.log("errors", errors);
        // if (errors) {
        //     errors.forEach(element => dispatch(setAlert(element.msg, 'danger')));
        // }
        dispatch({
            type: LOGIN_FAIL
        });
    }
}