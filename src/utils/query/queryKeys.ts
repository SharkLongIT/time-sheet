export const queryKeys = {
    leaveRequests: {
        all: ["leaveRequests"],

        list: (status?: number, page?: number) => [
            "leaveRequests",
            { status, page }
        ],

        byStatus: (status: number) => [
            "leaveRequests",
            { status }
        ],
    },

    leaveRequestsDp: {
        all: ["leaveRequestsDp"],

        list: (status?: number, page?: number) => [
            "leaveRequestsDp",
            { status, page }
        ],

        byStatus: (status: number) => [
            "leaveRequestsDp",
            { status }
        ],
    },

    leaveRequestDetail: (id: number) => [
        "leaveRequestDetail",
        id
    ]
};