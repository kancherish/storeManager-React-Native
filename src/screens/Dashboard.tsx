import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ListHeader from '../components/ListHeader'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createStockTable, dbCon, getStocksData } from '../backend/database'
import { addData } from '../store/stockSlice'

const Dashboard = (): React.JSX.Element => {
  const dispatch = useAppDispatch() // Move dispatch to component level
  const stockData = useAppSelector((state) => state.stockData)

  async function loadData() {
    try {
      const con = await dbCon()
      await createStockTable(con)
      const fetchedData = await getStocksData(con)
      
      // Dispatch all items at once instead of mapping
      fetchedData.forEach(item => {
        dispatch(addData(item))
      })
      
      console.log('Fetched data:', fetchedData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  useEffect(() => {
    loadData()
  }, []) // Add dispatch to dependencies if ESLint requires it

  return (
    <View style={styles.container}>
      <ListHeader />
      {stockData.length === 0 ? (
        <View>
          <Text style={{ textAlign: "center",color:"aliceblue" }}>
            NO ITEMS AVAILABLE IN STOCKS
          </Text>
        </View>
      ) : (
        <FlatList
          data={stockData}
          renderItem={({ item }) => (
            <View 
              style={[
                styles.listItem, 
                item.qty <= 5
                  ? { backgroundColor: "#D84040" } 
                  : { backgroundColor: "#809D3C" }
              ]} 
            >
              <Text style={styles.listItemText}>{item.pname}</Text>
              <Text style={styles.listItemText}>{item.qty}</Text>
            </View>
          )}
          keyExtractor={(item) => item.pid}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 5,
    gap: 3,
    backgroundColor:"#313131",
  },
  listItem: {
    width: "100%",
    paddingHorizontal: 6,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 30,
    paddingVertical: 9
  },
  listItemText: {
    color: "#FBF5DD"
  }
})