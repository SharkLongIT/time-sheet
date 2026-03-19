import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    Alert
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

import leaveRequestApi from "~/api/leaveRequest.api";
import leaveRequestUserApi from "~/api/leaveRequestUser.api";
import leaveRequestAttApi from "~/api/leaveRequestAtt.api";
import leaveRequestDepartmentApi from "~/api/leaveRequestDepartment.api";
import DatePickerField from "~/components/date-picker/DatePickerField";
import AppSelect from "~/components/select-base/AppSelect";
import { pick } from "@react-native-documents/picker";
import { useAppColors } from "~/hooks/useAppColors";
import { showToast } from "~/utils/toast";
import axios from "axios";
import { buildUrl } from "~/helper/url.helper";
import { useQueryClient } from "@tanstack/react-query";
import { alertError } from "~/utils/alertMessageServer";

interface Props {
    visible: boolean;
    isManager: boolean;
    onClose: () => void;
    editingItem?: any;
    onSubmit: () => void;
}

const CreateOrUpdateLeaveRequestModal = ({
    visible,
    isManager,
    onClose,
    editingItem,
    onSubmit
}: Props) => {

    const colors = useAppColors();
    const auth = useSelector((state: RootState) => state.auth.user);

    const [categories, setCategories] = useState<any[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [leaveTypeCategoryUnitId, setLeaveTypeCategoryUnitId] = useState<string>();
    const [userId, setUserId] = useState<string>(auth?.id?.toString() || "");

    const [reason, setReason] = useState("");
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();

    const [timeType, setTimeType] = useState(0);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [attachment, setAttachment] = useState<any>(null);
    const [errors, setErrors] = useState<any>({});

    const queryClient = useQueryClient();

    const formatDate = (date?: Date) => {
        if (!date) return null;
        return date.toISOString().split("T")[0];
    };

    const resetForm = () => {
        setLeaveTypeCategoryUnitId(undefined);
        setReason("");
        setStartTime(undefined);
        setEndTime(undefined);
        setTimeType(0);
        setSelectedPeriods([]);
        setAttachment(null);
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // LOAD MASTER DATA
    useEffect(() => {

        if (!visible) return;

        const fetchData = async () => {

            try {

                const cateRes = await leaveRequestApi.getAllCategoryUnitLeaveRequest();
                setCategories(cateRes.data.result);

                if (isManager) {
                    const resUsers = await leaveRequestDepartmentApi.getAllUsersViewDepartment({});
                    setUsers(resUsers.data.result.items);
                }

                loadPeriods(userId);

            } catch (error) {
                console.log(error);
                alertError(error)
            }

        };

        fetchData();

    }, [visible]);

    // LOAD EDIT DATA
    useEffect(() => {

        if (!visible || !editingItem) return;

        const loadEditData = async () => {

            try {
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
                        name: file.fileName
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

    const handleToggleUser = async (value: string) => {

        setUserId(value);

        setSelectedPeriods([]);

        loadPeriods(value);

    };

    const togglePeriod = (id: number) => {

        setSelectedPeriods(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );

    };

    const validate = () => {

        const newErrors: any = {};
        if (isManager && !userId)
            newErrors.userId = "Vui lòng chọn người nghỉ phép";

        if (!leaveTypeCategoryUnitId)
            newErrors.leaveTypeCategoryUnitId = "Vui lòng chọn loại vắng mặt";

        if (!startTime)
            newErrors.startTime = "Vui lòng chọn ngày bắt đầu";

        if (timeType === 0 && !endTime)
            newErrors.endTime = "Vui lòng chọn ngày kết thúc";

        if (!reason.trim())
            newErrors.reason = "Vui lòng nhập lý do";

        if (timeType === 1 && selectedPeriods.length === 0)
            newErrors.periods = "Vui lòng chọn ca làm việc";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handlePickFile = async () => {

        try {

            const res = await pick({
                // type: [DocumentPicker.types.allFiles],
                // type: 'all',
                allowMultiSelection: false
            });
            setAttachment(res[0]);

        } catch (err) {
            alertError(err)
            // if (!DocumentPicker.isCancel(err))
            //     console.log(err);

        }

    };

    const removeFile = () => {
        setAttachment(null);
    };

    const uploadAttachments = async (leaveRequestId: number) => {
        try {

            if (!attachment?.uri) return;
            // if (editingItem && !attachment.uri) return;

            const data = new FormData();

            data.append("file", {
                uri: attachment.uri,
                name: attachment.name || 'tep-minh-chung',
                type: attachment.type || "application/octet-stream",
            } as any);
            console.log(data)

            const uploadRes = await axios.post(
                buildUrl("/Mobile/LeaveRequest/UploadFile"),
                data,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );
            // if (editingItem.id) {
            //     await leaveRequestAttApi.updateLeavRequestAtt({
            //         leaveRequestId,
            //         filePath: uploadRes.data.result.fileName
            //     })
            // }
            await leaveRequestAttApi.saveLeaveRequestAtt({
                leaveRequestId,
                filePath: uploadRes.data.result.fileName
            });

        } catch (error) {
            console.log("upload error", error);
            // alertError(error)
        }
    };

    const createLeaveRequest = async (status: "draft" | "submit") => {

        const payload = {
            leaveTypeCategoryUnitId: Number(leaveTypeCategoryUnitId),
            userId: Number(userId),
            reason,
            startTime: formatDate(startTime),
            endTime: timeType === 0 ? formatDate(endTime) : formatDate(startTime),
            timeType,
            shiftPeriodIds: selectedPeriods
        };

        let res;

        if (isManager) {
            res = await leaveRequestDepartmentApi.createLeaveRequest(payload);
        } else {
            res = await leaveRequestUserApi.createLeaveRequest(payload);

        }

        return res.data.result;

    };

    const handleSubmit = async (status: "draft" | "submit") => {

        if (!validate()) return;

        try {

            const leaveRequest = await createLeaveRequest(status);
            if (status === 'submit') {
                await leaveRequestUserApi.sendLeaveRequest(leaveRequest.id)
            }
            await uploadAttachments(leaveRequest.id);

            onSubmit();

            handleClose();

            showToast(
                "success",
                "Thành công",
                status === "draft"
                    ? "Đã tạo bản nháp"
                    : "Đã gửi yêu cầu"
            );
            // queryClient.invalidateQueries({
            //     queryKey: ["leaveRequests"]
            // });

        } catch (error: any) {

            console.log(error);

            Alert.alert(
                "Lỗi tạo đơn",
                error?.error?.message || "Có lỗi xảy ra"
            );

        }

    };


    const handleSaveEdit = async () => {

        if (!validate()) return;

        try {

            const payload = {
                id: editingItem.id,
                leaveTypeCategoryUnitId: Number(leaveTypeCategoryUnitId),
                reason,
                userId: Number(userId),
                startTime: formatDate(startTime),
                endTime: timeType === 0 ? formatDate(endTime) : formatDate(startTime),
                timeType,
                shiftPeriodIds: selectedPeriods
            };

            const res = await leaveRequestUserApi.editLeaveRequest(payload);

            await uploadAttachments(editingItem.id);

            onSubmit();

            handleClose();

            showToast("success", "Thành công", "Đã cập nhật đơn nghỉ");

        } catch (error: any) {

            Alert.alert(
                "Lỗi cập nhật",
                error?.error?.message || "Có lỗi xảy ra"
            );
            console.log(error);

        }

    };

    // handle

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
                            {editingItem ? "Chỉnh sửa đơn nghỉ" : "Tạo đơn nghỉ"}
                        </Text>

                        <Pressable onPress={handleClose}>
                            <Ionicons name="close" size={24} />
                        </Pressable>

                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        {isManager && (
                            <AppSelect
                                label="Người nghỉ phép"
                                placeholder="Chọn người nghỉ phép"
                                value={userId}
                                options={users?.map((p: any) => ({
                                    label: p.name,
                                    value: p.id.toString(),
                                }))}
                                onChange={(value) => handleToggleUser(value)}
                                error={errors.userId}

                            />
                        )}


                        <AppSelect
                            label="Loại vắng mặt"
                            placeholder="Chọn loại vắng mặt"
                            value={leaveTypeCategoryUnitId}
                            options={categories?.map((p: any) => ({
                                label: p.displayName,
                                value: p.id.toString(),
                            }))}
                            onChange={setLeaveTypeCategoryUnitId}
                            required
                            error={errors.leaveTypeCategoryUnitId}
                        />

                        {/* {errors.leaveTypeCategoryUnitId &&
                            <Text style={[styles.errorText, { marginTop: -10, marginBottom: 15 }]}>
                                {errors.leaveTypeCategoryUnitId}
                            </Text>
                        } */}

                        <Text style={[styles.label, { marginTop: -5 }]}>Loại thời gian <Text style={styles.required}>*</Text></Text>

                        <View style={styles.radioGroup}>

                            <Pressable
                                style={styles.radioItem}
                                onPress={() => setTimeType(0)}
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
                                onPress={() => setTimeType(1)}
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

                        <DatePickerField
                            label="Chọn ngày bắt đầu"
                            value={startTime}
                            onChange={setStartTime}
                            error={errors.startTime}
                        />

                        {/* {errors.startTime &&
                            <Text style={styles.errorText}>{errors.startTime}</Text>
                        } */}

                        {timeType === 0 && (
                            <>
                                <Text style={styles.label}>Ngày kết thúc <Text style={styles.required}>*</Text></Text>

                                <DatePickerField
                                    label="Chọn ngày kết thúc"
                                    value={endTime}
                                    onChange={setEndTime}
                                    error={errors.endTime}
                                />

                                {/* {errors.endTime &&
                                    <Text style={styles.errorText}>{errors.endTime}</Text>
                                } */}
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
                                            onPress={() => togglePeriod(p.shiftPeriodDto.id)}
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

                                {errors.periods &&
                                    <Text style={styles.errorText}>{errors.periods}</Text>
                                }
                            </>
                        )}

                        <Text style={styles.label}>Lý do nghỉ <Text style={styles.required}>*</Text></Text>

                        <TextInput
                            style={[
                                styles.input,
                                errors.reason && styles.inputError
                            ]}
                            placeholder="Nhập lý do..."
                            value={reason}
                            onChangeText={setReason}
                            multiline
                        />

                        {errors.reason &&
                            <Text style={styles.errorText}>{errors.reason}</Text>
                        }

                        <Text style={styles.label}>Tệp minh chứng</Text>

                        <Pressable
                            style={styles.uploadButton}
                            onPress={handlePickFile}
                        >
                            <Ionicons name="cloud-upload-outline" size={20} color="#6366F1" />
                            <Text style={styles.uploadText}>Chọn tệp</Text>
                        </Pressable>

                        {/* {attachments.map((file, index) => ( */}
                        {attachment && (
                            <View key={attachment.name} style={styles.fileItem}>

                                <Ionicons name="document-outline" size={18} />

                                <Text style={styles.fileName} numberOfLines={1}>
                                    {attachment.name}
                                </Text>

                                <Pressable onPress={() => removeFile()}>
                                    <Ionicons name="close-circle" size={18} color="red" />
                                </Pressable>

                            </View>
                        )}



                        {/* ))} */}

                    </ScrollView>
                    {isManager ? (
                        <View style={styles.actionRow}>
                            <Pressable
                                style={styles.saveEdit}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.submitText}>Tạo mới và Duyệt</Text>
                            </Pressable>
                        </View>
                    ) : editingItem ? (

                        <View style={styles.actionRow}>
                            <Pressable
                                style={styles.saveEdit}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.submitText}>Lưu thông tin</Text>
                            </Pressable>
                        </View>

                    ) : (

                        <View style={styles.actionRow}>

                            <Pressable
                                style={styles.draftButton}
                                onPress={() => handleSubmit("draft")}
                            >
                                <Text style={styles.draftText}>Tạo bản nháp</Text>
                            </Pressable>

                            <Pressable
                                style={styles.submitButton}
                                onPress={() => handleSubmit("submit")}
                            >
                                <Text style={styles.submitText}>Gửi yêu cầu</Text>
                            </Pressable>

                        </View>

                    )}

                </View>

            </View>

        </Modal>

    );
};

export default CreateOrUpdateLeaveRequestModal;
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
        backgroundColor: "#F8FAFC",
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
});