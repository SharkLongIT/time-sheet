import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import attendanceCaculatedRecordApi from "~/api/attendanceCaculatedRecord.api";
import { useAppColors } from "~/hooks/useAppColors";
import { RootState } from "~/redux/store";
import { alertError } from "~/utils/alertMessageServer";

export const useHome = () => {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { t } = useTranslation();
    const colors = useAppColors();
    const auth = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    const [fromDate, setFromDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const [toDate, setToDate] = useState(new Date());
    const fetchData = async (start: Date, end: Date) => {

        try {

            setLoading(true);

            const res =
                await attendanceCaculatedRecordApi.getAttCalcPersonalRecordsFE({
                    startDate: start,
                    endDate: end
                });

            setSummary(res.data.result);

        } catch (error) {
            console.log(error);
            alertError(error)

        } finally {

            setLoading(false);

        }

    };
    useEffect(() => {

        fetchData(fromDate, toDate);

    }, []);

    return {
        fetchData,
        summary,
        loading,
        setToDate,
        setFromDate,
        fromDate,
        toDate
    };
};
