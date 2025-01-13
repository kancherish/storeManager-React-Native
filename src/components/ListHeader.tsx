import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ListHeader = () => {
    return (
        <View style={styles.listHeading}>
            <Text style={styles.listHeadingText}>Item Name</Text>
            <Text style={styles.listHeadingText}>Item Quantity</Text>
        </View>
    )
}

export default ListHeader

const styles = StyleSheet.create({
    listHeading: {
        width: "100%",
        padding: 2,
        justifyContent: "space-between",
        flexDirection: "row",
    },
    listHeadingText: {
        fontSize: 18,
        fontWeight: 900,
        color:"aliceblue"
    }
    ,
})