import React from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestUser } from "~/hooks/useLeaveRequestUser";

const PendingTab = () => {
    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
    } = useLeaveRequestUser(1);

    return (
        <>
            <LeaveRequestList
                data={items}
                status={1}
                emptyText='Không có đơn chờ duyệt'
                isManager={false}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />


        </>
    );
};

export default PendingTab;
