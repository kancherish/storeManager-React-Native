import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './src/screens/Dashboard';
import LowStock from './src/screens/LowStock';
import StockManagement from './src/screens/StockManagement';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import { Provider } from "react-redux"
import store from './src/store/store';
import { createStockTable, dbCon, getStocksData } from './src/backend/database';
import { useAppDispatch } from './src/store/hooks';
import { addData } from './src/store/stockSlice';

const App = (): React.JSX.Element => {

  async function loadData(){
    const con = await dbCon()
    await createStockTable(con)
    const data = await getStocksData(con);
    const dispatch = useAppDispatch()
    data.map((item)=>dispatch(addData(item)))
  }

  const Drawer = createDrawerNavigator();

  const CustomDrawerContent = (props: DrawerContentComponentProps): React.JSX.Element => {
    return (
      <View style={{ flex: 1 }}>

        <View style={styles.drawerHeader}>
          <Text style={styles.headerText}>Menu</Text>

        </View>


        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>


        <View style={styles.drawerFooter}>
          <Text style={styles.footerText}>Made By <Text style={{ color: "#577BC1", textDecorationLine: "underline" }} onPress={() => Linking.openURL("https://github.com/kancherish")}>Cherish Kansara</Text></Text>

        </View>
      </View>
    );
  };

  useEffect(() => {
    
      loadData()
    return () => {
      
    }
  }, [])
  

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
              drawerActiveTintColor: "aliceblue",
              drawerActiveBackgroundColor: "#E5D0AC",
              drawerInactiveTintColor: "aliceblue",
              drawerStyle: {
                height: "100%",
                backgroundColor:"#313131"
              },

            }}
          >

            <Drawer.Screen
              name="Dashboard"
              options={{
                drawerLabel: "Dashboard"
              }}
              component={Dashboard} />

            <Drawer.Screen
              name="Low Stock"
              options={{
                drawerLabel: "Low Stock"
              }}
              component={LowStock} />

            <Drawer.Screen
              name="Stock Mangement"
              options={{
                drawerLabel: "Stock Management"
              }}
              component={StockManagement} />



          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#313131',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'aliceblue',
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
})