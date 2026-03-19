import React from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestUser } from "~/hooks/useLeaveRequestUser";

const ApprovedTab = () => {

    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
    } = useLeaveRequestUser(3);

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

export default ApprovedTab;
