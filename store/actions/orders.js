import Order from '../../models/order';

export const ADD_ORDER = 'AND_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://ecommerce-fed7f.firebaseio.com/orders/${userId}.json`) ;

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(
                    new Order(
                        key, 
                        resData[key].cartItems, 
                        resData[key].totalAmount, 
                        new Date(resData[key].date)
                    )
                );
            }

            dispatch({ type: SET_ORDERS, orders: loadedOrders });//dispatching an ation
        } catch (err) {
            throw err;
        }
    }
};

//action creator
export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;

        const date = new Date();
        //send a req to store product on server
        const response = await fetch(`https://ecommerce-fed7f.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        dispatch ({
            type: ADD_ORDER, 
            orderData: { 
                id: resData.name, 
                items: cartItems, 
                amount: totalAmount, 
                date: date 
            }
        });
    }
};