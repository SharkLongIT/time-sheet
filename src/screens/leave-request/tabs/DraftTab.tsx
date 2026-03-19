import React from "react";
import LeaveRequestList from "~/components/leave-request/LeaveRequestList";
import { useLeaveRequestUser } from "~/hooks/useLeaveRequestUser";

const DraftTab = () => {

    const {
        items,
        refreshing,
        onRefresh,
        loadMore,
        fetchData
    } = useLeaveRequestUser(0);

    return (
        <>
            <LeaveRequestList
                data={items}
                status={0}
                emptyText='Không có đơn nháp'
                isManager={false}
                onEndReached={loadMore}
                refreshing={refreshing}
                onRefresh={onRefresh}
                fetchData={fetchData}
                isCreate={true}
            />

        </>
    );
};

export default DraftTab;
