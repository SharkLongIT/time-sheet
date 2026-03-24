import React, { useLayoutEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
    RefreshControl,
    ActivityIndicator
} from "react-native";

import leaveRequestUserApi from "~/api/leaveRequestUser.api";
import { formatDateRender } from "~/utils/format/format";
import Ionicons from "react-native-vector-icons/Ionicons";
import { showToast } from "~/utils/toast";
import SearchBar from "~/components/search/SearchBar";
import { LeaveRequest } from "~/interface/leaveRequest";
import CreateOrUpdateLeaveRequestModal from "~/screens/leave-request/modal/CreateOrUpdateLeaveRequestModal";
import leaveRequestDepartmentApi from "~/api/leaveRequestDepartment.api";
import LeaveRequestDetailModal from "~/screens/leave-request/modal/LeaveRequestDetailModal";
import { FabButton } from "../fab-base/FabButton";
import { statusConfig } from "~/utils/config/statusConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { MainParamList } from "~/navigation/MainNavigator";

type Props = {
    data: any[];
    emptyText: string;
    status?: number;
    isManager?: boolean;
    onEndReached?: () => void;
    refreshing?: boolean;
    loadingMore?: boolean;
    onRefresh?: () => void;
    fetchData?: (page: number, isLoadMore?: boolean) => Promise<void>;
    isCreate?: boolean;
    title?: string;
};


const LeaveRequestList = ({
    data,
    emptyText,
    status,
    isManager,
    onEndReached,
    onRefresh,
    loadingMore,
    fetchData,
    isCreate,
    title
}: Props) => {

    // const queryClient = useQueryClient();
    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDetailVisible, setModalDetailVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: title || ''
        });
    }, [title]);

    // console.log(data)
    const filteredData = useMemo(() => {

        if (!search) return data;

        const keyword = search.toLowerCase();

        return data.filter((item) =>
            item.reason?.toLowerCase().includes(keyword) ||
            item.leaveTypeCategoryUnit?.displayName
                ?.toLowerCase()
                .includes(keyword)
        );

    }, [search, data]);

    //#region  Draft
    const handleSend = (item: LeaveRequest) => {
        Alert.alert(
            "Gửi đơn",
            "Bạn có chắc muốn gửi đơn này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Gửi",
                    style: "default",
                    onPress: async () => {
                        try {

                            await leaveRequestUserApi.sendLeaveRequest(item.id);
                            showToast("success", "Đã gửi đơn thành công", '');
                            onRefresh?.();

                        } catch (error) {
                            showToast("error", "Gửi đơn thất bại", '');
                        }
                    },
                },
            ]
        );
    };

    const handleEdit = (item: LeaveRequest) => {
        setEditingItem(item);
        setModalVisible(true);
    };

    const handleDelete = (item: LeaveRequest) => {
        Alert.alert(
            "Xóa đơn",
            "Bạn có chắc muốn xóa đơn này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await leaveRequestUserApi.deleteLeaveRequest(item.id);
                            showToast("success", "Đã xóa đơn thành công", '');
                            onRefresh?.();
                        } catch (error) {
                            showToast("error", "Xóa đơn thất bại", '');
                        }
                    },
                },
            ]
        );
    };
    //#endregion

    //#region  Pending
    const handleRecall = (item: any) => {
        Alert.alert(
            "Thu hồi đơn",
            "Bạn có chắc muốn thu hồi đơn này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Thu hồi",
                    style: "destructive",
                    onPress: async () => {
                        try {

                            await leaveRequestUserApi.reSendLeaveRequest(item.id);
                            showToast("success", "Đã thu hồi thành công", '');
                            // queryClient.invalidateQueries({
                            //     queryKey: ["leaveRequests"]
                            // });
                            onRefresh?.();

                        } catch (error) {
                            console.log(error);
                            showToast("error", "Thu hồi thất bại", '');
                        }
                    },
                },
            ]
        );
    };
    //#endregion

    //#region Pending Manager
    const handleReApprove = (item: any) => {
        Alert.alert(
            "Từ chối",
            "Bạn có chắc muốn từ chối đơn này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await leaveRequestDepartmentApi.reApproveLeaveRequestDepartment(item.id);
                            showToast("success", 'Đã từ chối đơn nghỉ phép thành công', '')
                            // fetchData();
                            onRefresh?.();

                        } catch (error) {
                            showToast("error", 'Lỗi từ chối đơn', '')
                        }
                    },
                },
            ]
        );
    };

    const handleApprove = (item: any) => {
        Alert.alert(
            "Phê duyệt",
            "Bạn có chắc muốn phê duyệt đơn này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    style: "destructive",
                    onPress: async () => {
                        try {

                            await leaveRequestDepartmentApi.approveLeaveRequestDepartment(item.id);
                            showToast("success", 'Đã phê duyệt đơn nghỉ phép thành công', '');
                            onRefresh?.();


                        } catch (error) {
                            showToast("error", 'Đã có lỗi xảy ra trong quá trình phê duyệt đơn', 'Xin vui lòng thử lại')
                        }
                    },
                },
            ]
        );
    };

    //#endregion

    //#region renderItem

    const renderItem = ({ item }: any) => {
        const config = statusConfig[item.status] || statusConfig[0];

        return (

            <View style={styles.card}>
                {/* Header */}
                <Pressable style={styles.rowBetween} onPress={() => {
                    setEditingItem(item);
                    setModalDetailVisible(true)
                }}>
                    <Text style={styles.leaveType}>
                        {item.leaveTypeCategoryUnit?.displayName}
                    </Text>

                    <View style={[styles.statusDraft, { backgroundColor: config.bg }]}>
                        <Text style={[styles.statusText, { color: config.color }]}>
                            {config.text}
                        </Text>
                    </View>
                </Pressable>

                {/* Time */}
                <Text style={styles.time}>
                    {formatDateRender(item.startTime, "dd/MM/yyyy")} - {formatDateRender(item.endTime, "dd/MM/yyyy")}
                </Text>

                {/* Time type */}
                <Text style={styles.label}>
                    Loại thời gian:{" "}
                    <Text style={styles.value}>
                        {item.timeType === 0 ? "Theo ngày" : "Theo ca"}
                    </Text>
                </Text>

                {/* Nguoi xin nghi phep */}
                {isManager && item?.user && (
                    <Text style={styles.label}>
                        Người gửi đơn:{" "}
                        <Text style={styles.value}>
                            {item.user?.name}
                        </Text>
                    </Text>
                )}

                {/* Reason */}
                <Text style={styles.label}>
                    Lý do:{" "}
                    <Text style={styles.value}>
                        {item.reason || "Không có"}
                    </Text>
                </Text>

                {/* Action */}

                {/* Nháp */}
                {!isManager && status === 0 && (
                    <View style={styles.actionRow}>

                        <Pressable
                            style={styles.sendButton}
                            onPress={() => handleSend(item)}
                        >
                            <Ionicons name="send" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Gửi</Text>
                        </Pressable>

                        <Pressable
                            style={styles.editButton}
                            onPress={() => handleEdit(item)}
                        >
                            <Ionicons name="create" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Sửa</Text>
                        </Pressable>

                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item)}
                        >
                            <Ionicons name="trash" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Xóa</Text>
                        </Pressable>

                    </View>
                )}

                {/* Chờ duyệt */}
                {!isManager && status === 1 && (
                    <View style={styles.actionRow}>
                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleRecall(item)}
                        >
                            <Text style={styles.recallText}>
                                Thu hồi
                            </Text>
                        </Pressable>

                    </View>
                )}

                {isManager && status === 1 && (
                    <View style={styles.actionRow}>

                        <Pressable
                            style={styles.sendButton}
                            onPress={() => handleApprove(item)}
                        >
                            <Ionicons name="checkmark" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Phê duyệt</Text>
                        </Pressable>

                        {/* <Pressable
                                            style={styles.editButton}
                                        // onPress={() => handleEdit(item)}
                                        >
                                            <Ionicons name="eye" size={16} color="#fff" />
                                            <Text style={styles.buttonText}>Xem</Text>
                                        </Pressable> */}

                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleReApprove(item)}
                        >
                            <Ionicons name="close" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Từ chối</Text>
                        </Pressable>

                    </View>
                )}

            </View>

        );

    };
    //#endregion

    return (

        <View style={styles.container}>

            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Tìm đơn nghỉ..."
            />

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#3B82F6"]}
                        tintColor="#3B82F6"
                        title="Đang làm mới..."
                    />
                }

                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{emptyText}</Text>
                    </View>
                }

                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.footer}>
                            <ActivityIndicator size="small" />
                            <Text style={styles.loadingText}>Đang tải thêm...</Text>
                        </View>
                    ) : null
                }
            />
            {isCreate && <FabButton onpress={() => {
                setEditingItem(undefined);
                setModalVisible(true);
            }} />}
            <CreateOrUpdateLeaveRequestModal
                visible={modalVisible}
                isManager={isManager || false}
                editingItem={editingItem}
                onClose={() => setModalVisible(false)}
                onSubmit={() => {
                    fetchData?.(0);
                }}

            />

            <LeaveRequestDetailModal
                visible={modalDetailVisible}
                isManager={isManager || false}
                editingItem={editingItem}
                onClose={() => setModalDetailVisible(false)}
                reopenModal={() => setModalDetailVisible(true)}
            />
        </View>

    );

};

export default LeaveRequestList;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16
    },

    empty: {
        textAlign: "center",
        marginTop: 50,
        color: "#94A3B8"
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 2
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    leaveType: {
        fontSize: 16,
        fontWeight: "600"
    },

    statusDraft: {
        backgroundColor: "#e2e8f0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#475569"
    },

    time: {
        marginTop: 6,
        fontSize: 14,
        color: "#64748B"
    },

    label: {
        marginTop: 6,
        fontSize: 13,
        color: "#64748B"
    },

    value: {
        color: "#111827",
        fontWeight: "500"
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
        gap: 10
    },

    sendButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#3b82f6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8
    },

    editButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#f59e0b",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8
    },

    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#ef4444",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8
    },

    buttonText: {
        color: "#fff",
        fontWeight: "600"
    },
    recallText: {
        color: "#fff",
        fontWeight: "600"
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40
    },

    emptyText: {
        fontSize: 14,
        color: "#888"
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16
    },

    loadingText: {
        marginLeft: 8,
        fontSize: 13,
        color: "#666"
    }
});