import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Platform, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';

const UserProductsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const userProducts = useSelector(state => state.products.userProducts);
    console.log('Showing user products: ',userProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        console.log('Load Products');
        setError(null);
        setIsRefreshing(true);
        //setIsLoading(true);
        try {
            await dispatch(productActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
        //setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', { productId: id})
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', 
                onPress: () => {
                    dispatch(productActions.deleteProduct(id));
                } 
            }
        ]);
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button 
                    title="Try again" 
                    onPress={loadProducts} 
                    color={Colors.primary} 
                />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    if (!isLoading && userProducts.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No user products found, maybe start creating some?</Text>
            </View>
        )
    }
    
    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData => <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => {
                    editProductHandler(itemData.item.id)
                }}
            >
            <Button 
                color={Colors.primary} 
                title="Edit" 
                onPress={() => {
                    editProductHandler(itemData.item.id);
                }}    
            />
            <Button 
                color={Colors.primary} 
                title="Delete" 
                onPress={(deleteHandler.bind(this, itemData.item.id))}     
            />
            </ProductItem>
        }
        />
    )
};

UserProductsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Products',
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
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item  
                    title='Add' 
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'} 
                    onPress= {() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default UserProductsScreen;