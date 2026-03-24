import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import leaveRequestApi from "~/api/leaveRequest.api";
import leaveRequestUserApi from "~/api/leaveRequestUser.api";
import leaveRequestDepartmentApi from "~/api/leaveRequestDepartment.api";
import AppSelect from "~/components/select-base/AppSelect";
import { useAppColors } from "~/hooks/useAppColors";
import { alertError } from "~/utils/alertMessageServer";
import { useNavigation } from "@react-navigation/native";
import { MainParamList } from "~/navigation/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
    visible: boolean;
    isManager?: boolean;
    onClose: () => void;
    reopenModal: () => void;
    editingItem?: any;
}

const LeaveRequestDetailModal = ({
    visible,
    isManager,
    onClose,
    editingItem,
    reopenModal
}: Props) => {

    const colors = useAppColors();
    const auth = useSelector((state: RootState) => state.auth.user);
    const navigation = useNavigation<NativeStackNavigationProp<MainParamList>>();
    const [categories, setCategories] = useState<any[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [leaveTypeCategoryUnitId, setLeaveTypeCategoryUnitId] = useState<string>();
    const [userId] = useState<string>(auth?.id?.toString() || "");

    const [reason, setReason] = useState("");
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();

    const [timeType, setTimeType] = useState(0);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [attachment, setAttachment] = useState<any>(null);

    const resetForm = () => {
        setLeaveTypeCategoryUnitId(undefined);
        setReason("");
        setStartTime(undefined);
        setEndTime(undefined);
        setTimeType(0);
        setSelectedPeriods([]);
        setAttachment(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // LOAD DATA
    useEffect(() => {

        if (!visible || !editingItem) return;

        const loadEditData = async () => {

            try {
                const cateRes = await leaveRequestApi.getAllCategoryUnitLeaveRequest();
                setCategories(cateRes.data.result);

                if (isManager) {
                    const resUsers = await leaveRequestDepartmentApi.getAllUsersViewDepartment({});
                    setUsers(resUsers.data.result.items);
                }

                loadPeriods(userId);
                const res = await leaveRequestUserApi.getLeaveRequestById(editingItem.id);
                const data = res.data.result;
                setReason(data.reason ?? "");
                setLeaveTypeCategoryUnitId(data.leaveTypeCategoryUnitId?.toString());

                setStartTime(data.startTime ? new Date(data.startTime) : undefined);
                setEndTime(data.endTime ? new Date(data.endTime) : undefined);

                setTimeType(data.timeType);

                if (data.leaveRequestPeriodMappings) {

                    const ids = data.leaveRequestPeriodMappings.map(
                        (x: any) => x.shiftPeriodId
                    );

                    setSelectedPeriods(ids);

                }
                if (data.filePath) {
                    const resFile = await leaveRequestUserApi.getFile(data.filePath);
                    const file = resFile.data.result;
                    setAttachment({
                        name: file.fileName,
                        filePath: data.filePath
                    })
                }

            } catch (error) {
                console.log(error);
                alertError(error)
            }

        };

        loadEditData();

    }, [visible, editingItem]);

    const loadPeriods = async (uid: string) => {

        try {

            const res = await leaveRequestUserApi.getPeriodByUserId({
                userId: uid
            });

            setPeriods(res.data.result);

        } catch (error) {
            console.log(error);
            alertError(error)
        }

    };

    return (

        <Modal
            visible={visible}
            transparent
            animationType="slide"
            presentationStyle="overFullScreen"
        >

            <View style={styles.overlay}>

                <View style={[styles.container, { backgroundColor: colors.background }]}>

                    <View style={styles.header}>

                        <Text style={styles.title}>
                            Chi tiết đơn nghỉ
                        </Text>

                        <Pressable onPress={handleClose}>
                            <Ionicons name="close" size={24} />
                        </Pressable>

                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        {isManager && (
                            <AppSelect
                                label="Người nghỉ phép"
                                value={userId}
                                options={users?.map((p: any) => ({
                                    label: p.name,
                                    value: p.id.toString(),
                                }))}
                                disabled
                            />
                        )}

                        <AppSelect
                            label="Loại vắng mặt"
                            value={leaveTypeCategoryUnitId}
                            options={categories?.map((p: any) => ({
                                label: p.displayName,
                                value: p.id.toString(),
                            }))}
                            required
                            disabled
                        />



                        <Text style={[styles.label, { marginTop: -5 }]}>Loại thời gian <Text style={styles.required}>*</Text></Text>

                        <View style={styles.radioGroup}>

                            <Pressable
                                style={styles.radioItem}
                            // onPress={() => setTimeType(0)}

                            >
                                <Ionicons
                                    name={timeType === 0 ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color="#6366F1"
                                />
                                <Text>Theo ngày</Text>
                            </Pressable>

                            <Pressable
                                style={styles.radioItem}
                            // onPress={() => setTimeType(1)}
                            >
                                <Ionicons
                                    name={timeType === 1 ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color="#6366F1"
                                />
                                <Text>Theo ca</Text>
                            </Pressable>

                        </View>

                        <Text style={styles.label}>Ngày bắt đầu <Text style={styles.required}>*</Text></Text>

                        <TextInput
                            style={[styles.inputText]}
                            value={startTime?.toLocaleDateString("vi-VN")}
                            editable={false}
                        />

                        {timeType === 0 && (
                            <>
                                <Text style={styles.label}>Ngày kết thúc <Text style={styles.required}>*</Text></Text>

                                <TextInput
                                    style={[styles.inputText]}
                                    value={endTime?.toLocaleDateString("vi-VN")}
                                    editable={false}
                                />
                            </>
                        )}

                        {timeType === 1 && (
                            <>
                                <Text style={styles.label}>Ca làm việc <Text style={styles.required}>*</Text></Text>

                                {periods?.map((p: any) => {

                                    const selected = selectedPeriods.includes(p.shiftPeriodDto.id);

                                    return (
                                        <Pressable
                                            key={p.shiftPeriodDto.id}
                                            style={[
                                                styles.periodItem,
                                                selected && styles.periodItemActive
                                            ]}
                                            disabled
                                        >
                                            <Ionicons
                                                name={selected ? "checkbox" : "square-outline"}
                                                size={20}
                                                color={selected ? "#6366F1" : "#64748B"}
                                            />

                                            <Text>{p.shiftPeriodDto.shiftPeriodName}</Text>

                                        </Pressable>
                                    );
                                })}
                            </>
                        )}

                        <Text style={styles.label}>Lý do nghỉ <Text style={styles.required}>*</Text></Text>

                        <TextInput
                            style={[
                                styles.input,
                            ]}
                            value={reason}
                            multiline
                            editable={false}
                        />

                        <Text style={styles.label}>Tệp minh chứng</Text>

                        {attachment ? (
                            <Pressable
                                onPress={() => {
                                    onClose();
                                    let type = 1;

                                    if (isManager) {
                                        type = 3;
                                    } else {
                                        type = 2;
                                    }
                                    navigation.push("ViewFile", {
                                        title: attachment.name,
                                        filepath: attachment.filePath,
                                        type,
                                        reopenModal
                                    });
                                }}
                                key={attachment.name} style={styles.fileItem}
                            >

                                <Ionicons name="document-outline" size={18} />

                                <Text style={styles.fileName} numberOfLines={1}>
                                    {attachment.name}
                                </Text>

                            </Pressable>
                        ) : (
                            <Text style={styles.emptyText}>Không có tệp minh chứng</Text>
                        )}



                        {/* ))} */}

                    </ScrollView>


                    <View style={styles.actionRow}>



                        <Pressable
                            style={styles.submitButton}
                            onPress={() => onClose()}
                        >
                            <Text style={styles.submitText}>Đóng</Text>
                        </Pressable>

                    </View>


                </View>

            </View>

        </Modal>

    );
};

export default LeaveRequestDetailModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20
    },
    container: {
        borderRadius: 16,
        padding: 20,
        maxHeight: "90%"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "700"
    },
    label: {
        // fontSize: 14,
        marginTop: 12,
        // marginBottom: 6
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 6,
    },
    radioGroup: {
        flexDirection: "row",
        gap: 20
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    periodItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 6
    },
    periodItemActive: {
        borderColor: "#6366F1",
        backgroundColor: "#EEF2FF"
    },
    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        backgroundColor: "#fff"
    },
    inputText: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        padding: 10,
        minHeight: 45,
        backgroundColor: "#fff"
    },
    inputError: {
        borderColor: "#EF4444"
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 4
    },
    uploadButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#6366F1",
        borderRadius: 8,
        padding: 12,
        marginTop: 6
    },
    uploadText: {
        color: "#6366F1",
        fontWeight: "600"
    },
    fileItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgb(238, 235, 235)",
        padding: 10,
        borderRadius: 8,
        marginTop: 6
    },
    fileName: {
        flex: 1
    },
    actionRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16
    },
    draftButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#E2E8F0",
        alignItems: "center"
    },
    saveEdit: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#3b8efb",
        alignItems: "center"
    },
    draftText: {
        fontWeight: "600"
    },
    submitButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#6366F1",
        alignItems: "center"
    },
    submitText: {
        color: "#fff",
        fontWeight: "600"
    },
    required: {
        color: '#EF4444',
    },
    emptyText: {
        color: "#6b7280",
        fontStyle: "italic"
    }
});