import React, { useLayoutEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Platform, Pressable } from "react-native";
import { WebView } from "react-native-webview";
import { RouteProp, useRoute } from "@react-navigation/native";
import apiClient from "~/api/apiClient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { buildUrl } from "~/helper/url.helper";
import { MainParamList } from "~/navigation/MainNavigator";
import { useHeaderTitle } from "~/hooks/useHeaderTitle";

type ViewFileRouteProp = RouteProp<MainParamList, "ViewFile">;

const ViewFile = () => {
    const route = useRoute<ViewFileRouteProp>();
    const { title, filepath, type } = route.params;
    const navigation = useNavigation();
    const webViewRef = useRef<WebView>(null);
    const url = buildUrl(`/Mobile/LeaveRequest/ViewFile?filepath=${filepath}&type=${type}`);

    const handleBack = () => {

        route.params?.reopenModal?.();

        navigation.goBack();
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable onPress={handleBack}>
                    <Ionicons name="arrow-back" size={22} />
                </Pressable>
            )
        });
    }, []);
    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={[styles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={28} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle]} numberOfLines={1}>{title}</Text>
            </View> */}

            {/* WebView */}
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator
                        size="large"
                        color="#4F46E5"
                        style={styles.loader}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#fff",
        paddingTop: Platform.OS === "ios" ? 50 : 0
    },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    headerTitle: { fontSize: 18, fontWeight: "700", marginLeft: 12 },
});

export default ViewFile;