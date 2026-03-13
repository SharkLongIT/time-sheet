import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BaseContent } from '~/components/base-screen/BaseContent';
import { useTranslation } from 'react-i18next';
import { useAppColors } from '~/hooks/useAppColors';
import PendingTab from './tabs/PendingTab';
import ApprovedTab from './tabs/ApprovedTab';
import RejectedTab from './tabs/RejectedTab';

const Tab = createMaterialTopTabNavigator();

const LeaveRequestManageScreen = () => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const colors = useAppColors();

    return (
        <>

            {/* <BaseContent style={{ flex: 1 }}> */}
            <Tab.Navigator screenOptions={{
                tabBarStyle: { backgroundColor: colors.background }
            }}>
                <Tab.Screen name="Pending" component={PendingTab} options={{ title: "Chờ duyệt" }} />
                <Tab.Screen name="Approved" component={ApprovedTab} options={{ title: "Đã duyệt" }} />
                <Tab.Screen name="Rejected" component={RejectedTab} options={{ title: "Từ chối" }} />
            </Tab.Navigator>
            {/* </BaseContent> */}
        </>

    );
};
export default LeaveRequestManageScreen;
