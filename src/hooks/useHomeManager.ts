import { useEffect, useState } from "react";
import attendanceCaculatedRecordApi from "~/api/attendanceCaculatedRecord.api";
import attendanceCalculateRecordDepartmentApi from "~/api/attendanceCalculateRecordDepartment.api";
import hrmSettingsApi from "~/api/hrmSettings.api";
import { alertError } from "~/utils/alertMessageServer";

export const useHomeManager = () => {
    const [summary, setSummary] = useState<any>(null);
    const currentMonth = new Date().getMonth() + 1;
    const months = Array.from({ length: currentMonth }, (_, i) => ({
        label: `Tháng ${i + 1}`,
        value: i + 1
    }));
    const [month, setMonth] = useState(currentMonth);

    const [report, setReport] = useState<any>();
    const [settings, setSettings] = useState<any>();

    const fetchData = async (selectedMonth: number) => {

        try {

            const year = new Date().getFullYear();

            const startDate = new Date(year, selectedMonth - 1, 1);

            const endDate = new Date(year, selectedMonth, 0);

            const res =
                await attendanceCaculatedRecordApi.getAttCalcPersonalRecordsFE({
                    startDate,
                    endDate
                });

            setSummary(res);

            const resReport =
                await attendanceCalculateRecordDepartmentApi
                    .getTotalLateAbsentEarlyLeave(selectedMonth);


            setReport(resReport.data.result);

            const resSettings = await hrmSettingsApi.getAllSettings();
            setSettings(resSettings.data?.result?.settingsDashboard)

        } catch (error) {

            console.log(error);
            alertError(error)

        }

    };

    useEffect(() => {
        fetchData(month);
    }, [month]);


    return {
        fetchData,
        summary,
        month,
        setMonth,
        report,
        settings,
        months
    };
};
