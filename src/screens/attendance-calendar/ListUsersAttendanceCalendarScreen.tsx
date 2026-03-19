import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Pressable,
    ActivityIndicator,
    RefreshControl
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainParamList } from "~/navigation/MainNavigator";
import { getAvatarColor, getAvatarLetter } from "~/utils/avatarColors";
import { useListUserAttendanceCalender } from "~/hooks/useListUserAttendanceCalendar";

const ListUsersAttenCalendarScreen = () => {

    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();
    const {
        users,
        loading,
        loadingMore,
        refreshing,
        // hasMore,
        search,
        setSearch,
        loadMore,
        onRefresh,
        onEndReachedCalledDuringMomentum,
    } = useListUserAttendanceCalender();

    /* ---------------- STAT ---------------- */

    const Stat = ({ icon, label, value, color }: any) => (

        <View style={styles.statItem}>

            <Ionicons name={icon} size={18} color={color} />

            <Text style={[styles.statNumber, { color }]}>
                {value}
            </Text>

            <Text style={styles.statLabel}>
                {label}
            </Text>

        </View>

    );

    /* ---------------- USER CARD ---------------- */

    const renderItem = ({ item }: any) => {

        const name = item.user?.name || item.name;

        const shiftName =
            item.shiftPeriod?.shiftPeriodName ||
            "Đầu & cuối ngày";

        // const avatarColor =
        //     avatarColors[name?.charCodeAt(0) % avatarColors.length];

        return (

            <Pressable
                style={styles.card}
                onPress={() =>
                    navigation.navigate("AttendanceCalendar", {
                        userId: item.userId
                    })
                }
            >

                <View style={styles.header}>

                    <View
                        style={[
                            styles.avatar,
                            { backgroundColor: getAvatarColor(name) }
                        ]}
                    >
                        <Text style={styles.avatarText}>
                            {getAvatarLetter(name)}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>

                        <Text style={styles.name}>
                            {name}
                        </Text>

                        <Text style={styles.shift}>
                            {shiftName}
                        </Text>

                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#9ca3af"
                    />

                </View>

                <View style={styles.divider} />

                <View style={styles.statsContainer}>

                    <Stat
                        icon="checkmark-circle"
                        label="Đúng giờ"
                        value={item.totalNormalDays || 0}
                        color="#22c55e"
                    />

                    <Stat
                        icon="time"
                        label="Đi muộn"
                        value={item.totalLateDays || 0}
                        color="#f59e0b"
                    />

                    <Stat
                        icon="exit"
                        label="Về sớm"
                        value={item.totalEarlyLeaveDays || 0}
                        color="#fb923c"
                    />

                    <Stat
                        icon="close-circle"
                        label="Vắng mặt"
                        value={item.totalAbsentDays || 0}
                        color="#ef4444"
                    />

                    <Stat
                        icon="airplane"
                        label="Nghỉ phép"
                        value={item.totalHasLeaveDays || 0}
                        color="#6366f1"
                    />

                </View>

            </Pressable>

        );

    };

    /* ---------------- SKELETON ---------------- */

    const Skeleton = () => (

        <View style={styles.card}>
            <View style={{ height: 20, backgroundColor: "#e5e7eb", borderRadius: 6, marginBottom: 10 }} />
            <View style={{ height: 14, backgroundColor: "#e5e7eb", borderRadius: 6, width: "60%" }} />
        </View>

    );

    /* ---------------- RENDER ---------------- */

    return (

        <View style={{ flex: 1 }}>

            {/* SEARCH */}

            <View style={styles.searchBox}>

                <Ionicons name="search" size={18} color="#9ca3af" />

                <TextInput
                    placeholder="Tìm nhân viên..."
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                />

            </View>

            {loading ? (

                <FlatList
                    data={[1, 2, 3, 4]}
                    renderItem={() => <Skeleton />}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={{ padding: 16 }}
                />

            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.userId?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }

                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum.current = false;
                    }}

                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum.current) {
                            loadMore();
                            onEndReachedCalledDuringMomentum.current = true;
                        }
                    }}

                    onEndReachedThreshold={0.3}

                    ListFooterComponent={
                        loadingMore
                            ? <ActivityIndicator style={{ marginVertical: 20 }} />
                            : null
                    }
                />

            )}

        </View>

    );

};

export default ListUsersAttenCalendarScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 42
    },

    searchInput: {
        flex: 1,
        marginLeft: 8
    },

    list: {
        paddingHorizontal: 16,
        paddingBottom: 40
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12
    },

    header: {
        flexDirection: "row",
        alignItems: "center"
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827"
    },

    shift: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2
    },

    divider: {
        height: 1,
        backgroundColor: "#f1f5f9",
        marginVertical: 10
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    statItem: {
        alignItems: "center",
        flex: 1
    },

    statNumber: {
        fontWeight: "700",
        marginTop: 2
    },

    statLabel: {
        fontSize: 10,
        color: "#64748b"
    }

});

