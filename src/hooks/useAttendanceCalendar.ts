import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import attendanceCaculatedRecordApi from "~/api/attendanceCaculatedRecord.api";
import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";
import attendanceTimeApi from "~/api/attendanceTime.api";
import { alertError } from "~/utils/alertMessageServer";
import { PAGE_SIZE } from "~/utils/common";
import { daysOfWeek, getAttendanceStatus } from "~/utils/format/format";

export const useAttendanceCalendar = () => {
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

            const startDate =
                new Date(date.getFullYear(), date.getMonth(), 1);

            const endDate =
                new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
                let label = "";
                if (record.isNormal) {
                    if (record.isToday) {
                        color = "#22c55e";
                        label = "Đi làm h..";
                    } else if (record.hasLeave) {
                        color = "#2db6f5";
                        label = "Nghỉ phép";
                    } else if (record.isHoliday) {
                        color = "#a855f7";
                        label = "Lễ";
                    } else {
                        color = "#22c55e";
                        label = "Đi làm đú..";
                    }
                } else if (record.absent) {
                    if (record.hasLeave) {
                        color = "#2db6f5";
                        label = "Nghỉ phép";
                    } else if (record.isHoliday) {
                        color = "#a855f7";
                        label = "Lễ";
                    } else {
                        color = "#ef4444";
                        label = "Vắng ";
                    }
                } else {
                    if (record.isLate) {
                        color = "#f59e0b";
                        label = "Đi muộn";
                    };
                    if (record.isEarlyLeave) {
                        color = "#f59e0b";
                        label = "Về sớm";
                    }
                }

                if (record.isToday && !record.isNormal) {
                    color = "#605DFF";
                    label = "Chưa có dữ liệu ..";
                }

                marks[date] = {
                    color,
                    label,
                    data: record
                };

            });

            setMarkedDates(marks);

        } catch (err) {

            console.log(err);
            alertError(err)

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
    return {
        loading,
        currentMonth,
        markedDates,
        selectedEvent,
        attendanceTimes,
        visible,
        stats,
        onDayPress,
        onMonthChange,
        setVisible

    };
};
