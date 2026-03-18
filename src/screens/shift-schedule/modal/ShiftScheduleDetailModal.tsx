import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
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

    const displayDate = selectedEvent?.date
        ? new Date(selectedEvent.date)
        : null;

    const renderItem = ({ item }: any) => (

        <View style={styles.shiftItem}>

            <View style={styles.shiftIcon}>
                <Ionicons name="time-outline" size={18} color="#605DFF" />
            </View>

            <View style={{ flex: 1 }}>

                <Text style={styles.shiftName}>
                    {item.shiftPeriodName}
                </Text>

                <Text style={styles.shiftTime}>
                    {item.timeCalendar}
                </Text>

            </View>

        </View>

    );

    return (

        <Modal
            visible={visible}
            animationType="fade"
            transparent
        >

            <View style={styles.overlay}>

                <View style={styles.modalContainer}>

                    {/* HEADER */}

                    <View style={styles.header}>

                        <Text style={styles.title}>
                            Lịch làm việc
                        </Text>

                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color="#64748b" />
                        </TouchableOpacity>

                    </View>

                    {/* DATE CARD */}

                    <View style={styles.dateCard}>

                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#2563eb"
                        />

                        <Text style={styles.dateText}>

                            {displayDate
                                ? formatDateRender(displayDate, "dd/MM/yyyy")
                                : ""}

                        </Text>

                    </View>

                    {/* SHIFT LIST */}

                    <FlatList
                        data={selectedEvent?.periods}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() =>
                            <View style={styles.divider} />
                        }
                    />

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
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 20
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827"
    },

    dateCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#eff6ff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16
    },

    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e40af"
    },

    shiftItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },

    shiftIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    shiftName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827"
    },

    shiftTime: {
        fontSize: 13,
        color: "#64748b",
        marginTop: 2
    },

    divider: {
        height: 1,
        backgroundColor: "#f1f5f9"
    },

    closeButton: {
        marginTop: 18,
        backgroundColor: "#2563eb",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center"
    },

    closeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    }

});