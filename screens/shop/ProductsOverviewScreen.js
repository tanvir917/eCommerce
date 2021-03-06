import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
//import SearchBar from 'react-native-search-bar';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsAction from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [value, setValue] = useState();
    
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const [arrayholder, setArrayholder] = useState(products);
    const dispatch = useDispatch();
    
    const productF = products;
    // console.log(arrayholder);
    // const arr = productF.filter(item => {
    //     const itemData = item.title.toUpperCase();
    //     console.log('title: ', itemData);
    //     return itemData;
    // });
    // setArrayholder(arr);
    // console.log('arr: ',arr);


    const loadProducts = useCallback(async () => {
        console.log('Load Products');
        setError(null);
        setIsRefreshing(true);
        //setIsLoading(true);
        try {
            await dispatch(productsAction.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
        //setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

        return () => {
            willFocusSub.remove();
        }
    }, [loadProducts]);

    //initially takes effects
    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', { 
            productId: id ,
            productTitle: title
        });
    };

    const searchFilterFunction = text => {
        // setState({
        //   value: text,
        // });
        setValue(text);
    
        const newData = productF.filter(item => {
          const itemData = item.title.toUpperCase();
          const textData = text.toUpperCase();
    
          return itemData.indexOf(textData) > -1;
        });
        // setState({
        //   data: newData,
        // });
        //arrayholder = newData;
        setArrayholder(newData);
        // console.log('arrayholder:');
        // console.log(arrayholder);
      };

    // const renderHeader = () => {
    //     return (
    //       <SearchBar
    //         focus
    //         placeholder="Type Here..."
    //         lightTheme
    //         round
    //         onChangeText={text => searchFilterFunction(text)}
    //         //onSearchButtonPress={text => searchFilterFunction(text)}
    //         autoCorrect={false}
    //         value={value}
    //       />
    //     );
    //   };

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

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe start adding some!</Text>
            </View>
        )
    }

    
    return (
        <View style={{flex: 1}}>
            <SearchBar
                focus
                placeholder="Type Here..."
                lightTheme
                round
                onChangeText={text => searchFilterFunction(text)}
                //onSearchButtonPress={text => searchFilterFunction(text)}
                autoCorrect={false}
                value={value}
            />
            <FlatList 
                onRefresh={loadProducts}
                refreshing={isRefreshing}
                //arrayholder.length === 0 ? products: 
                data={arrayholder.length === 0 ? products : arrayholder} 
                keyExtractor={item => item.id} 
                renderItem={itemData => <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}  
                >
                <Button 
                    color={Colors.primary} 
                    title="View Details" 
                    onPress={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}    
                />
                <Button 
                    color={Colors.primary} 
                    title="To Cart" 
                    onPress={() => {
                        dispatch(cartActions.addToCart(itemData.item));
                    }}     
                />
                </ProductItem>
                } 
                //ListHeaderComponent={renderHeader}
            />
            
        </View>
    );
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
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
                    title='Cart' 
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
                    onPress= {() => {
                        navData.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>)
    }
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen;