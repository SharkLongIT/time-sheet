import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image
} from "react-native";

import { Calendar, LocaleConfig } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";

import attendanceCaculatedRecordApi from "~/api/attendanceCaculatedRecord.api";
import attendanceTimeApi from "~/api/attendanceTime.api";

import { daysOfWeek, getAttendanceStatus } from "~/utils/format/format";

import AttendanceDetailModal from "./modal/AttendanceDetailModal";
import { useRoute } from "@react-navigation/native";

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
    dayNamesShort: [
        "CN", "T2", "T3", "T4", "T5", "T6", "T7"
    ],
    today: "Hôm nay"
};

LocaleConfig.defaultLocale = "vi";

/* ---------------- COMPONENT ---------------- */

const AttendanceCalendarScreen = () => {

    const today = new Date().toISOString().split("T")[0];

    const route = useRoute<any>();
    const { userId } = route.params;

    const [currentMonth, setCurrentMonth] = useState(today);
    const [markedDates, setMarkedDates] = useState<any>({});
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const [attendanceTimes, setAttendanceTimes] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>({});

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        loadAttendance(currentMonth);
    }, []);

    const loadAttendance = async (dateString: string) => {

        try {

            setLoading(true);

            const date = new Date(dateString);

            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const res =
                await attendanceCaculatedRecordApi
                    .getAttCalcPersonalRecordsFE({
                        userId,
                        startDate,
                        endDate
                    });

            const result = res.data.result;

            setStats(result);

            const marks: any = {};

            result.attendanceRecords.forEach((record: any) => {

                const date = record.calcDate.split("T")[0];

                let color = "#ccc";

                if (record.hasLeave) color = "#6366f1";
                else if (record.isHoliday) color = "#fbbf24";
                else if (record.isNormal) color = "#22c55e";
                else if (record.absent) color = "#ef4444";
                else color = "#f59e0b";

                marks[date] = {
                    marked: true,
                    dotColor: color,
                    data: record
                };

            });

            setMarkedDates(marks);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    /* ---------------- CLICK DAY ---------------- */

    const onDayPress = async (day: any) => {

        const event = markedDates[day.dateString];

        if (!event) return;

        const record = event.data;

        const date = new Date(day.dateString);

        const dayName = daysOfWeek[date.getDay()];

        const status = getAttendanceStatus(record);

        setSelectedEvent({
            ...record,
            status,
            dayName
        });

        try {

            const res =
                await attendanceTimeApi
                    .getAttendanceTimesForUser({
                        startDate: new Date(day.dateString)
                    });

            setAttendanceTimes(res.data.result.items || []);

        } catch {

            setAttendanceTimes([]);

        }

        setVisible(true);

    };

    /* ---------------- MONTH CHANGE ---------------- */

    const onMonthChange = (month: any) => {

        const date =
            `${month.year}-${String(month.month).padStart(2, "0")}-01`;

        setCurrentMonth(date);

        loadAttendance(date);

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

        <View style={styles.container}>
            <View style={styles.userCard}>
                <Image
                    source={require("~/assets/images/default-avatar.png")}
                    style={styles.avatar}
                />
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

                <ActivityIndicator size="large" style={{ marginTop: 40 }} />

            ) : (

                <>

                    {/* USER INFO */}



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
                            markedDates={markedDates}
                            onDayPress={onDayPress}
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

                    <View style={styles.legend}>

                        <Legend color="#22c55e" label="Đúng giờ" />
                        <Legend color="#f59e0b" label="Đi muộn" />
                        <Legend color="#fb923c" label="Về sớm" />
                        <Legend color="#ef4444" label="Vắng" />
                        <Legend color="#6366f1" label="Nghỉ phép" />

                    </View>
                </>

            )}


            <AttendanceDetailModal
                visible={visible}
                onClose={() => setVisible(false)}
                selectedEvent={selectedEvent}
                attendanceTimes={attendanceTimes}
            />

        </View>

    );

};

/* ---------------- LEGEND ---------------- */

const Legend = ({ color, label }: any) => (

    <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.legendText}>{label}</Text>
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
        flexDirection: 'row',
        gap: 10
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22
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
        paddingHorizontal: 16
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
        margin: 16,
        borderRadius: 16,
        overflow: "hidden"
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