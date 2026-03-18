import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    TextInput,
    RefreshControl,
    ActivityIndicator
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";

import { BaseContent } from "~/components/base-screen/BaseContent";
import shiftScheduleDepartmentApi from "~/api/shiftScheduleDepartment.api";
import { MainParamList } from "~/navigation/MainNavigator";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { formatDateRender } from "~/utils/format/format";
import { getAvatarColor, getAvatarLetter } from "~/utils/avatarColors";
import { alertError } from "~/utils/alertMessageServer";

const PAGE_SIZE = 10;

const ListUsersShiftScheduleScreen = () => {

    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();

    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [hasMore, setHasMore] = useState(true);

    const onEndReachedCalledDuringMomentum = useRef(false);

    /* ---------------- FETCH DATA ---------------- */

    const fetchData = async (pageNumber = 1) => {

        try {

            const res =
                await shiftScheduleDepartmentApi
                    .getShiftSchedulesDepartment({
                        skipCount: (pageNumber - 1) * PAGE_SIZE,
                        maxResultCount: PAGE_SIZE
                    });

            const data = res?.data?.result?.items || [];

            if (pageNumber === 1) {

                setAllUsers(data);
                setUsers(data);

            } else {

                setAllUsers(prev => [...prev, ...data]);
                setUsers(prev => [...prev, ...data]);

            }

            if (data.length < PAGE_SIZE) {
                setHasMore(false);
            }

        } catch (err) {

            alertError(err);

        } finally {

            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);

        }

    };

    useEffect(() => {
        fetchData(1);
    }, []);

    /* ---------------- SEARCH LOCAL ---------------- */

    useEffect(() => {

        if (!search) {

            setUsers(allUsers);
            return;

        }

        const keyword = search.toLowerCase();

        const filtered = allUsers.filter(item => {

            const name =
                (item.user?.name || item.name || "")
                    .toLowerCase();

            return name.includes(keyword);

        });

        setUsers(filtered);

    }, [search, allUsers]);

    /* ---------------- LOAD MORE ---------------- */

    const loadMore = async () => {

        if (loadingMore || !hasMore || search) return;

        const nextPage = page + 1;

        setLoadingMore(true);

        await fetchData(nextPage);

        setPage(nextPage);

    };

    /* ---------------- REFRESH ---------------- */

    const onRefresh = async () => {

        setRefreshing(true);

        setPage(1);
        setHasMore(true);

        await fetchData(1);

    };

    /* ---------------- RENDER ITEM ---------------- */

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

                    const startDate =
                        dayjs(item.effectiveBeginDate)
                            .format("YYYY-MM-DD");

                    navigation.navigate("ShiftScheduleDepartment", {
                        userId: item.user?.id,
                        start: startDate
                    });

                }}
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

    /* ---------------- SKELETON ---------------- */

    const Skeleton = () => (

        <View style={styles.card}>

            <View
                style={{
                    height: 20,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 6,
                    marginBottom: 10
                }}
            />

            <View
                style={{
                    height: 14,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 6,
                    width: "60%"
                }}
            />

        </View>

    );

    /* ---------------- UI ---------------- */

    return (

        <BaseContent>

            <View style={styles.searchBox}>

                <Ionicons
                    name="search"
                    size={18}
                    color="#9ca3af"
                />

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
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}

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

        </BaseContent>

    );

};

export default ListUsersShiftScheduleScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

    list: {
        padding: 16,
        paddingTop: 0
    },

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