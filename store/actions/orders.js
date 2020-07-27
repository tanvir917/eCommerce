export const ADD_ORDER = 'AND_ORDER';

//action creator
export const addOrder = (cartItems, totalAmount) => {
    return async dispatch => {
        const date = new Date();
        //send a req to store product on server
        const response = await fetch('https://ecommerce-fed7f.firebaseio.com/orders/u1.json', {
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