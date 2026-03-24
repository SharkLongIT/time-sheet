import React, { useEffect, useRef, useState } from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestDepartment } from "~/hooks/useLeaveRequestDepartment";

const ApprovedTab = () => {

    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
        totalCount
    } = useLeaveRequestDepartment(2);
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
                // title={`Đã duyệt (${totalCount})`}
                title="Đã duyệt"
            />

        </>
    );
};

export default ApprovedTab;
