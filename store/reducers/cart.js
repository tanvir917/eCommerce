import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                //already have the item in cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                );
            } else { //add a brand new item
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);//sum in now prodPrice
            }
            return {
                ...state,//copy of our state
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            };
        case REMOVE_FROM_CART: 
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                //need to reduce it, not erase it
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1, 
                    selectedCartItem.productPrice ,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
            } else {
                updatedCartItems = { ...state.items };
                console.log(updatedCartItems);
                delete updatedCartItems[action.pid];
                console.log('====================================');
                console.log(updatedCartItems);
                console.log('====================================');
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
        case ADD_ORDER: 
            return initialState;
    }
    return state;
}