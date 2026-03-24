import React from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestUser } from "~/hooks/useLeaveRequestUser";

const ApprovedTab = () => {

    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
        totalCount
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
                // title={`Từ chối (${totalCount})`}
                title="Từ chối"
            />
        </>
    );
};

export default ApprovedTab;
