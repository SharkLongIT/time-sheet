import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    Pressable
} from "react-native";

import { Calendar, LocaleConfig } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";

import shiftScheduleDepartmentApi from "~/api/shiftScheduleDepartment.api";
import ShiftScheduleModal from "./modal/ShiftScheduleDetailModal";
import ShiftDetailUserModal from "./modal/ShiftDetailUserModal";

import { daysOfWeek, formatDateRender } from "~/utils/format/format";
import { useRoute } from "@react-navigation/native";
import { getUserById } from "~/hooks/useAuth";
import { getAvatarColor, getAvatarLetter } from "~/utils/avatarColors";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

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

const ShiftScheduleDepartmentScreen = () => {

    const route = useRoute<any>();
    const { userId, start } = route.params;

    const [user, setUser] = useState<any>();
    const [currentMonth, setCurrentMonth] = useState(dayjs(start).format("YYYY-MM-DD"));

    const [markedDates, setMarkedDates] = useState<any>({});
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState<any>({});

    const [modalDetailVisible, setModalDetailVisible] = useState(false);
    const [shiftId, setShiftId] = useState<number | null>(null);

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        const initialDate = dayjs(start).format("YYYY-MM-DD");
        setCurrentMonth(initialDate);
        loadAttendance(initialDate);
    }, []);

    const loadAttendance = async (dateString: string) => {

        try {

            setLoading(true);

            const startDate = dayjs(dateString)
                .startOf("month")
                .format("YYYY-MM-DD HH:mm:ss");

            const endDate = dayjs(dateString)
                .endOf("month")
                .format("YYYY-MM-DD HH:mm:ss");

            const res =
                await shiftScheduleDepartmentApi.getWorkCalendarTimeForUser({
                    userId: userId,
                    effectiveBeginDate: startDate,
                    effectiveEndDate: endDate
                });

            const userRes = await getUserById(userId);

            setUser(userRes);

            const result = res.data.result;

            setStats(result);

            if (!result?.calendarItems) {
                setMarkedDates({});
                return;
            }

            const grouped: any = {};

            result.calendarItems.forEach((item: any) => {

                const date = dayjs(item.date).format("YYYY-MM-DD");

                if (!grouped[date]) grouped[date] = [];

                grouped[date].push(item);

            });

            const marks: any = {};

            Object.keys(grouped).forEach(date => {

                const items = grouped[date];

                marks[date] = {
                    data: items
                };

            });
            // console.log(marks)
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

    /* ---------------- DAY COMPONENT ---------------- */

    const renderDay = ({ date }: any) => {

        const event = markedDates?.[date.dateString];
        return (

            <Pressable
                style={styles.dayCell}
                onPress={() => onDayPress({ dateString: date.dateString })}
            >

                <Text style={styles.dayNumber}>{date.day}</Text>

                {event && (

                    <View
                        style={[
                            styles.eventBox,
                            {
                                backgroundColor:
                                    event.data?.[0]?.isScheduleUser
                                        ? "#605DFF"
                                        : "#ffbc2b"
                            }
                        ]}
                    >

                        <Text style={styles.eventText} numberOfLines={1}>

                            {/* {event.data.length > 1
                                ? `${event.data[0].shiftPeriodName} +${event.data.length - 1}`
                                : event.data[0].shiftPeriodName || ""} */}

                            <Text style={styles.eventText} numberOfLines={1}>
                                {event.data
                                    .map((i: any) => i.shiftPeriodName)
                                    .join(", ")}
                            </Text>
                        </Text>

                    </View>

                )}

            </Pressable>

        );

    };

    /* ---------------- UI ---------------- */

    return (
        <GestureHandlerRootView>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                style={styles.container}>

                {/* USER */}

                <View style={styles.userCard}>

                    <View
                        style={[
                            styles.avatar,
                            { backgroundColor: getAvatarColor(user?.name) }
                        ]}
                    >
                        <Text style={styles.avatarText}>
                            {getAvatarLetter(user?.name)}
                        </Text>
                    </View>
                    <View>

                        <Text style={styles.userName}>
                            {user?.name}
                        </Text>

                        <Text style={styles.userEmail}>
                            {user?.emailAddress}
                        </Text>

                    </View>

                </View>

                {/* SHIFT LIST */}

                <View >

                    {stats?.shiftList?.length ? (

                        stats.shiftList.map((shift: any, index: number) => {

                            const {
                                id,
                                shiftName,
                                isShiftScheduleUser,
                                effectiveBeginDate,
                                effectiveEndDate,
                                attendanceRuleMode
                            } = shift;

                            const cardColor =
                                isShiftScheduleUser ? "#605DFF" : "#ffbc2b";

                            const textColor =
                                isShiftScheduleUser ? "#fff" : "#1e293b";

                            const attendanceModes: any = {
                                0: "Đầu ngày & cuối ngày",
                                4: "Đầu ca và cuối ca",
                                3: "Cả ngày",
                                "-1": "Chưa có lịch làm việc"
                            };

                            const modeText =
                                attendanceModes[attendanceRuleMode] ?? "";

                            return (

                                <Pressable
                                    key={index}
                                    style={[styles.shiftCard, { backgroundColor: cardColor }]}
                                    onPress={() => {
                                        setShiftId(id);
                                        setModalDetailVisible(true);
                                    }}
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

                                </Pressable>

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

                    <ActivityIndicator size="large" style={{ marginTop: 40 }} />

                ) : (

                    <View style={styles.calendarCard}>

                        <Calendar
                            current={currentMonth}
                            dayComponent={renderDay}
                            onMonthChange={onMonthChange}
                            enableSwipeMonths
                            firstDay={1}
                            renderArrow={(direction) => (
                                <Ionicons
                                    name={direction === "left" ? "chevron-back" : "chevron-forward"}
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

                <ShiftDetailUserModal
                    visible={modalDetailVisible}
                    onClose={() => setModalDetailVisible(false)}
                    shiftId={shiftId}
                />

            </ScrollView>
        </GestureHandlerRootView>


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
        margin: 14,
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        gap: 10
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
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

    calendarCard: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3
    },

    shiftCard: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        marginHorizontal: 12
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
    },

    dayCell: {
        height: 60,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 4
    },

    dayNumber: {
        fontSize: 14,
        color: "#1e293b",
        marginBottom: 3
    },

    eventBox: {
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2
    },

    eventText: {
        fontSize: 10,
        color: "#fff"
    }

});

export default ShiftScheduleDepartmentScreen;