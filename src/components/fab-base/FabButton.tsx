import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const FabButton = ({
    onpress
}: {
    onpress: (data: any) => void,
}) => {

    return (

        <TouchableOpacity
            style={styles.fab}
            onPress={onpress}
        >
            <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 80,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#6366F1",
        alignItems: "center",
        justifyContent: "center",
        elevation: 4
    },
})