import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView
} from "react-native";

import { formatDateRender } from "~/utils/format/format";

interface Props {
    visible: boolean;
    onClose: () => void;
    selectedEvent: any;
    attendanceTimes: any[];
}

const AttendanceDetailModal = ({
    visible,
    onClose,
    selectedEvent,
    attendanceTimes
}: Props) => {

    const formatDateTime = (date: string) => {

        if (!date) return "";

        const d = new Date(date);

        return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN")}`;
    };

    return (

        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >

            <View style={styles.overlay}>

                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Chi tiết chấm công
                        </Text>
                    </View>

                    {selectedEvent && (

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Date */}

                            <View style={styles.infoCard}>

                                <Text style={styles.dateText}>
                                    {formatDateRender(selectedEvent?.calcDate, "dd/MM/yyyy")}
                                </Text>

                                <Text style={styles.dayText}>
                                    {selectedEvent?.dayName}
                                </Text>

                            </View>

                            {/* Status */}

                            <View style={styles.statusContainer}>

                                <Text style={styles.label}>
                                    Trạng thái
                                </Text>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: selectedEvent?.status?.color + "20" }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { color: selectedEvent?.status?.color }
                                        ]}
                                    >
                                        {selectedEvent?.status?.label}
                                    </Text>
                                </View>

                            </View>

                            {/* Checkin Checkout */}

                            <View style={styles.timeRow}>

                                <View style={styles.timeCard}>

                                    <Text style={styles.label}>
                                        Check In
                                    </Text>

                                    <Text style={styles.timeValue}>
                                        {selectedEvent.checkIn ?? "--"}
                                    </Text>

                                </View>

                                <View style={styles.timeCard}>

                                    <Text style={styles.label}>
                                        Check Out
                                    </Text>

                                    <Text style={styles.timeValue}>
                                        {selectedEvent.checkOut ?? "--"}
                                    </Text>

                                </View>

                            </View>

                            {/* Table */}

                            <Text style={styles.sectionTitle}>
                                Thời gian chấm công
                            </Text>

                            <View style={styles.tableHeader}>

                                <Text style={styles.headerCell}>
                                    Tên
                                </Text>

                                <Text style={styles.headerCell}>
                                    Thời gian
                                </Text>

                                <Text style={styles.headerCell}>
                                    Thiết bị
                                </Text>

                            </View>

                            {attendanceTimes.length === 0 ? (

                                <Text style={styles.emptyText}>
                                    Không có dữ liệu
                                </Text>

                            ) : (

                                attendanceTimes.map((item, index) => (

                                    <View key={index} style={styles.tableRow}>

                                        <Text style={styles.cell}>
                                            {item.userName || "-"}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {formatDateTime(item.startTime)}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {item.doorName || "-"}
                                        </Text>

                                    </View>

                                ))

                            )}

                        </ScrollView>

                    )}

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >

                        <Text style={styles.closeText}>
                            Đóng
                        </Text>

                    </TouchableOpacity>

                </View>

            </View>

        </Modal>

    );

};

export default AttendanceDetailModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 20
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        maxHeight: "85%"
    },

    header: {
        marginBottom: 10
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center"
    },

    infoCard: {
        alignItems: "center",
        marginVertical: 10
    },

    dateText: {
        fontSize: 18,
        fontWeight: "600"
    },

    dayText: {
        fontSize: 15,
        color: "#666"
    },

    statusContainer: {
        alignItems: "center",
        marginVertical: 10
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "center",
        marginTop: 6
    },

    statusText: {
        fontSize: 13,
        fontWeight: "600"
    },

    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 15
    },

    timeCard: {
        backgroundColor: "#f5f6fa",
        padding: 12,
        borderRadius: 10,
        width: "48%"
    },

    label: {
        fontSize: 12,
        color: "#888"
    },

    timeValue: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 4
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8
    },

    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ddd",
        paddingBottom: 6
    },

    headerCell: {
        flex: 1,
        fontWeight: "600"
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: "#eee"
    },

    cell: {
        flex: 1,
        fontSize: 13
    },

    emptyText: {
        textAlign: "center",
        marginTop: 10,
        color: "#888"
    },

    closeButton: {
        marginTop: 15,
        backgroundColor: "#2563eb",
        padding: 12,
        borderRadius: 10,
        alignItems: "center"
    },

    closeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    }

});