import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useAppColors } from '~/hooks/useAppColors';
import DraftTab from './tabs/DraftTab';
import PendingTab from './tabs/PendingTab';
import ApprovedTab from './tabs/ApprovedTab';
import RejectedTab from './tabs/RejectedTab';

const Tab = createMaterialTopTabNavigator();

const LeaveRequestScreen = () => {
    const colors = useAppColors();

    return (
        <>
            <Tab.Navigator screenOptions={{
                tabBarStyle: { backgroundColor: colors.background }
            }}>
                <Tab.Screen name="Draft" component={DraftTab} options={{ title: "Nháp" }} />
                <Tab.Screen name="Pending" component={PendingTab} options={{ title: "Chờ duyệt" }} />
                <Tab.Screen name="Approved" component={ApprovedTab} options={{ title: "Đã duyệt" }} />
                <Tab.Screen name="Rejected" component={RejectedTab} options={{ title: "Từ chối" }} />
            </Tab.Navigator>
        </>

    );
};
export default LeaveRequestScreen;
