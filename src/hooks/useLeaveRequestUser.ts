import React, { useRef, useState } from "react";
import {
    Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import leaveRequestUserApi from "~/api/leaveRequestUser.api";
import { PAGE_SIZE } from "~/utils/common";

export const useLeaveRequestUser = (status: number) => {
    const [items, setItems] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const opacity = useRef(new Animated.Value(0)).current;

    const fetchData = React.useCallback(
        async (pageIndex = 0, append = false) => {
            try {
                const res = await leaveRequestUserApi.getAllLeaveRequest({
                    status: status,
                    skipCount: pageIndex * PAGE_SIZE,
                    maxResultCount: PAGE_SIZE,

                });

                const rawItems = res.data.result.items;
                setItems(prev => (append ? [...prev, ...rawItems] : rawItems));
                setTotalCount(res.data.result.totalCount);
            } catch (error: any) {

            }

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


    return {
        fetchData,
        items,
        totalCount,
        onRefresh,
        loadMore,
        loading,
        loadingMore,
        refreshing,
        opacity,
    };
};
