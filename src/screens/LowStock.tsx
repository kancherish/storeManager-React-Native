import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react'
import ListHeader from '../components/ListHeader'
import { useAppSelector } from '../store/hooks';

const LowStock = (): React.JSX.Element => {

   const data = useAppSelector((state)=>state.stockData)

  const LowData = data.filter((item) => item.qty <= 5)

  return (
    <View style={styles.container}>
      <ListHeader />
      {data.length === 0 ? (
        <View>
          <Text style={{ textAlign: "center" , color:"aliceblue"}}>
            NO ITEMS AVAIALBLE IN STOCKS
          </Text>
        </View>
      ) : (
        <FlatList
          data={LowData}
          renderItem={({ item }) => {
            return (<View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.pname}</Text>
              <Text style={styles.listItemText}>{item.qty}</Text>
            </View>)
          }}
          keyExtractor={(item) => item.pid}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

    </View>
  )
}

export default LowStock

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 5,
    gap: 3,
    backgroundColor:"#313131"
  },
  listItem: {
    width: "100%",
    paddingHorizontal: 6,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 30,
    paddingVertical: 9,
    backgroundColor: "#D84040"
    },
  listItemText: {
    color: "aliceblue"
  }
})