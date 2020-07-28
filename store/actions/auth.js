export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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
                throw new Error('Something went wrong 1!');
            }
    
            const resData = await response.json();
            console.log(resData);
    
            dispatch({ type: SIGNUP });
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
                throw new Error('Something went wrong 1!');
            }
    
            const resData = await response.json();
            console.log(resData);
            dispatch({ type: LOGIN });
        } catch (err) {
            //console.log('printing error: ');
            console.log(err);
            //console.log('finishing error');
            throw err;
        }
    }
}