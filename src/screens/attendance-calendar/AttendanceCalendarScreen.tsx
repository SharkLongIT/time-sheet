import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable
} from "react-native";

import { Calendar, LocaleConfig } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

import AttendanceDetailModal from "./modal/AttendanceDetailModal";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { getAvatarColor, getAvatarLetter } from "~/utils/avatarColors";
import { useAttendanceCalendar } from "~/hooks/useAttendanceCalendar";

/* ---------------- LOCALE ---------------- */

LocaleConfig.locales["vi"] = {
    monthNames: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    monthNamesShort: [
        "T1", "T2", "T3", "T4", "T5", "T6",
        "T7", "T8", "T9", "T10", "T11", "T12"
    ],
    dayNames: [
        "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"
    ],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay"
};

LocaleConfig.defaultLocale = "vi";

/* ---------------- COMPONENT ---------------- */

const AttendanceCalendarScreen = () => {
    const {
        currentMonth,
        markedDates,
        selectedEvent,
        attendanceTimes,
        visible,
        loading,
        stats,
        onDayPress,
        onMonthChange,
        setVisible
    } = useAttendanceCalendar();

    /* ---------------- DAY COMPONENT ---------------- */

    const renderDay = ({ date }: any) => {

        const mark = markedDates?.[date.dateString];

        return (

            <Pressable
                style={styles.dayCell}
                onPress={() => onDayPress({ dateString: date.dateString })}
            >

                <Text style={styles.dayNumber}>
                    {date.day}
                </Text>

                {mark && (

                    <View
                        style={[
                            styles.statusBox,
                            { backgroundColor: mark.color }
                        ]}
                    >

                        <Text style={styles.statusText}>
                            {mark.label}
                        </Text>

                    </View>

                )}

            </Pressable>

        );

    };

    /* ---------------- STAT CARD ---------------- */

    const StatCard = ({ label, value, color }: any) => (

        <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color }]}>
                {value || 0}
            </Text>
            <Text style={styles.statLabel}>
                {label}
            </Text>
        </View>

    );

    /* ---------------- UI ---------------- */

    return (
        <GestureHandlerRootView>

            <ScrollView style={styles.container}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>

                {/* USER */}

                <View style={styles.userCard}>
                    {/* <Image
                        source={require("~/assets/images/default-avatar.png")}
                        style={styles.avatar}
                    /> */}
                    <View
                        style={[
                            styles.avatar,
                            { backgroundColor: getAvatarColor(stats.user?.name) }
                        ]}
                    >
                        <Text style={styles.avatarText}>
                            {getAvatarLetter(stats.user?.name)}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>
                            {stats.user?.name}
                        </Text>

                        <Text style={styles.userEmail}>
                            {stats.user?.emailAddress}
                        </Text>
                    </View>

                </View>

                {loading ? (

                    <ActivityIndicator
                        size="large"
                        style={{ marginTop: 40 }}
                    />

                ) : (

                    <>

                        {/* STATS */}

                        <View style={styles.statsContainer}>

                            <StatCard
                                label="Đúng giờ"
                                value={stats.totalNormalDays}
                                color="#22c55e"
                            />

                            <StatCard
                                label="Đi muộn"
                                value={stats.totalLateDays}
                                color="#f59e0b"
                            />

                            <StatCard
                                label="Về sớm"
                                value={stats.totalEarlyLeaveDays}
                                color="#fb923c"
                            />

                            <StatCard
                                label="Vắng"
                                value={stats.totalAbsentDays}
                                color="#ef4444"
                            />

                        </View>

                        {/* CALENDAR */}

                        <View style={styles.calendarCard}>

                            <Calendar
                                current={currentMonth}
                                dayComponent={renderDay}
                                onMonthChange={onMonthChange}
                                enableSwipeMonths
                                firstDay={1}
                                renderArrow={(direction) => (
                                    <Ionicons
                                        name={
                                            direction === "left"
                                                ? "chevron-back"
                                                : "chevron-forward"
                                        }
                                        size={22}
                                        color="#2563eb"
                                    />
                                )}
                                theme={{
                                    todayTextColor: "#2563eb",
                                    arrowColor: "#2563eb",
                                    dayTextColor: "#1e293b",
                                    monthTextColor: "#111827",
                                    textMonthFontWeight: "700",
                                    textDayFontSize: 14,
                                    textMonthFontSize: 18
                                }}
                            />

                        </View>

                        {/* LEGEND */}

                        {/* <View style={styles.legend}>

                            <Legend color="#22c55e" label="Đúng giờ" />
                            <Legend color="#f59e0b" label="Đi muộn" />
                            <Legend color="#fb923c" label="Về sớm" />
                            <Legend color="#ef4444" label="Vắng" />
                            <Legend color="#6366f1" label="Nghỉ phép" />

                        </View> */}

                    </>

                )}

                <AttendanceDetailModal
                    visible={visible}
                    onClose={() => setVisible(false)}
                    selectedEvent={selectedEvent}
                    attendanceTimes={attendanceTimes}
                />

            </ScrollView>
        </GestureHandlerRootView>

    );

};

/* ---------------- LEGEND ---------------- */

const Legend = ({ color, label }: any) => (

    <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.legendText}>
            {label}
        </Text>
    </View>

);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f1f5f9"
    },

    userCard: {
        backgroundColor: "#fff",
        margin: 16,
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        gap: 10
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },


    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827"
    },

    userEmail: {
        fontSize: 13,
        color: "#64748b",
        marginTop: 4
    },

    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: -8
    },

    statCard: {
        width: "48%",
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10
    },

    statNumber: {
        fontSize: 20,
        fontWeight: "700"
    },

    statLabel: {
        fontSize: 12,
        marginTop: 2,
        color: "#64748b"
    },

    calendarCard: {
        backgroundColor: "#fff",
        margin: 14,
        borderRadius: 16,
        overflow: "hidden"
    },

    dayCell: {
        height: 60,
        alignItems: "center",
        justifyContent: "center"
    },

    dayNumber: {
        fontSize: 14,
        color: "#334155",
        marginBottom: 4
    },

    statusBox: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },

    statusText: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "600"
    },

    legend: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 12
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginVertical: 4
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6
    },

    legendText: {
        fontSize: 12,
        color: "#475569"
    }

});

export default AttendanceCalendarScreen;

