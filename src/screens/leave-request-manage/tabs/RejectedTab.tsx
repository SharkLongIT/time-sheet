import React, { useEffect, useRef, useState } from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestDepartment } from "~/hooks/useLeaveRequestDepartment";

const RejectTab = () => {

    const {
        items,
        refreshing,
        onRefresh,
        loadMore
    } = useLeaveRequestDepartment(3);

    return (
        <>
            <LeaveRequestList
                data={items}
                status={3}
                emptyText='Không có đơn từ chối'
                isManager={false}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

        </>
    );
};

export default RejectTab;
