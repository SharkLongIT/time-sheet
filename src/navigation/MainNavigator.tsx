import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '~/screens/home/HomeScreen';
import { NavigatorScreenParams } from '@react-navigation/native';
import BottomTabNavigator, { BottomTabParamList } from './BottomTabNavigator';
import ProfileScreen from '~/screens/profile/ProfileScreen';
import NotificationScreen from '~/screens/notification/NotificationScreen';
import SettingsScreen from '~/screens/settings/SettingsScreen';
import { useTranslation } from 'react-i18next';
import SecurityScreen from '~/screens/security/SecurityScreen';
import ThemeScreen from '~/screens/theme/ThemeScreen';
import AboutScreen from '~/screens/about-us/AboutScreen';
import PrivacyPolicyScreen from '~/screens/privacy-policy/PrivacyPolicyScreen';
import TermsScreen from '~/screens/term-conditions/TermsScreen';
import LanguageScreen from '~/screens/language/LanguageScreen';
import ChangePasswordScreen from '~/screens/settings/change-password/ChangePasswordScreen';
import HelpSupportScreen from '~/screens/help-support/HelpSupportScreen';
import { useAppColors } from '~/hooks/useAppColors';
import DrawerNavigator from './DrawerNavigator';
import ActiveSessionsScreen from '~/screens/security/ActiveSessionsScreen';
import HolidayScreen from '~/screens/holiday/HolidayScreen';
import LeaveRequestScreen from '~/screens/leave-request/LeaveRequest';
import AttendanceCalendarScreen from '~/screens/attendance-calendar/AttendanceCalendarScreen';
import ShiftScheduleScreen from '~/screens/shift-schedule/ShiftScheduleScreen';
import HomeManagerScreen from '~/screens/home/HomeManagerScreen';
import LeaveRequestManageScreen from '~/screens/leave-request-manage/LeaveRequestManage';
import ListUsersAttendanceCalendarScreen from '~/screens/attendance-calendar/ListUsersAttendanceCalendarScreen';
import ListUsersShiftScheduleScreen from '~/screens/shift-schedule/ListUsersShiftScheduleScreen';
import ShiftScheduleDepartmentScreen from '~/screens/shift-schedule/ShiftScheduleDepartmentScreen';
import ViewFile from '~/components/leave-request/ViewFile';
import ViewPdf from '~/components/leave-request/ViewFileUpload';

export type MainParamList = {
    // MainTab: NavigatorScreenParams<BottomTabParamList>;
    MainDrawer: NavigatorScreenParams<DrawerParamList>;
    Profile: undefined;
    Settings: undefined;
    ChangePasswordScreen: undefined;
    HelpSupport: undefined;
    Security: undefined;
    Theme: undefined;
    Terms: undefined;
    PrivacyPolicy: undefined;
    About: undefined;
    Language: undefined;
    ActiveSessions: undefined;

    Holiday: undefined;
    LeaveRequest: undefined;
    AttendanceCalendar: { userId?: number };
    ShiftSchedule: undefined;
    ShiftScheduleDepartment: { userId?: number, start?: string, end?: string };
    HomeManager: undefined;
    LeaveRequestManage: undefined;
    ListUsersAttendanceCalendar: undefined;
    ListUsersShiftSchedule: undefined;
    ViewFile: { title?: string, filepath: string, type: number, reopenModal: () => void };
    ViewPdf: { title?: string, filepath: string, type: number, reopenModal: () => void };

};
export type DrawerParamList = {
    Tabs: NavigatorScreenParams<BottomTabParamList>;
};
const Stack = createNativeStackNavigator<MainParamList>();
// options={{ headerShown: false }}
export default function MainStack() {
    const { t } = useTranslation();
    const colors = useAppColors();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTitleStyle: {
                    color: colors.textPrimary,
                },
                headerTintColor: colors.primary,
                headerBackTitle: t('common.back'),
            }}
        >
            {/* <Stack.Screen
                name="MainTab"
                component={BottomTabNavigator}
                options={{ headerShown: false }}

            /> */}
            <Stack.Screen
                name="MainDrawer"
                component={DrawerNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Profile" options={{ title: t('tab.profile') }} component={ProfileScreen} />
            <Stack.Screen name="Settings" options={{ title: t('tab.settings') }} component={SettingsScreen} />
            <Stack.Screen name="ChangePasswordScreen" options={{ title: t('settings.changePassword') }} component={ChangePasswordScreen} />
            <Stack.Screen name="HelpSupport" options={{ title: t('tab.help') }} component={HelpSupportScreen} />
            <Stack.Screen name="Security" options={{ title: t('tab.security') }} component={SecurityScreen} />
            <Stack.Screen name="Theme" options={{ title: t('tab.theme') }} component={ThemeScreen} />
            <Stack.Screen name="Terms" options={{ title: t('tab.terms') }} component={TermsScreen} />
            <Stack.Screen name="PrivacyPolicy" options={{ title: t('tab.privacyPolicy') }} component={PrivacyPolicyScreen} />
            <Stack.Screen name="About" options={{ title: t('tab.about') }} component={AboutScreen} />
            <Stack.Screen name="Language" options={{ title: t('tab.language') }} component={LanguageScreen} />
            <Stack.Screen name="ActiveSessions" options={{ title: t('security.activeSessions') }} component={ActiveSessionsScreen} />
            <Stack.Screen name="Holiday" options={{ title: 'Kỳ nghỉ' }} component={HolidayScreen} />
            <Stack.Screen name="LeaveRequest" options={{ title: 'Nghỉ phép' }} component={LeaveRequestScreen} />
            <Stack.Screen name="AttendanceCalendar" options={{ title: 'Chấm công' }} component={AttendanceCalendarScreen} />
            <Stack.Screen name="ShiftSchedule" options={{ title: 'Lịch làm việc' }} component={ShiftScheduleScreen} />
            <Stack.Screen name="ShiftScheduleDepartment" options={{ title: 'Lịch làm việc' }} component={ShiftScheduleDepartmentScreen} />
            <Stack.Screen name="HomeManager" options={{ title: 'Lịch làm việc' }} component={HomeManagerScreen} />
            <Stack.Screen name="LeaveRequestManage" options={{ title: 'Quản lý nghỉ phép' }} component={LeaveRequestManageScreen} />
            <Stack.Screen name="ListUsersAttendanceCalendar" options={{ title: 'Quản lý chấm công' }} component={ListUsersAttendanceCalendarScreen} />
            <Stack.Screen name="ListUsersShiftSchedule" options={{ title: 'Lịch ca làm việc' }} component={ListUsersShiftScheduleScreen} />
            <Stack.Screen name="ViewFile" options={{ title: 'Chi tiết' }} component={ViewFile} />
            <Stack.Screen name="ViewPdf" options={{ title: 'Chi tiết' }} component={ViewPdf} />
        </Stack.Navigator>
    );
}