import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export const useHeaderTitle = (title: string) => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title,
            headerBackTitleVisible: false
        });
    }, [navigation, title]);
};  