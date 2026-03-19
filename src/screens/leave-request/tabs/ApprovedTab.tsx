import React, { useEffect, useRef, useState } from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import leaveRequestUserApi from "~/api/leaveRequestUser.api";
import { useFocusEffect } from "@react-navigation/native";
import { Animated } from "react-native";
import { PAGE_SIZE } from "~/utils/common";
import { useLeaveRequestUser } from "~/hooks/useLeaveRequestUser";

const ApprovedTab = () => {
    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
    } = useLeaveRequestUser(2);
    return (
        <>
            <LeaveRequestList
                data={items}
                status={2}
                emptyText='Không có đơn đã duyệt'
                isManager={false}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

        </>
    );
};

export default ApprovedTab;
