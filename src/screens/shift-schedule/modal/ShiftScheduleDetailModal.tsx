import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity
} from "react-native";

import { formatDateRender } from "~/utils/format/format";

interface Props {
    visible: boolean;
    onClose: () => void;
    selectedEvent: any;
}

const ShiftScheduleModal = ({
    visible,
    onClose,
    selectedEvent
}: Props) => {
    if (!selectedEvent) return null;
    // console.log(selectedEvent)
    const displayDate = selectedEvent?.date
        ? new Date(selectedEvent.date)
        : null;

    if (displayDate) {
        displayDate.setDate(displayDate.getDate() - 1);
    }
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            <View style={styles.overlay}>

                <View style={styles.modalContainer}>

                    {/* HEADER */}
                    <Text style={styles.title}>
                        Chi tiết lịch làm việc
                    </Text>

                    {/* DATE */}
                    {/* <View style={styles.infoCard}>
                        <Text style={styles.dateText}>
                            {displayDate
                                ? formatDateRender(displayDate, "dd/MM/yyyy")
                                : ""}
                        </Text>
                    </View> */}

                    {/* SHIFT INFO */}
                    <View style={styles.shiftCard}>

                        {/* <View style={styles.row}>
                            <Text style={styles.label}>Ca làm</Text>
                            <Text style={styles.value}>
                                {selectedEvent?.shiftName}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Loại ca</Text>
                            <Text style={styles.value}>
                                {selectedEvent?.shiftPeriodName}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Thời gian</Text>
                            <Text style={styles.value}>
                                {selectedEvent?.timeCalendar}
                            </Text>
                        </View> */}
                        {selectedEvent?.periods?.map((item: any, index: number) => (

                            <View key={index} style={styles.row}>

                                <Text style={styles.label}>
                                    {item.shiftPeriodName}
                                </Text>

                                <Text style={styles.value}>
                                    {item.timeCalendar}
                                </Text>

                            </View>

                        ))}
                    </View>

                    {/* BUTTON */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
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

export default ShiftScheduleModal;
const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15
    },

    infoCard: {
        alignItems: "center",
        marginBottom: 15
    },

    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#334155"
    },

    shiftCard: {
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        padding: 14
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
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

    closeButton: {
        marginTop: 18,
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center"
    },

    closeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    }

});