
import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView
} from "react-native";
import shiftApi from "~/api/shift.api";
import { getAttendanceRuleMode, getRepeatMode } from "~/utils/helpers";

interface Props {
    visible: boolean;
    onClose: () => void;
    shiftId: number | null;
}

const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ Nhật",
];

const ShiftDetailUserModal = ({ visible, onClose, shiftId }: Props) => {

    const [shift, setShift] = useState<any>(null);
    const [shiftPeriodList, setShiftPeriodList] = useState<any[]>([]);

    useEffect(() => {

        const fetchData = async () => {

            if (!shiftId) return;

            try {

                const resShiftPeriodList = await shiftApi.getAllShiftPeriod();
                const resShift = await shiftApi.getShiftByIdForUser(shiftId);

                setShiftPeriodList(resShiftPeriodList?.data?.result ?? []);
                setShift(resShift?.data?.result);

            } catch (error) {
                console.log("Fetch shift detail error", error);
            }

        };

        fetchData();

    }, [shiftId]);

    const convertSecondsToTime = (seconds?: number) => {

        if (seconds == null || isNaN(seconds)) return "";

        const hours = Math.floor(seconds / 3600) % 24;
        const minutes = Math.floor((seconds % 3600) / 60);

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    };

    const rows = useMemo(() => {

        if (!shift || !shiftPeriodList) return [];

        const periodMap: any = {};

        shiftPeriodList.forEach((p: any) => {
            periodMap[p.id] = p;
        });

        const mapping: any = {};

        shift.shiftPeriodMapping?.forEach((item: any) => {

            if (!mapping[item.mappingIndex]) {
                mapping[item.mappingIndex] = [];
            }

            const period = periodMap[item.shiftPeriodId];

            if (period) {

                const start = convertSecondsToTime(period.startTime);
                const end = convertSecondsToTime(period.endTime);

                const text =
                    `${period.shiftPeriodName} (Từ Ngày hiện tại ${start}-${end} Ngày hiện tại)`;

                mapping[item.mappingIndex].push(text);
            }

        });

        const result: any[] = [];

        for (let i = 1; i <= 7; i++) {

            result.push({
                day: dayNames[i - 1],
                periods: mapping[i] || []
            });

        }

        return result;

    }, [shift, shiftPeriodList]);

    return (

        <Modal visible={visible} animationType="fade" transparent>

            <View style={styles.overlay}>

                <View style={styles.modalContainer}>

                    <Text style={styles.title}>Chi tiết lịch</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* THÔNG TIN LỊCH */}

                        <View style={styles.card}>

                            <Text style={styles.sectionTitle}>Thông tin lịch</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Tên bảng thời gian</Text>
                                <Text style={styles.value}>{shift?.shiftName}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Phương thức tính công</Text>
                                <Text style={styles.value}>
                                    {getAttendanceRuleMode(shift?.attendanceRuleMode)}
                                </Text>
                            </View>

                        </View>


                        {/* CẤU HÌNH LẶP */}

                        <View style={styles.card}>

                            <Text style={styles.sectionTitle}>Cấu hình lặp lại</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Chế độ lặp lại</Text>
                                <Text style={styles.value}>
                                    {getRepeatMode(shift?.shiftMode)}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Lặp lại mỗi</Text>
                                <Text style={styles.value}>
                                    {shift?.shiftDayNum}
                                </Text>
                            </View>

                        </View>


                        {/* BẢNG CA */}

                        <View style={styles.card}>

                            <Text style={styles.sectionTitle}>Danh sách ca</Text>

                            <View style={styles.table}>

                                {/* HEADER */}

                                <View style={styles.headerRow}>
                                    <Text style={styles.headerDay}>Ngày trong tuần</Text>
                                    <Text style={styles.headerShift}>Tên ca làm việc</Text>
                                </View>

                                {rows.map((row, index) => (

                                    <View
                                        key={index}
                                        style={[
                                            styles.dataRow,
                                            index % 2 === 0
                                                ? styles.rowWhite
                                                : styles.rowGray
                                        ]}
                                    >

                                        <Text style={styles.dayCell}>
                                            {row.day}
                                        </Text>

                                        <View style={styles.shiftCell}>
                                            {row.periods.map((p: string, i: number) => (
                                                <Text key={i} style={styles.shiftText}>
                                                    {p}
                                                </Text>
                                            ))}
                                        </View>

                                    </View>

                                ))}

                            </View>

                        </View>

                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </Modal>

    );
};

export default ShiftDetailUserModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 20
    },

    modalContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        maxHeight: "90%"
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 16,
        color: "#1e293b"
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 10,
        color: "#334155"
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },

    label: {
        fontSize: 13,
        color: "#64748b"
    },

    value: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827"
    },

    table: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        overflow: "hidden"
    },

    headerRow: {
        flexDirection: "row",
        backgroundColor: "#3b82f6",
        paddingVertical: 10
    },

    headerDay: {
        width: 120,
        paddingLeft: 10,
        fontWeight: "700",
        color: "#fff"
    },

    headerShift: {
        flex: 1,
        fontWeight: "700",
        color: "#fff"
    },

    dataRow: {
        flexDirection: "row",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: "#e5e7eb"
    },

    rowWhite: {
        backgroundColor: "#ffffff"
    },

    rowGray: {
        backgroundColor: "#f8fafc"
    },

    dayCell: {
        width: 120,
        paddingLeft: 10,
        fontWeight: "600",
        color: "#334155"
    },

    shiftCell: {
        flex: 1,
        paddingRight: 10
    },

    shiftText: {
        fontSize: 13,
        lineHeight: 18,
        color: "#1e293b"
    },

    closeButton: {
        marginTop: 14,
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center"
    },

    closeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15
    }

});

