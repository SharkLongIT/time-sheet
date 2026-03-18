export const addDays = (date: string | Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export const formatDateRender = (date: string | Date, format: string) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    if (format === "dd/MM") return `${day}/${month}`;
    if (format === "dd/MM/yyyy") return `${day}/${month}/${year}`;

    return `${day}/${month}/${year}`;
};
export const formatDate = (date?: string | Date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const getAttendanceStatus = (record: any) => {

    if (record.isLate)
        return { label: "Đi muộn", color: "#f59e0b" };

    if (record.isEarlyLeave)
        return { label: "Về sớm", color: "#f59e0b" };

    if (record.hasLeave)
        return { label: "Nghỉ phép", color: "#2db6f5" };

    if (record.isHoliday)
        return { label: "Nghỉ lễ", color: "#a855f7" };

    if (record.isNormal)
        return { label: "Đi làm đúng giờ", color: "#22c55e" };

    if (record.absent && record.isToday)
        return { label: "Chưa có dữ liệu chấm công", color: "#605DFF" };

    if (record.absent)
        return { label: "Vắng mặt", color: "#ef4444" };

    return { label: "Chưa có dữ liệu chấm công", color: "#605DFF" };
};
export const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7"
];