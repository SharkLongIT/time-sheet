import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import holidayApi from "~/api/holiday.api";
import { BaseContent } from "~/components/base-screen/BaseContent";
import SearchBar from "~/components/search/SearchBar";
import { useAppColors } from "~/hooks/useAppColors";
import { Holiday } from "~/interface/holiday";
import { PER_PAGE } from "~/utils/common";
import { addDays, formatDate, formatDateRender } from "~/utils/format/format";

const HolidayScreen = () => {

    const [search, setSearch] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [page, setPage] = useState(0);

    const fetchData = React.useCallback(
        async (pageIndex = 0, append = false) => {

            const res = await holidayApi.getHolidaySettings({
                skipCount: pageIndex * PER_PAGE,
                maxResultCount: PER_PAGE,

            });

            const rawItems = res.data.result.items;

            setItems(prev => (append ? [...prev, ...rawItems] : rawItems));
            setTotalCount(res.data.result.totalCount);
        },
        []
    );

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = useMemo(() => {

        if (!search) return items;

        const keyword = search.toLowerCase();

        return items.filter((item: Holiday) =>
            item.title?.toLowerCase().includes(keyword)
        );

    }, [search, items]);

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(0);
        await fetchData();
        setRefreshing(false);
    };

    // 🔹 Load more
    const loadMore = async () => {
        if (loadingMore) return;
        if (items.length >= totalCount) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchData(nextPage, true);
        //await fetchData();
        setLoadingMore(false);
    };


    const renderItem = ({ item }: { item: Holiday }) => (
        <View style={styles.card}>

            <Text style={styles.name}>
                {item.title}
            </Text>

            <Text style={styles.date}>
                {item.numberOfDays > 1
                    ? `${formatDateRender(item.startTime, "dd/MM")} - ${formatDateRender(
                        addDays(item.startTime, item.numberOfDays - 1),
                        "dd/MM/yyyy"
                    )}`
                    : formatDateRender(item.startTime, "dd/MM/yyyy")}
            </Text>

            <Text style={styles.days}>
                {item.numberOfDays} ngày nghỉ
            </Text>

        </View>
    );

    return (
        <BaseContent >
            <View style={styles.container} >
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Tìm kỳ nghỉ..."
                />
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 14, paddingTop: 0 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    loadingMore ? (
                        <View style={{ paddingVertical: 16 }}>
                            <ActivityIndicator />
                        </View>
                    ) : null
                }
            />

        </BaseContent>
    );
};

export default HolidayScreen;

const styles = StyleSheet.create({

    container: {
        padding: 14,
        paddingBottom: 0,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        paddingHorizontal: 20,
        marginTop: 10
    },

    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 2
    },

    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6
    },

    date: {
        fontSize: 14,
        color: "#64748B"
    },

    days: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "500",
        color: "#16a34a"
    }

});