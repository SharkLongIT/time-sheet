import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Text,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import Weather from "~/components/weather/Weather";
import { useAppColors } from "~/hooks/useAppColors";
import { RootState } from "~/redux/store";
import DateRangePicker from "~/components/date-picker/DateRangePicker";
import { useHome } from "~/hooks/useHome";


const HomeScreen = () => {
    const {
        fetchData,
        summary,
        loading,
        setToDate,
        setFromDate,
        fromDate,
        toDate
    } = useHome();

    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { t } = useTranslation();
    const colors = useAppColors();
    const auth = useSelector((state: RootState) => state.auth.user);
    /* ===== Attendance ===== */

    const lateCount = summary?.totalLateDays ?? 0;
    const leaveEarlyCount = summary?.totalEarlyLeaveDays ?? 0;
    const absentCount = summary?.totalAbsentDays ?? 0;
    const leaveRequests = summary?.totalLeaveRequests ?? 0;
    const lateAndEarlyCount = summary?.totalLateAndEarlyLeave ?? 0;

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
    const Stat = ({ label, value, color }: { label: any, value: any, color: any }) => (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 10,
                backgroundColor: "#F9FAFB"
            }}
        >
            <Text>{label}</Text>
            <Text style={{ color, fontWeight: "700" }}>{value}</Text>
        </View>
    );
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
                            Thông tin chấm công
                        </Text>
                        {loading ? (

                            <View style={{ paddingVertical: 40 }}>
                                <ActivityIndicator size="large" color="#3b82f6" />
                            </View>

                        ) : (
                            // <BarChart
                            //     data={{
                            //         labels: ["Vắng", "Muộn", "Về sớm", "Nghỉ phép"],
                            //         datasets: [{
                            //             data: [
                            //                 absentCount,
                            //                 lateCount,
                            //                 leaveEarlyCount,
                            //                 leaveRequests,
                            //             ],
                            //             colors: [
                            //                 () => "#EF4444",  // đỏ
                            //                 () => "#F59E0B", // cam
                            //                 () => "#6366F1", // tím
                            //                 () => "#22C55E", // xanh lá
                            //             ]
                            //         }]
                            //     }}
                            //     width={screenWidth - 40}
                            //     height={260}
                            //     fromZero
                            //     showValuesOnTopOfBars
                            //     withCustomBarColorFromData
                            //     flatColor
                            //     verticalLabelRotation={0}
                            //     chartConfig={{
                            //         backgroundGradientFrom: "#ffffff",
                            //         backgroundGradientTo: "#ffffff",
                            //         decimalPlaces: 0,

                            //         barPercentage: 0.5,

                            //         color: () => "#3B82F6",
                            //         labelColor: () => "#111827",

                            //         propsForLabels: {
                            //             fontSize: 12
                            //         },

                            //         propsForBackgroundLines: {
                            //             stroke: "#E5E7EB",
                            //             strokeDasharray: "4"
                            //         }
                            //     }}
                            //     style={{
                            //         marginVertical: 10,
                            //         borderRadius: 16
                            //     }}
                            //     yAxisLabel=""
                            //     yAxisSuffix=""
                            // />
                            <View style={{ gap: 10 }}>
                                <Stat label="Vắng" value={absentCount} color="#EF4444" />
                                <Stat label="Đi muộn" value={lateCount} color="#F59E0B" />
                                <Stat label="Về sớm" value={leaveEarlyCount} color="#3B82F6" />
                                <Stat label="Nghỉ phép" value={leaveRequests} color="#22C55E" />
                                <Stat label="Đi muộn về sớm" value={lateAndEarlyCount} color="#8B5CF6" />
                            </View>
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