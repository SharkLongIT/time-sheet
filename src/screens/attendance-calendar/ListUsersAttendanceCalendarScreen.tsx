import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    TextInput
} from "react-native";

import { BaseContent } from "~/components/base-screen/BaseContent";
import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainParamList } from "~/navigation/MainNavigator";

import Ionicons from "react-native-vector-icons/Ionicons";

const ListUsersAttenCalendarScreen = () => {

    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();

    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    /* ---------------- FETCH DATA ---------------- */

    useEffect(() => {

        const fetchData = async () => {

            const now = new Date();

            const calcDateStart = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const calcDateEnd = now;

            const res =
                await attendanceCalculateRecordDepartmentApi
                    .getUserCalendarRecordsViewDepartment({
                        calcDateStart,
                        calcDateEnd,
                        paramUser: []
                    });

            const data = res.data.result.items;
            console.log(data)
            setUsers(data);
            setFilteredUsers(data);

        };

        fetchData();

    }, []);

    /* ---------------- FILTER + SEARCH ---------------- */

    useEffect(() => {

        let data = [...users];

        if (search) {

            data = data.filter(x =>
                (x.user?.name || x.name)
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );

        }

        if (filter === "late") {

            data = data.filter(x => x.totalLateDays > 0);

        }

        if (filter === "absent") {

            data = data.filter(x => x.totalAbsentDays > 0);

        }

        if (filter === "leave") {

            data = data.filter(x => x.totalHasLeaveDays > 0);

        }

        setFilteredUsers(data);

    }, [search, filter, users]);

    /* ---------------- SUMMARY ---------------- */

    const totalUsers = users.length;

    const totalLate =
        users.reduce((a, b) => a + (b.totalLateDays || 0), 0);

    const totalAbsent =
        users.reduce((a, b) => a + (b.totalAbsentDays || 0), 0);

    const totalLeave =
        users.reduce((a, b) => a + (b.totalHasLeaveDays || 0), 0);

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

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {name?.charAt(0)}
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
                        label="Vắng"
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

    /* ---------------- RENDER ---------------- */

    return (

        <BaseContent>
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

            {/* FILTER */}

            <View style={styles.filterRow}>

                {["all", "late", "absent", "leave"].map(x => (

                    <Pressable
                        key={x}
                        style={[
                            styles.filterBtn,
                            filter === x && styles.filterActive
                        ]}
                        onPress={() => setFilter(x)}
                    >

                        <Text
                            style={[
                                styles.filterText,
                                filter === x && styles.filterTextActive
                            ]}
                        >
                            {x === "all"
                                ? "Tất cả"
                                : x === "late"
                                    ? "Đi muộn"
                                    : x === "absent"
                                        ? "Vắng"
                                        : "Nghỉ phép"}
                        </Text>

                    </Pressable>

                ))}

            </View>

            {/* LIST */}

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.userId}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

        </BaseContent>

    );

};

export default ListUsersAttenCalendarScreen;

const styles = StyleSheet.create({

    list: {
        padding: 16
    },

    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 10
    },

    summaryCard: {
        flex: 1,
        backgroundColor: "#fff",
        marginHorizontal: 4,
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        elevation: 2
    },

    summaryNumber: {
        fontSize: 18,
        fontWeight: "700"
    },

    summaryLabel: {
        fontSize: 12,
        color: "#64748b"
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 40,
        marginBottom: 10,
        marginTop: 20
    },

    searchInput: {
        flex: 1,
        marginLeft: 8
    },

    filterRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 10
    },

    filterBtn: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 6
    },

    filterActive: {
        backgroundColor: "#2563eb"
    },

    filterText: {
        fontSize: 12
    },

    filterTextActive: {
        color: "#fff"
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        elevation: 3
    },

    header: {
        flexDirection: "row",
        alignItems: "center"
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700"
    },

    name: {
        fontSize: 16,
        fontWeight: "700"
    },

    shift: {
        fontSize: 12,
        color: "#64748b"
    },

    divider: {
        height: 1,
        backgroundColor: "#f1f5f9",
        marginVertical: 10
    },

    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },

    statItem: {
        width: "48%",
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        marginBottom: 6
    },

    statNumber: {
        fontSize: 16,
        fontWeight: "700"
    },

    statLabel: {
        fontSize: 11,
        color: "#64748b"
    }

});