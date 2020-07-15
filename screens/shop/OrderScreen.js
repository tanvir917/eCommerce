import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux'; 
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

const OrdersScreen = props => {
    //state.orders is a state which is defined in app.js points to ordersReducer, 2nd order is initial state
    const orders = useSelector(state => state.orders.orders);

    return (
        <FlatList
            data={orders} 
            keyExtractor={item => item.id} 
            renderItem={itemData => <OrderItem 
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}  
                items={itemData.item.items}
            />} 
        />
    );
};

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item  
                    title='Menu' 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} 
                    onPress= {() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    };
    
}

export default OrdersScreen;