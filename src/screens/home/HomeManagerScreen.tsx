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
    Dimensions
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
import HeaderMain from "~/components/layout/base-header/header-main";
import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from "react-native-element-dropdown";
import hrmSettingsApi from "~/api/hrmSettings.api";
import { PieChart } from "react-native-chart-kit";
import { alertError } from "~/utils/alertMessageServer";

const screenWidth = Dimensions.get("window").width;

const HomeManagerScreen = () => {

    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const colors = useAppColors();
    const [summary, setSummary] = useState<any>(null);
    const currentMonth = new Date().getMonth() + 1;
    const months = Array.from({ length: currentMonth }, (_, i) => ({
        label: `Tháng ${i + 1}`,
        value: i + 1
    }));
    const [month, setMonth] = useState(currentMonth);

    const [report, setReport] = useState<any>();
    const [settings, setSettings] = useState<any>();

    const fetchData = async (selectedMonth: number) => {

        try {

            const year = new Date().getFullYear();

            const startDate = new Date(year, selectedMonth - 1, 1);

            const endDate = new Date(year, selectedMonth, 0);

            const res =
                await attendanceCaculatedRecordApi.getAttCalcPersonalRecordsFE({
                    startDate,
                    endDate
                });

            setSummary(res);

            const resReport =
                await attendanceCalculateRecordDepartmentApi
                    .getTotalLateAbsentEarlyLeave(selectedMonth);


            setReport(resReport.data.result);

            const resSettings = await hrmSettingsApi.getAllSettings();
            setSettings(resSettings.data?.result?.settingsDashboard)

        } catch (error) {

            console.log(error);
            alertError(error)

        }

    };

    useEffect(() => {
        fetchData(month);
    }, [month]);


    /* ===== Leave ===== */

    const MenuButton = ({ icon, color, label, onPress }: any) => (
        <Pressable style={styles.menuItem} onPress={onPress}>

            <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
                <Ionicons name={icon} size={26} color={color} />
            </View>

            <Text style={styles.menuText}>
                {label}
            </Text>

        </Pressable>
    )
    return (

        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <HeaderMain title="Quản lý" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >

                {/* DATE RANGE */}

                <View style={styles.dateRange}>
                    <Dropdown
                        style={styles.dropdown}
                        data={months}
                        labelField="label"
                        valueField="value"
                        value={month}
                        placeholder="Chọn tháng"
                        onChange={(item) => {
                            setMonth(item.value);
                        }}
                    />
                </View>

                {/* OVERVIEW CARD */}

                <View style={styles.chartCard}>

                    <Text style={styles.sectionTitle}>
                        Tổng quan chấm công phòng ban
                    </Text>
                    <BarChart
                        data={{
                            labels: [
                                "Về sớm",
                                "Đi muộn",
                                "Đi muộn Về sớm",
                                "Vắng"
                            ],
                            datasets: [
                                {
                                    data: [
                                        report?.totalEarlyLeave || 0,
                                        report?.totalLate || 0,
                                        report?.totalLateAndEarlyLeave || 0,
                                        report?.totalAbsent || 0
                                    ],
                                    colors: [
                                        () => "#22C55E", // xanh lá
                                        () => "#F59E0B", // cam
                                        () => "#6366F1", // tím
                                        () => "#EF4444"  // đỏ
                                    ]
                                }
                            ]
                        }}
                        width={screenWidth - 40}
                        height={260}
                        fromZero
                        showValuesOnTopOfBars
                        withCustomBarColorFromData
                        flatColor
                        verticalLabelRotation={0}
                        chartConfig={{
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,

                            barPercentage: 0.5,

                            color: () => "#3B82F6",
                            labelColor: () => "#111827",

                            propsForLabels: {
                                fontSize: 12
                            },

                            propsForBackgroundLines: {
                                stroke: "#E5E7EB",
                                strokeDasharray: "4"
                            }
                        }}
                        style={{
                            marginVertical: 10,
                            borderRadius: 16
                        }}
                        yAxisLabel=""
                        yAxisSuffix=""
                    />

                    {/* SETTINGS */}

                    <View style={styles.settingsBox}>

                        <Text style={styles.settingsTitle}>
                            Cấu hình hệ thống
                        </Text>

                        <View style={styles.settingsRow}>

                            <View style={[styles.settingItem, { backgroundColor: "#FEF3C7" }]}>
                                <Text style={styles.settingLabel}>Về sớm</Text>
                                <Text style={styles.settingValue}>
                                    {settings?.totalEarlyLeave || 0}
                                </Text>
                            </View>

                            <View style={[styles.settingItem, { backgroundColor: "#DBEAFE" }]}>
                                <Text style={styles.settingLabel}>Đi muộn</Text>
                                <Text style={styles.settingValue}>
                                    {settings?.totalLate || 0}
                                </Text>
                            </View>

                        </View>

                        <View style={styles.settingsRow}>

                            <View style={[styles.settingItem, { backgroundColor: "#E0E7FF" }]}>
                                <Text style={styles.settingLabel}>Đi muộn + về sớm</Text>
                                <Text style={styles.settingValue}>
                                    {settings?.totalLateAndEarlyLeave || 0}
                                </Text>
                            </View>

                            <View style={[styles.settingItem, { backgroundColor: "#FEE2E2" }]}>
                                <Text style={styles.settingLabel}>Vắng</Text>
                                <Text style={styles.settingValue}>
                                    {settings?.totalAbsent || 0}
                                </Text>
                            </View>

                        </View>

                    </View>

                </View>

                {/* ATTENDANCE MANAGEMENT */}

                <View style={styles.menuSection}>

                    <Text style={styles.sectionTitle}>
                        Quản lý chấm công
                    </Text>

                    <View style={styles.menuGrid}>

                        <MenuButton
                            icon="document-text-outline"
                            color="#22c55e"
                            label="Quản lý nghỉ phép"
                            onPress={() => navigation.navigate("LeaveRequestManage")}
                        />

                        <MenuButton
                            icon="time-outline"
                            color="#3b82f6"
                            label="Theo dõi chấm công"
                            onPress={() => navigation.navigate("ListUsersAttendanceCalendar")}
                        />

                    </View>

                </View>


                {/* CONFIGURATION */}

                <View style={styles.menuSection}>

                    <Text style={styles.sectionTitle}>
                        Cấu hình chấm công
                    </Text>

                    <View style={styles.menuGrid}>

                        <MenuButton
                            icon="calendar-outline"
                            color="#f59e0b"
                            label="Lịch ca làm việc"
                            onPress={() => navigation.navigate("ListUsersShiftSchedule")}
                        />

                    </View>

                </View>


            </ScrollView>

        </SafeAreaView>

    );

};

export default HomeManagerScreen;

const styles = StyleSheet.create({

    safe: {
        flex: 1
    },

    dateRange: {
        paddingHorizontal: 14,
        marginTop: 10
    },
    chart: {
        marginTop: 14,
        borderRadius: 12
    },

    settingsBox: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: "#f1f5f9",
        paddingTop: 14
    },

    settingsTitle: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 10,
        color: "#374151"
    },

    settingsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },

    settingItem: {
        width: "48%",
        padding: 12,
        borderRadius: 10
    },

    settingLabel: {
        fontSize: 13,
        color: "#6b7280"
    },

    settingValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginTop: 4
    },

    summaryContainer: {
        marginTop: 16,
        gap: 4
    },
    chartCard: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 16,
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
        color: "#111827",
        marginBottom: 6
    },

    menuSection: {
        marginTop: 18,
        marginHorizontal: 16
    },

    menuGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    menuItem: {
        width: "33%",
        alignItems: "center",
        marginBottom: 20
    },

    iconBox: {
        width: 54,
        height: 54,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6
    },

    menuText: {
        fontSize: 12,
        textAlign: "center",
        color: "#374151"
    },
    dropdown: {
        height: 50,
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#fff"
    },

});