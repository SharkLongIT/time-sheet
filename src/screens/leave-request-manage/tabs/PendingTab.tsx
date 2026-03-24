import React, { useEffect, useRef, useState } from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestDepartment } from "~/hooks/useLeaveRequestDepartment";

const PendingTab = () => {

    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
        totalCount
    } = useLeaveRequestDepartment(1);
    return (
        <>
            <LeaveRequestList
                data={items}
                status={1}
                emptyText="Không có chờ duyệt"
                isManager={true}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
                isCreate={true}
                // title={`Chờ duyệt (${totalCount})`}
                title="Chờ duyệt"
            />
        </>
    );
};

export default PendingTab;
