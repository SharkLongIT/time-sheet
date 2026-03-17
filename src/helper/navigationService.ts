import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const goBack = () => {
    if (navigationRef.isReady()) {
        navigationRef.goBack();
    }
};