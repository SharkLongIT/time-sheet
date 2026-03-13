import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Text,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { BarChart } from "react-native-chart-kit";
import Ionicons from "react-native-vector-icons/Ionicons";

import attendanceCaculatedRecordApi from "~/api/attendanceCaculatedRecord.api";
import Weather from "~/components/weather/Weather";
import { useAppColors } from "~/hooks/useAppColors";
import { RootState } from "~/redux/store";
import DateRangePicker from "~/components/date-picker/DateRangePicker";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {

    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { t } = useTranslation();
    const colors = useAppColors();
    const auth = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    const [fromDate, setFromDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const [toDate, setToDate] = useState(new Date());
    const fetchData = async (start: Date, end: Date) => {

        try {

            setLoading(true);

            const res =
                await attendanceCaculatedRecordApi.getAttCalcPersonalRecordsFE({
                    startDate: start,
                    endDate: end
                });

            setSummary(res.data.result);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };
    useEffect(() => {

        fetchData(fromDate, toDate);

    }, []);
    /* ===== Attendance ===== */

    const lateCount = summary?.totalLateDays ?? 0;
    const leaveEarlyCount = summary?.totalEarlyLeaveDays ?? 0;
    const absentCount = summary?.totalAbsentDays ?? 0;
    const leaveRequests = summary?.totalLeaveRequests ?? 0;

    const MenuButton = ({ icon, color, label, onPress }: any) => (
        <Pressable style={styles.menuItem} onPress={onPress}>

            <View style={[styles.menuIcon, { backgroundColor: color + "20" }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>

            <Text style={styles.menuText}>
                {label}
            </Text>

        </Pressable>
    )
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>

            {/* WEATHER */}
            <SafeAreaView edges={["top"]}>
                <Weather />
            </SafeAreaView>

            <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                >

                    {/* HEADER USER */}

                    <View style={styles.header}>

                        <View>

                            <Text style={styles.welcome}>
                                {t("welcome_back")}
                            </Text>

                            <Text style={[styles.userName, { color: colors.textPrimary }]}>
                                {auth?.name ?? "User"} 👋
                            </Text>

                        </View>

                        <Pressable onPress={() => navigation.navigate("Profile")}>

                            <Image
                                source={require("~/assets/images/default-avatar.png")}
                                style={styles.avatar}
                            />

                        </Pressable>

                    </View>




                    {/* DASHBOARD CARDS */}

                    {/* <View style={styles.dashboardRow}>

                        <View style={[styles.statCard, { borderLeftColor: "#22c55e" }]}>

                            <Ionicons name="calendar-outline" size={26} color="#22c55e" />

                            <Text style={styles.cardTitle}>Ngày công</Text>

                            <Text style={styles.bigNumber}>
                                {totalAttendance}
                            </Text>

                            <Text style={styles.small}>Tổng tháng: {maxAttendance}</Text>
                            <Text style={styles.small}>Không phép: {absentCount}</Text>
                            <Text style={styles.small}>Có phép: {leaveRequests}</Text>

                        </View>


                        <View style={[styles.statCard, { borderLeftColor: "#3b82f6" }]}>

                            <Ionicons name="airplane-outline" size={26} color="#3b82f6" />

                            <Text style={styles.cardTitle}>Ngày phép</Text>

                            <Text style={styles.bigNumber}>
                                {remainingLeave}
                            </Text>

                            <Text style={styles.small}>Phép năm: {totalAnnualLeave}</Text>
                            <Text style={styles.small}>Đã nghỉ: {usedLeave}</Text>

                        </View>

                    </View> */}


                    {/* CHART */}

                    <View style={styles.chartCard}>
                        <DateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            label="Khoảng thời gian"
                            onChange={({ from, to }) => {

                                if (!from || !to) return;

                                setFromDate(from);
                                setToDate(to);

                                fetchData(from, to);

                            }}
                        />

                        <Text style={styles.sectionTitle}>
                            Biểu đồ chấm công
                        </Text>
                        {loading ? (

                            <View style={{ paddingVertical: 40 }}>
                                <ActivityIndicator size="large" color="#3b82f6" />
                            </View>

                        ) : (
                            <BarChart
                                data={{
                                    labels: ["Vắng", "Muộn", "Về sớm", "Nghỉ"],
                                    datasets: [{
                                        data: [
                                            absentCount,
                                            lateCount,
                                            leaveEarlyCount,
                                            leaveRequests
                                        ]
                                    }]
                                }}
                                yAxisLabel=""
                                yAxisSuffix=""
                                width={screenWidth - 40}
                                height={200}
                                chartConfig={{
                                    backgroundGradientFrom: "#fff",
                                    backgroundGradientTo: "#fff",
                                    decimalPlaces: 0,
                                    color: (o = 1) => `rgba(59,130,246,${o})`,
                                    labelColor: () => "#374151"
                                }}
                                style={{ marginTop: 10, borderRadius: 12 }}
                            />
                        )}

                    </View>


                    {/* ATTENDANCE MENU */}

                    <View style={styles.menuSection}>

                        <Text style={styles.sectionTitle}>
                            Dữ liệu chấm công
                        </Text>

                        <View style={styles.menuGrid}>

                            <MenuButton
                                icon="document-text-outline"
                                color="#22c55e"
                                label="Nghỉ phép"
                                onPress={() => navigation.navigate("LeaveRequest")}
                            />

                            <MenuButton
                                icon="time-outline"
                                color="#3b82f6"
                                label="Chấm công"
                                onPress={() => navigation.navigate("AttendanceCalendar", { userId: auth?.id })}
                            />

                            <MenuButton
                                icon="calendar-outline"
                                color="#f59e0b"
                                label="Lịch làm việc"
                                onPress={() => navigation.navigate("ShiftSchedule", { userId: auth?.id })}
                            />

                        </View>

                    </View>


                    {/* CATEGORY */}

                    <View style={styles.menuSection}>

                        <Text style={styles.sectionTitle}>
                            Danh mục
                        </Text>

                        <View style={styles.menuGrid}>

                            <MenuButton
                                icon="sunny-outline"
                                color="#ef4444"
                                label="Kỳ nghỉ"
                                onPress={() => navigation.navigate("Holiday")}
                            />

                        </View>

                    </View>


                </ScrollView>

            </SafeAreaView>

        </View>
    )

};

export default HomeScreen;



const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 10
    },

    welcome: {
        fontSize: 16,
        color: "#6B7280"
    },

    userName: {
        fontSize: 20,
        fontWeight: "700"
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 22
    },

    dateRange: {
        paddingHorizontal: 20,
        marginTop: 10
    },

    dashboardRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 16
    },

    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3
    },

    cardTitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 6
    },

    bigNumber: {
        fontSize: 28,
        fontWeight: "700",
        marginVertical: 6
    },

    small: {
        fontSize: 12,
        color: "#6B7280"
    },

    chartCard: {
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10
    },

    menuSection: {
        marginHorizontal: 16,
        marginTop: 10
    },

    menuGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    menuItem: {
        width: "33%",
        alignItems: "center",
        marginBottom: 18
    },

    menuIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6
    },

    menuText: {
        fontSize: 12,
        textAlign: "center"
    }

})