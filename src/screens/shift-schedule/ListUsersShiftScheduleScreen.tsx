import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable
} from "react-native";

import { BaseContent } from "~/components/base-screen/BaseContent";
import shiftScheduleDepartmentApi from "~/api/shiftScheduleDepartment.api";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainParamList } from "~/navigation/MainNavigator";

import Ionicons from "react-native-vector-icons/Ionicons";

import { formatDateRender } from "~/utils/format/format";

const ListUsersShiftScheduleScreen = () => {

    const [users, setUsers] = useState<any[]>([]);
    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res =
                    await shiftScheduleDepartmentApi
                        .getShiftSchedulesDepartment({});

                setUsers(res.data.result.items);

            } catch (err) {
                console.log(err);
            }

        };

        fetchData();

    }, []);

    /* ---------- USER CARD ---------- */

    const renderItem = ({ item }: { item: any }) => {

        const name = item.user?.name || item.name;

        const shiftName =
            item.shift?.shiftName || "Chưa có ca";

        const start =
            formatDateRender(item.effectiveBeginDate, "dd/MM/yyyy");

        const end =
            formatDateRender(item.effectiveEndDate, "dd/MM/yyyy");

        return (

            <Pressable
                style={styles.card}
                onPress={() => {
                    navigation.navigate("ShiftSchedule", {
                        userId: item.user?.id,
                    })

                }
                }
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {name?.charAt(0)}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>

                        <Text style={styles.name}>
                            {name}
                        </Text>

                        <View style={styles.shiftBadge}>

                            <Ionicons
                                name="time-outline"
                                size={14}
                                color="#4f46e5"
                            />

                            <Text style={styles.shiftText}>
                                {shiftName}
                            </Text>

                        </View>

                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9ca3af"
                    />

                </View>

                {/* DATE RANGE */}

                <View style={styles.dateRow}>

                    <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#64748b"
                    />

                    <Text style={styles.dateText}>
                        {start} - {end}
                    </Text>

                </View>

            </Pressable>

        );

    };

    return (

        <BaseContent>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

        </BaseContent>

    );

};

export default ListUsersShiftScheduleScreen;


/* ---------- STYLES ---------- */

const styles = StyleSheet.create({

    list: {
        padding: 16
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827"
    },

    shiftBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
        backgroundColor: "#eef2ff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start"
    },

    shiftText: {
        fontSize: 12,
        color: "#4f46e5",
        fontWeight: "600"
    },

    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6
    },

    dateText: {
        marginLeft: 6,
        fontSize: 13,
        color: "#64748b"
    }

});