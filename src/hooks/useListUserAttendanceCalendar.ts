import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";
import { alertError } from "~/utils/alertMessageServer";
import { PAGE_SIZE } from "~/utils/common";

export const useListUserAttendanceCalender = () => {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
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
                setHasMore(true);

            } else {

                setUsers(prev => [...prev, ...data]);

            }

            if (data.length < PAGE_SIZE) {
                setHasMore(false);
            }

        } catch (err) {
            console.log(err);
            alertError(err)

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

        if (loading || loadingMore || !hasMore) return;

        setLoadingMore(true);

        const nextPage = page + 1;

        await fetchUsers(nextPage, search);

        setPage(nextPage);
    };
    const onEndReachedCalledDuringMomentum = React.useRef(false);
    /* ---------------- REFRESH ---------------- */

    const onRefresh = async () => {

        setRefreshing(true);
        setPage(1);
        setHasMore(true);

        await fetchUsers(1, search);

    };
    return {
        users,
        loading,
        loadingMore,
        refreshing,
        hasMore,
        search,
        setSearch,
        loadMore,
        onRefresh,
        onEndReachedCalledDuringMomentum,
    };
};
