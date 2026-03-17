import { Alert } from "react-native";
import { goBack } from "~/helper/navigationService";

export const alertError = (err: any) => {

    const serverMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        err?.error?.message;

    Alert.alert(
        "Lỗi",
        serverMessage || "Đã xảy ra lỗi. Vui lòng thử lại!",
        [
            {
                text: "OK",
                onPress: goBack
            }
        ]
    );
};