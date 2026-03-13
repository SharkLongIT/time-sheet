import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder }: Props) => {

    return (

        <View style={styles.container}>

            <Ionicons name="search" size={18} color="#64748b" />

            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder || "Tìm kiếm..."}
                style={styles.input}
                placeholderTextColor="#94a3b8"
            />

        </View>

    );

};

export default SearchBar;

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 12
    },

    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#111827"
    }

});