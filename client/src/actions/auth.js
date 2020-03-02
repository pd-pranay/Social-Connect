import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './type';
import { setAlert } from './alert'
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