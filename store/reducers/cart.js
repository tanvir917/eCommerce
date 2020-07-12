import { ADD_TO_CART } from "../actions/cart";
import CartItem from '../../models/cart-item';
import { add } from "react-native-reanimated";

const initialState = {
    items: { },
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
    }
    return state;
}