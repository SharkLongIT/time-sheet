import React, { useEffect, useRef, useState } from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { PER_PAGE } from "~/utils/common";
import { useFocusEffect } from "@react-navigation/native";
import { Animated } from "react-native";
import leaveRequestDepartmentApi from "~/api/leaveRequestDepartment.api";

const PendingTab = () => {

    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const opacity = useRef(new Animated.Value(0)).current;

    const fetchData = React.useCallback(
        async (pageIndex = 0, append = false) => {

            const res = await leaveRequestDepartmentApi.getAllLeaveRequestDepartment({
                status: 1,
                skipCount: pageIndex * PER_PAGE,
                maxResultCount: PER_PAGE,

            });

            const rawItems = res.data.result.items;
            setItems(prev => (append ? [...prev, ...rawItems] : rawItems));
            setTotalCount(res.data.result.totalCount);
        },
        []
    );
    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            setPage(0);

            fetchData(0).finally(() => {
                setLoading(false);
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, [fetchData])
    );

    // 🔹 Pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(0);
        await fetchData(0);
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
        setLoadingMore(false);
    };

    return (
        <>
            <LeaveRequestList
                data={items}
                status={1}
                emptyText="Không có chờ duyệt"
                isManager={true}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

        </>
    );
};

export default PendingTab;
