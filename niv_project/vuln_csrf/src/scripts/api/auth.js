import { ssw } from '../session_storage';
import { apiCalls } from './comm';

async function login(username, password) {

    const response = await apiCalls.api.post(
        `login/${username}`,
        {},
        {
            headers: {
                'Authorization': 'Basic ' + ((encodeURIComponent(username + ':' + password)))
            }
        }
    );

    const user = await apiCalls.handleNewResponse(response);

    return user

}

async function signup(username, password) {

    const response = await apiCalls.api.post(
        `signup/${username}`,
        {},
        {
            headers: {
                'Authorization': 'Create ' + ((encodeURIComponent(username + ':' + password)))
            }
        }
    );

    const user = await apiCalls.handleNewResponse(response);

    return user

}

function logout(username) {
    console.log('logout')

    if (ssw.get("username") !== null) {
        apiCalls.api.post(
            `logout/${username}`,
            {},
            apiCalls.getAuthenticationHeader()
        );
        ssw.remove('username');

    }

}



export const apiAuth = {
    login,
    logout,
    signup
}