// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     Pressable,
//     TextInput
// } from "react-native";

// import { BaseContent } from "~/components/base-screen/BaseContent";
// import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";

// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { MainParamList } from "~/navigation/MainNavigator";

// import Ionicons from "react-native-vector-icons/Ionicons";

// const ListUsersAttenCalendarScreen = () => {

//     const navigation =
//         useNavigation<NativeStackNavigationProp<MainParamList>>();

//     const [users, setUsers] = useState<any[]>([]);
//     const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
//     const [search, setSearch] = useState("");

//     /* ---------------- FETCH DATA ---------------- */

//     useEffect(() => {

//         const fetchData = async () => {

//             const now = new Date();

//             const calcDateStart = new Date(
//                 now.getFullYear(),
//                 now.getMonth(),
//                 1
//             );

//             const calcDateEnd = now;

//             const res =
//                 await attendanceCalculateRecordDepartmentApi
//                     .getUserCalendarRecordsViewDepartment({
//                         calcDateStart,
//                         calcDateEnd,
//                         paramUser: []
//                     });

//             const data = res.data.result.items;
//             setUsers(data);
//             setFilteredUsers(data);

//         };

//         fetchData();

//     }, []);

//     /* ---------------- FILTER + SEARCH ---------------- */

//     useEffect(() => {

//         let data = [...users];

//         if (search) {

//             data = data.filter(x =>
//                 (x.user?.name || x.name)
//                     ?.toLowerCase()
//                     .includes(search.toLowerCase())
//             );

//         }


//         setFilteredUsers(data);

//     }, [search, users]);

//     /* ---------------- STAT ---------------- */

//     const Stat = ({ icon, label, value, color }: any) => (

//         <View style={styles.statItem}>

//             <Ionicons name={icon} size={18} color={color} />

//             <Text style={[styles.statNumber, { color }]}>
//                 {value}
//             </Text>

//             <Text style={styles.statLabel}>
//                 {label}
//             </Text>

//         </View>

//     );

//     /* ---------------- USER CARD ---------------- */

//     const renderItem = ({ item }: any) => {

//         const name = item.user?.name || item.name;

//         const shiftName =
//             item.shiftPeriod?.shiftPeriodName ||
//             "Đầu & cuối ngày";

//         return (

//             <Pressable
//                 style={styles.card}
//                 onPress={() =>
//                     navigation.navigate("AttendanceCalendar", {
//                         userId: item.userId
//                     })
//                 }
//             >

//                 <View style={styles.header}>

//                     <View style={styles.avatar}>
//                         <Text style={styles.avatarText}>
//                             {name?.charAt(0)}
//                         </Text>
//                     </View>

//                     <View style={{ flex: 1 }}>

//                         <Text style={styles.name}>
//                             {name}
//                         </Text>

//                         <Text style={styles.shift}>
//                             {shiftName}
//                         </Text>

//                     </View>

//                     <Ionicons
//                         name="chevron-forward"
//                         size={18}
//                         color="#9ca3af"
//                     />

//                 </View>

//                 <View style={styles.divider} />

//                 <View style={styles.statsContainer}>

//                     <Stat
//                         icon="checkmark-circle"
//                         label="Đúng giờ"
//                         value={item.totalNormalDays || 0}
//                         color="#22c55e"
//                     />

//                     <Stat
//                         icon="time"
//                         label="Đi muộn"
//                         value={item.totalLateDays || 0}
//                         color="#f59e0b"
//                     />

//                     <Stat
//                         icon="exit"
//                         label="Về sớm"
//                         value={item.totalEarlyLeaveDays || 0}
//                         color="#fb923c"
//                     />

//                     <Stat
//                         icon="close-circle"
//                         label="Vắng"
//                         value={item.totalAbsentDays || 0}
//                         color="#ef4444"
//                     />

//                     <Stat
//                         icon="airplane"
//                         label="Nghỉ phép"
//                         value={item.totalHasLeaveDays || 0}
//                         color="#6366f1"
//                     />

//                 </View>

//             </Pressable>

//         );

//     };

//     /* ---------------- RENDER ---------------- */

//     return (

//         <BaseContent>
//             {/* SEARCH */}
//             <View style={styles.searchBox}>

//                 <Ionicons name="search" size={18} color="#9ca3af" />

//                 <TextInput
//                     placeholder="Tìm nhân viên..."
//                     style={styles.searchInput}
//                     value={search}
//                     onChangeText={setSearch}
//                 />

//             </View>

//             {/* LIST */}

//             <FlatList
//                 data={filteredUsers}
//                 keyExtractor={(item) => item.userId}
//                 renderItem={renderItem}
//                 contentContainerStyle={styles.list}
//                 showsVerticalScrollIndicator={false}
//             />

//         </BaseContent>

//     );

// };

// export default ListUsersAttenCalendarScreen;

// const styles = StyleSheet.create({

//     list: {
//         padding: 16
//     },

//     summary: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingHorizontal: 16,
//         marginBottom: 10
//     },

//     summaryCard: {
//         flex: 1,
//         backgroundColor: "#fff",
//         marginHorizontal: 4,
//         padding: 12,
//         borderRadius: 12,
//         alignItems: "center",
//         elevation: 2
//     },

//     summaryNumber: {
//         fontSize: 18,
//         fontWeight: "700"
//     },

//     summaryLabel: {
//         fontSize: 12,
//         color: "#64748b"
//     },

//     searchBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         marginHorizontal: 16,
//         paddingHorizontal: 12,
//         borderRadius: 10,
//         height: 40,
//         marginBottom: 10,
//         marginTop: 20
//     },

//     searchInput: {
//         flex: 1,
//         marginLeft: 8
//     },

//     filterRow: {
//         flexDirection: "row",
//         paddingHorizontal: 16,
//         marginBottom: 10
//     },

//     filterBtn: {
//         backgroundColor: "#f1f5f9",
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 8,
//         marginRight: 6
//     },

//     filterActive: {
//         backgroundColor: "#2563eb"
//     },

//     filterText: {
//         fontSize: 12
//     },

//     filterTextActive: {
//         color: "#fff"
//     },

//     card: {
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 14,
//         elevation: 3
//     },

//     header: {
//         flexDirection: "row",
//         alignItems: "center"
//     },

//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: "#2563eb",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 10
//     },

//     avatarText: {
//         color: "#fff",
//         fontWeight: "700"
//     },

//     name: {
//         fontSize: 16,
//         fontWeight: "700"
//     },

//     shift: {
//         fontSize: 12,
//         color: "#64748b"
//     },

//     divider: {
//         height: 1,
//         backgroundColor: "#f1f5f9",
//         marginVertical: 10
//     },

//     statsContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-between"
//     },

//     statItem: {
//         width: "48%",
//         backgroundColor: "#f8fafc",
//         borderRadius: 10,
//         padding: 10,
//         alignItems: "center",
//         marginBottom: 6
//     },

//     statNumber: {
//         fontSize: 16,
//         fontWeight: "700"
//     },

//     statLabel: {
//         fontSize: 11,
//         color: "#64748b"
//     }

// });

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

import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";
import { MainParamList } from "~/navigation/MainNavigator";
import { getAvatarColor, getAvatarLetter } from "~/utils/avatarColors";

const PAGE_SIZE = 10;

const ListUsersAttenCalendarScreen = () => {

    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();

    const [users, setUsers] = useState<any[]>([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [search, setSearch] = useState("");

    /* ---------------- FETCH USERS ---------------- */

    const fetchUsers = async (pageNumber = 1, keyword = "") => {

        try {

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
                        paramUser: keyword ? [keyword] : [],
                        skipCount: (pageNumber - 1) * PAGE_SIZE,
                        maxResultCount: PAGE_SIZE
                    });

            const data = res.data.result.items || [];

            if (pageNumber === 1) {

                setUsers(data);

            } else {

                setUsers(prev => [...prev, ...data]);

            }

            if (data.length < PAGE_SIZE) {
                setHasMore(false);
            }

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);

        }

    };

    /* ---------------- FIRST LOAD ---------------- */

    useEffect(() => {
        fetchUsers(1);
    }, []);

    /* ---------------- SEARCH SERVER ---------------- */

    useEffect(() => {

        const timeout = setTimeout(() => {

            setPage(1);
            setHasMore(true);

            fetchUsers(1, search);

        }, 400);

        return () => clearTimeout(timeout);

    }, [search]);

    /* ---------------- LOAD MORE ---------------- */

    const loadMore = async () => {

        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        const nextPage = page + 1;

        await fetchUsers(nextPage, search);

        setPage(nextPage);

    };

    /* ---------------- REFRESH ---------------- */

    const onRefresh = async () => {

        setRefreshing(true);
        setPage(1);
        setHasMore(true);

        await fetchUsers(1, search);

    };

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
                        label="Muộn"
                        value={item.totalLateDays || 0}
                        color="#f59e0b"
                    />

                    <Stat
                        icon="exit"
                        label="Sớm"
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
                        label="Nghỉ"
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

                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}

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

