export const getAttendanceRuleMode = (mode?: number) => {
    switch (mode) {
        case 0:
            return "Đầu ngày và cuối ngày";
        case 4:
            return "Đầu ca và cuối ca";
        case 3:
            return "Có mặt";
        default:
            return "";
    }
};

export const getRepeatMode = (mode?: number) => {
    switch (mode) {
        case 1:
            return "Theo tuần";
        case 2:
            return "Theo ngày";
        case 3:
            return "Theo tháng";
        default:
            return "";
    }
};
