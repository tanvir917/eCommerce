import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token
    }
}

export const signup = (email, password) => {
    return async dispatch => {
        try {
            const response = await fetch(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAPNzsTfArr1GyL-g3hIDT5hEsIPsh8T7k', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        returnSecureToken: true
                    })
                }
            );
    
            if (!response.ok) {
                //throw new Error('Something went wrong 1!');
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong!';

                if (errorId === 'EMAIL_EXISTS') {
                    message = 'This email exists already!';
                }
                throw new Error(message);
            }
    
    
            const resData = await response.json();
            console.log(resData);
    
            //dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
            dispatch(authenticate(resData.localId, resData.idToken));
            const expirationDate = new Date(
                new Date().getTime() +  parseInt(resData.expiresIn) * 1000
            );
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
        } catch (err) {
            //console.log('printing error: ');
            console.log(err);
            //console.log('finishing error');
            throw err;
        }
    }
}

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await fetch(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAPNzsTfArr1GyL-g3hIDT5hEsIPsh8T7k', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        returnSecureToken: true
                    })
                }
            );
    
            if (!response.ok) {
                //throw new Error('Something went wrong 1!');
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong!';

                if (errorId === 'EMAIL_NOT_FOUND') {
                    message = 'This email could not be found!';
                } else if (errorId === 'INVALID_PASSWORD') {
                    message = 'Password is not valid!';
                }
                throw new Error(message);
            }
    
            const resData = await response.json();
            console.log(resData);
            dispatch(authenticate(resData.localId, resData.idToken));
            const expirationDate = new Date(
                new Date().getTime() +  parseInt(resData.expiresIn) * 1000
            );
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
        } catch (err) {
            //console.log('printing error: ');
            console.log(err);
            //console.log('finishing error');
            throw err;
        }
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
} 

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData', //key to retrive data later
        JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString()
        })
    )
}