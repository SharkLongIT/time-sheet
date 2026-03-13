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
import dayjs from "dayjs";

import shiftScheduleApi from "~/api/shiftSchedule.api";
import ShiftScheduleModal from "./modal/ShiftScheduleDetailModal";

import { daysOfWeek, formatDateRender } from "~/utils/format/format";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import shiftScheduleDepartmentApi from "~/api/shiftScheduleDepartment.api";
import userExporterApi from "~/api/userExporter.api";
import { getUserById } from "~/hooks/useAuth";

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

const ShiftScheduleScreen = () => {

    const auth = useSelector((state: RootState) => state.auth.user);
    const route = useRoute<any>();
    const { userId } = route.params;
    const today = dayjs().format("YYYY-MM-DD");

    const [user, setUser] = useState<any>()

    const [currentMonth, setCurrentMonth] = useState(today);

    const [markedDates, setMarkedDates] = useState<any>({});
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState<any>({});

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        loadAttendance(today);
    }, []);

    const loadAttendance = async (dateString: string) => {

        try {

            setLoading(true);

            const startDate = dayjs(dateString).startOf("month").toDate();
            const endDate = dayjs(dateString).endOf("month").toDate();
            // GetWorkCalendarTimeForUserFE
            const res =
                await shiftScheduleDepartmentApi.getWorkCalendarTimeForUser({
                    userId: userId,
                    effectiveBeginDate: startDate,
                    effectiveEndDate: endDate
                });
            // const userRes = await userExporterApi.getUserById(userId);
            const user = await getUserById(userId);
            setUser(user);
            // await shiftScheduleApi.getWorkCalendarTimeForUserFe({
            //     userId: userId,
            //     effectiveBeginDate: startDate,
            //     effectiveEndDate: endDate
            // });

            const result = res.data.result;

            setStats(result);
            console.log(result)

            if (!result?.calendarItems) {
                setMarkedDates({});
                return;
            }

            /* ---------------- GROUP BY DATE ---------------- */

            const grouped: any = {};

            result.calendarItems.forEach((item: any) => {

                const date = dayjs(item.date).format("YYYY-MM-DD");

                if (!grouped[date]) {
                    grouped[date] = [];
                }

                grouped[date].push(item);

            });

            /* ---------------- CONVERT TO MARKED DATES ---------------- */

            const marks: any = {};

            Object.keys(grouped).forEach(date => {

                const items = grouped[date];

                marks[date] = {
                    marked: true,
                    dotColor: items[0].isScheduleUser ? "#2563eb" : "#94a3b8",
                    data: items
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

    const onDayPress = (day: any) => {

        const event = markedDates[day.dateString];

        if (!event) return;

        const records = event.data;

        const date = dayjs(day.dateString);

        const dayName = daysOfWeek[date.day()];

        setSelectedEvent({
            date: day.dateString,
            dayName,
            periods: records
        });

        setVisible(true);

    };

    /* ---------------- MONTH CHANGE ---------------- */

    const onMonthChange = (month: any) => {

        const date =
            `${month.year}-${String(month.month).padStart(2, "0")}-01`;

        setCurrentMonth(date);

        loadAttendance(date);

    };

    /* ---------------- UI ---------------- */

    return (

        <View style={styles.container}>

            {/* SHIFT LIST */}
            <View style={styles.userCard}>
                <Image
                    source={require("~/assets/images/default-avatar.png")}
                    style={styles.avatar}
                />
                <View>

                    <Text style={styles.userName}>
                        {user?.name}
                    </Text>

                    <Text style={styles.userEmail}>
                        {user?.emailAddress}
                    </Text>
                </View>

            </View>
            <View style={styles.legend}>
                {stats?.shiftList?.length ? (
                    stats.shiftList.map((shift: any, index: number) => {

                        const {
                            shiftName,
                            isShiftScheduleUser,
                            effectiveBeginDate,
                            effectiveEndDate,
                            attendanceRuleMode
                        } = shift;

                        const cardColor = isShiftScheduleUser ? "#605DFF" : "#ffbc2b";
                        const textColor = isShiftScheduleUser ? "#fff" : "#1e293b";

                        const attendanceModes: any = {
                            0: "Đầu ngày & cuối ngày",
                            4: "Đầu ca và cuối ca",
                            3: "Cả ngày",
                            "-1": "Chưa có lịch làm việc"
                        };

                        const modeText = attendanceModes[attendanceRuleMode] ?? "";

                        return (
                            <View
                                key={index}
                                style={[styles.shiftCard, { backgroundColor: cardColor }]}
                            >
                                <Text style={[styles.shiftTitle, { color: textColor }]}>
                                    ⏰ {shiftName} ({isShiftScheduleUser ? "Lịch cá nhân" : "Lịch nhóm"})
                                </Text>

                                <Text style={[styles.shiftDate, { color: textColor }]}>
                                    📅 {formatDateRender(effectiveBeginDate, "dd/MM/yyyy")} -{" "}
                                    {formatDateRender(effectiveEndDate, "dd/MM/yyyy")}
                                </Text>

                                {!!modeText && (
                                    <Text style={[styles.shiftDate, { color: textColor }]}>
                                        Phương thức tính công: {modeText}
                                    </Text>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>
                            Không có ca nào trong tháng
                        </Text>
                    </View>
                )}
            </View>

            {/* CALENDAR */}

            {loading ? (

                <ActivityIndicator
                    size="large"
                    style={{ marginTop: 40 }}
                />

            ) : (

                <View style={styles.calendarCard}>

                    <Calendar
                        current={currentMonth}
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        onMonthChange={onMonthChange}
                        enableSwipeMonths
                        firstDay={1}
                        hideArrows={false}
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

            )}

            {/* MODAL */}

            <ShiftScheduleModal
                visible={visible}
                onClose={() => setVisible(false)}
                selectedEvent={selectedEvent}
            />

        </View>

    );

};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: 10
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
    calendarCard: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3
    },

    legend: {
        //marginTop: 14
    },

    shiftCard: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        marginHorizontal: 12,
    },

    shiftTitle: {
        fontSize: 14,
        fontWeight: "600"
    },

    shiftDate: {
        fontSize: 12,
        marginTop: 5
    },

    emptyCard: {
        backgroundColor: "#f1f5f9",
        marginHorizontal: 12,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14
    },

    emptyText: {
        textAlign: "center",
        color: "#64748b"
    }

});

export default ShiftScheduleScreen;