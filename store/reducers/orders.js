import { ADD_ORDER } from "../actions/orders";
import Order from "../../models/order";
import { ADD_ORDER } from '../actions/orders';
import Order from '../../models/order';

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER:
            const newOrder = new Order(
                new Date().toString(), 
                action.orderData.items, 
                action.orderData.amount,
                new Date()
            );
            return {
                ...state,//copying old state which is redundant here
                orders: state.orders.concat(newOrder)//creating a brand new arry order
            }
    }

    return state;
}