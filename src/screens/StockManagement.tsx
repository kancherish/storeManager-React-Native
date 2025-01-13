import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList, Pressable } from 'react-native-gesture-handler'
import Icon from '@react-native-vector-icons/fontawesome'
import { dbCon, deleteStock, getStocksData, saveStocks, Stocks } from '../backend/database'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addData as addToState, removeData, updateData } from '../store/stockSlice'

const StockManagement = (): React.JSX.Element => {

  const [productName, setProductName] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId,setEditId] = useState<string>("");
  const data = useAppSelector((state) => state.stockData);

  const dispatch = useAppDispatch()


  async function addData(_pid?:string): Promise<void> {
    const qty = Number(productQuantity)
    if (productName === "" || qty < 0) {
      Alert.alert("Product Name or Quantity is not proper")
      return
    }
    const con = await dbCon()
    const data = await getStocksData(con)

    let newEntry: Stocks;

    if (isEdit && _pid) {
         newEntry = {pid: _pid, pname: productName, qty: qty}
    }else{
      newEntry = { pid: Date.now().toString(), pname: productName, qty: qty }
    }


    await saveStocks(con, [...data, newEntry])

    if (isEdit) {
      dispatch(updateData(newEntry))
    }else{
      dispatch(addToState(newEntry))
    }

    setProductName("")
    setProductQuantity("")
    Alert.alert(`${isEdit?"update":"added"} succesfully`)
    if(isEdit) setIsEdit(false)
  }

  async function deleteData(id: string): Promise<void> {
    const con = await dbCon()
    await deleteStock(con, id)
    dispatch(removeData(id))
  }

  function editData(id:string,name: string, qty: number): void {
      setProductName(name);
      let _qty=qty.toString()
      setProductQuantity(_qty);
      setEditId(id)
      setIsEdit(true)
  }


  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading1}>{isEdit ? "EDIT" : "ADD"} ITEM IN STOCK</Text>
        <View style={styles.form}>
          <TextInput
            placeholder='Enter Product Name'
            style={styles.userInput}
            value={productName}
            onChangeText={setProductName}
          />

          <TextInput
            placeholder='Enter Quantity'
            keyboardType='numeric'
            style={styles.userInput}
            value={productQuantity}
            onChangeText={setProductQuantity}
          />

          <TouchableOpacity
            onPress={()=>isEdit?addData(editId):addData()}
          >
            <Text style={styles.button1}>
              {isEdit ? "EDIT" : "ADD"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading1}>
          Existing Items
        </Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={[styles.listItem, item.qty <= 50 ? { backgroundColor: "#D84040" } : { backgroundColor: "#809D3C" }]}>
              <Text style={styles.listItemText}>{item.pname}</Text>
              <Text style={styles.listItemText}>{item.qty}</Text>
              <View style={styles.itemManage}>
                <Pressable
                  onPress={() => {editData(item.pid,item.pname,item.qty)}}
                >
                  <Text>
                    <Icon
                      name='edit'
                      size={25}
                      color={"aliceblue"}
                    />
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => { deleteData(item.pid) }}
                >
                  <Text>
                    <Icon
                      name='remove'
                      size={25}
                      color={"aliceblue"}
                    />
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.pid}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>

    </View >
  )
}

export default StockManagement

const styles = StyleSheet.create({
  container: {
    padding: "3%",
    gap: "8%",
    backgroundColor:"#313131",
    height:"100%",
    width:"100%"
  },
  section: {
    gap: 10
  },
  heading1: {
    fontSize: 20,
    fontWeight: 800,
    color:"aliceblue"
  },
  form: {
    gap: 5
  },
  userInput: {
    borderWidth: 1,
    borderRadius: 13,
    color:"#313131"
  },
  button1: {
    width: "100%",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#A6CDC6",
    color: "#16404D",
    borderRadius: 20
  },
  listItem: {
    width: "100%",
    paddingHorizontal: 6,
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 30,
    paddingVertical: 9,
    alignItems: "center"
  },
  listItemText: {
    color: "#FBF5DD"
  },
  itemManage: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 2,
    alignItems: "baseline"
  }
})