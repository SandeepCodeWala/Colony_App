import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ErrorView(props) {
    return (
        <View style={{ ...styles.container, ...props.style }}>
            {
                props.show && <Text style={styles.text}>{props.text}</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%'
    },
    text: {
        color: '#FF8488',
        fontSize: 14,
        marginLeft:20,
        fontFamily: 'Poppins-Medium'
    }
})
