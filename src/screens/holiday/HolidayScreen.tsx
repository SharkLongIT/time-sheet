import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from "react-native";

import { BaseContent } from "~/components/base-screen/BaseContent";
import SearchBar from "~/components/search/SearchBar";
import { useAppColors } from "~/hooks/useAppColors";
import holidayApi from "~/api/holiday.api";
import { Holiday } from "~/interface/holiday";

import { PAGE_SIZE } from "~/utils/common";
import { addDays, formatDateRender } from "~/utils/format/format";

import Ionicons from "react-native-vector-icons/Ionicons";
import { alertError } from "~/utils/alertMessageServer";

const HolidayScreen = () => {

    const colors = useAppColors();

    const [items, setItems] = useState<Holiday[]>([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchData = useCallback(async (pageIndex = 0, append = false) => {
        try {
            const res = await holidayApi.getHolidaySettings({
                skipCount: pageIndex * PAGE_SIZE,
                maxResultCount: PAGE_SIZE
            });

            const result = res.data.result;

            setItems(prev =>
                append ? [...prev, ...result.items] : result.items
            );

            setTotalCount(result.totalCount);
        } catch (error) {
            alertError(error)
        }


    }, []);

    useEffect(() => {

        const init = async () => {
            await fetchData(0);
            setLoading(false);
        };

        init();

    }, []);

    const filteredData = useMemo(() => {

        if (!search) return items;

        const keyword = search.toLowerCase();

        return items.filter(item =>
            item.title?.toLowerCase().includes(keyword)
        );

    }, [items, search]);

    const onRefresh = async () => {

        setRefreshing(true);

        setPage(0);

        await fetchData(0);

        setRefreshing(false);

    };

    const loadMore = async () => {

        if (loadingMore) return;

        if (items.length >= totalCount) return;

        const nextPage = page + 1;

        setLoadingMore(true);

        setPage(nextPage);

        await fetchData(nextPage, true);

        setLoadingMore(false);

    };

    const renderItem = useCallback(({ item }: { item: Holiday }) => {

        const endDate =
            item.numberOfDays > 1
                ? addDays(item.startTime, item.numberOfDays - 1)
                : null;

        return (

            <View style={[styles.card, { backgroundColor: colors.card }]}>

                <View style={styles.row}>

                    <View style={styles.iconBox}>
                        <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                    </View>

                    <View style={{ flex: 1 }}>

                        <Text style={[styles.title, { color: colors.text }]}>
                            {item.title}
                        </Text>

                        <Text style={styles.date}>
                            {endDate
                                ? `${formatDateRender(item.startTime, "dd/MM")} - ${formatDateRender(
                                    endDate,
                                    "dd/MM/yyyy"
                                )}`
                                : formatDateRender(item.startTime, "dd/MM/yyyy")}
                        </Text>

                    </View>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {item.numberOfDays} ngày
                        </Text>
                    </View>

                </View>

            </View>

        );

    }, [colors]);

    const renderHeader = () => (

        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>

            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Tìm kỳ nghỉ..."
            />

        </View>

    );

    const renderFooter = () => {

        if (!loadingMore) return null;

        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator />
            </View>
        );

    };

    if (loading) {
        return (
            <BaseContent>
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            </BaseContent>
        );
    }

    return (

        <BaseContent>

            <FlatList
                data={filteredData}

                keyExtractor={(item) => item.id.toString()}

                renderItem={renderItem}

                ListHeaderComponent={renderHeader}

                stickyHeaderIndices={[0]}

                contentContainerStyle={styles.list}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }

                onEndReached={loadMore}
                onEndReachedThreshold={0.3}

                ListFooterComponent={renderFooter}

                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="calendar-outline" size={40} color="#94a3b8" />
                        <Text style={styles.emptyText}>
                            Không có kỳ nghỉ
                        </Text>
                    </View>
                }

            />

        </BaseContent>

    );

};

export default HolidayScreen;

const styles = StyleSheet.create({

    searchContainer: {
        padding: 14,
        paddingHorizontal: 0,
        paddingBottom: 10
    },

    list: {
        paddingHorizontal: 14,
        paddingBottom: 30
    },

    card: {
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },

        elevation: 2
    },

    row: {
        flexDirection: "row",
        alignItems: "center"
    },

    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    title: {
        fontSize: 16,
        fontWeight: "600"
    },

    date: {
        marginTop: 3,
        fontSize: 13,
        color: "#64748B"
    },

    badge: {
        backgroundColor: "#DCFCE7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },

    badgeText: {
        color: "#16A34A",
        fontSize: 12,
        fontWeight: "600"
    },

    empty: {
        alignItems: "center",
        marginTop: 80
    },

    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: "#94a3b8"
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }

});