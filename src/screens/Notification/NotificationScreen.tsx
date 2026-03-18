// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//     View,
//     Text,
//     FlatList,
//     StyleSheet,
//     RefreshControl,
//     Animated,
//     ActivityIndicator,
//     Pressable,
//     Alert,
// } from "react-native";
// import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
// import { SafeAreaView } from "react-native-safe-area-context";
// import notiApi from "~/api/noti.api";
// import { FilterLinesIcon } from "~/assets/icons";
// import HeaderMain from "~/components/layout/base-header/header-main";
// import NotificationSkeleton from "~/components/skeleton-base/LoadingSkeletonNotification";
// import { useAppColors } from "~/hooks/useAppColors";
// import { useNotifications } from "~/hooks/useNotifications";
// import { MainParamList } from "~/navigation/MainNavigator";
// import { alertError } from "~/utils/alertMessageServer";
// import { formatDateRender } from "~/utils/format/format";
// import getNotiColor from "~/utils/helper/color-noti";
// import { showToast } from "~/utils/toast";

// const NotificationScreen = () => {
//     const {
//         items,
//         loading,
//         refreshing,
//         opacity,
//         onRefresh,
//         loadMore,
//         loadingMore,
//         toggleFilter,
//         fetchNotifications
//     } = useNotifications();
//     const colors = useAppColors();
//     const { t } = useTranslation();

//     const renderLeftActions = () => (
//         <View style={[styles.swipeAction, styles.readAction]}>
//             <Text style={styles.swipeText}>{t("notification.read")}</Text>
//         </View>
//     );

//     const renderRightActions = () => (
//         <View style={[styles.swipeAction, styles.deleteAction]}>
//             <Text style={styles.swipeText}>{t("notification.delete")}</Text>
//         </View>
//     );
//     const setAllAsRead = () => {
//         Alert.alert(
//             "Thông báo",
//             "Bạn có muốn đánh dấu tất cả là đã đọc?",
//             [
//                 {
//                     text: "Hủy",
//                     style: "cancel",
//                 },
//                 {
//                     text: "Đồng ý",
//                     onPress: async () => {
//                         try {
//                             await notiApi.setAllNotificationsAsRead();
//                             showToast('success', 'Đã đánh dấu tất cả là đã đọc', '');
//                             fetchNotifications();
//                         } catch (error) {
//                             console.log(error);
//                             alertError(error)
//                         }

//                     },
//                 },
//             ]
//         );
//     };

//     const renderItem = ({ item }: any) => {
//         const notiColor = getNotiColor(item.title, colors);

//         return (
//             <GestureHandlerRootView>
//                 <Swipeable
//                     // renderLeftActions={renderLeftActions}
//                     renderRightActions={renderRightActions}
//                     overshootRight={false}
//                     overshootLeft={false}
//                     onSwipeableRightOpen={() => {
//                         Alert.alert(
//                             "Xóa thông báo",
//                             "Bạn có chắc muốn xóa thông báo này?",
//                             [
//                                 {
//                                     text: "Hủy",
//                                     style: "cancel",
//                                 },
//                                 {
//                                     text: "Xóa",
//                                     style: "destructive",
//                                     onPress: async () => {
//                                         try {
//                                             // console.log("DELETE", item.id);
//                                             await notiApi.deleteNoti(item.id)
//                                             showToast('success', 'Xóa thành công', '');
//                                             fetchNotifications();
//                                         } catch (error) {
//                                             alertError(error);

//                                         }

//                                     },
//                                 },
//                             ]
//                         );
//                     }}
//                 // onSwipeableLeftOpen={() => {
//                 //     // TODO: handle mark as read
//                 //     // console.log("READ", item.id);
//                 // }}
//                 >
//                     <View
//                         style={[styles.card, {
//                             backgroundColor: colors.card,
//                             borderLeftColor: notiColor.border,
//                             borderLeftWidth: 4,
//                         },
//                         ]}
//                     >
//                         {/* DOT */}
//                         <View style={[styles.dot, { backgroundColor: notiColor.dot }]} />
//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.title, { color: colors.textPrimary }]}>
//                                 {item.title}
//                             </Text>
//                             <Text style={[styles.content, { color: colors.textSecondary },]}>
//                                 {item.content}
//                             </Text>
//                             <Text style={[styles.time, { color: colors.textSecondary },]} >
//                                 {formatDateRender(item.time, "dd/MM/yyyy")}
//                             </Text>
//                         </View>
//                     </View>
//                 </Swipeable>
//             </GestureHandlerRootView>
//         );
//     };


//     return (
//         <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
//             <HeaderMain title={t("notification.title")} />
//             <Pressable style={styles.markAllBtn} onPress={() => setAllAsRead()}>
//                 <Text style={styles.markAllText}>
//                     Đánh dấu tất cả là đã đọc
//                 </Text>
//             </Pressable>

//             {loading ? (
//                 // <NotificationSkeleton />
//                 <ActivityIndicator color={colors.primary} />
//             ) : (
//                 <Animated.View style={{ flex: 1, opacity }}>
//                     <FlatList
//                         data={items}
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderItem}
//                         contentContainerStyle={{ padding: 16 }}
//                         refreshControl={
//                             <RefreshControl
//                                 refreshing={refreshing}
//                                 onRefresh={onRefresh}
//                             />
//                         }
//                         onEndReached={loadMore}
//                         onEndReachedThreshold={0.3}
//                         ListFooterComponent={
//                             loadingMore ? (
//                                 <View style={{ paddingVertical: 16 }}>
//                                     <ActivityIndicator color={colors.primary} />
//                                 </View>
//                             ) : null
//                         }
//                     />
//                 </Animated.View>
//             )}
//         </SafeAreaView>
//     );
// };

// export default NotificationScreen;

// export const styles = StyleSheet.create({
//     safe: {
//         flex: 1,
//         backgroundColor: "#F5F7FA",
//         paddingBottom: 60
//     },

//     card: {
//         flexDirection: "row",
//         padding: 14,
//         borderRadius: 12,
//         backgroundColor: "#fff",
//         marginBottom: 12,
//     },

//     unreadCard: {
//         backgroundColor: "#EEF2FF",
//     },

//     dot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: "#4F46E5",
//         marginTop: 6,
//         marginRight: 10,
//     },

//     title: {
//         fontSize: 15,
//         fontWeight: "600",
//         color: "#111827",
//     },

//     content: {
//         fontSize: 13,
//         color: "#6B7280",
//         marginTop: 2,
//     },

//     time: {
//         fontSize: 11,
//         color: "#9CA3AF",
//         marginTop: 6,
//     },

//     emptyWrap: {
//         alignItems: "center",
//         marginTop: 80,
//     },

//     emptyText: {
//         color: "#9CA3AF",
//         fontSize: 14,
//     },

//     logoutBtn: {
//         margin: 16,
//         borderRadius: 12,
//         paddingVertical: 14,
//         alignItems: "center",
//         backgroundColor: "#EF4444",
//     },

//     logoutText: {
//         color: "#fff",
//         fontSize: 15,
//         fontWeight: "600",
//     },
//     swipeAction: {
//         justifyContent: "center",
//         alignItems: "center",
//         width: 90,
//         marginBottom: 12,
//         borderRadius: 12,
//     },

//     readAction: {
//         backgroundColor: "#3B82F6", // blue
//         padding: 10
//     },

//     deleteAction: {
//         backgroundColor: "#EF4444", // red
//     },

//     swipeText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "600",
//     },
//     markAllBtn: {
//         alignSelf: "flex-end",
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         backgroundColor: "#EFF6FF",
//         borderRadius: 8,
//         marginBottom: 10,
//     },

//     markAllText: {
//         fontSize: 13,
//         color: "#2563EB",
//         fontWeight: "600",
//     },
// });

import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    Animated,
    ActivityIndicator,
    Pressable,
    Alert,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import notiApi from "~/api/noti.api";
import HeaderMain from "~/components/layout/base-header/header-main";
import { useAppColors } from "~/hooks/useAppColors";
import { useNotifications } from "~/hooks/useNotifications";
import { alertError } from "~/utils/alertMessageServer";
import { formatDateRender } from "~/utils/format/format";
import getNotiColor from "~/utils/helper/color-noti";
import { showToast } from "~/utils/toast";

const NotificationScreen = () => {

    const {
        items,
        loading,
        refreshing,
        opacity,
        onRefresh,
        loadMore,
        loadingMore,
        fetchNotifications,
        totalUnRead
    } = useNotifications();

    const colors = useAppColors();
    const { t } = useTranslation();

    /* =========================
       MARK ALL READ
    ========================= */

    const setAllAsRead = () => {
        Alert.alert(
            "Thông báo",
            "Bạn có muốn đánh dấu tất cả là đã đọc?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            await notiApi.setAllNotificationsAsRead();
                            showToast("success", "Đã đánh dấu tất cả là đã đọc", "");
                            fetchNotifications();
                        } catch (error) {
                            alertError(error);
                        }
                    },
                },
            ]
        );
    };

    /* =========================
       DELETE NOTIFICATION
    ========================= */

    const handleDelete = (id: string) => {

        Alert.alert(
            "Xóa thông báo",
            "Bạn có chắc muốn xóa thông báo này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await notiApi.deleteNoti(id);
                            showToast("success", "Xóa thành công", "");
                            fetchNotifications();
                        } catch (error) {
                            alertError(error);
                        }
                    },
                },
            ]
        );
    };

    /* =========================
       MARK READ
    ========================= */

    const markAsRead = async (id: string) => {
        try {
            // await notiApi.setNotificationAsRead(id);
            fetchNotifications();
        } catch (error) {
            alertError(error);
        }
    };

    /* =========================
       RENDER ITEM
    ========================= */

    const renderItem = ({ item }: any) => {

        //  const swipeRef = useRef<Swipeable>(null);
        const notiColor = getNotiColor(item.title, colors);
        const isUnread = item.state === 0;

        const renderLeftActions = () => (
            <View style={[styles.swipeAction, styles.readAction]}>
                <Text style={styles.swipeText}>
                    {t("notification.read")}
                </Text>
            </View>
        );

        const renderRightActions = () => (
            <View style={[styles.swipeAction, styles.deleteAction]}>
                <Text style={styles.swipeText}>
                    {t("notification.delete")}
                </Text>
            </View>
        );

        return (

            <GestureHandlerRootView>

                {/* <Swipeable
                    //ref={swipeRef}
                    renderLeftActions={isUnread ? renderLeftActions : undefined}
                    renderRightActions={renderRightActions}
                    overshootRight={false}
                    overshootLeft={false}

                    onSwipeableLeftOpen={() => {
                        //  swipeRef.current?.close();
                        markAsRead(item.id);
                    }}

                    onSwipeableRightOpen={() => {
                        //swipeRef.current?.close();
                        handleDelete(item.id);
                    }}
                > */}

                <View
                    style={[
                        styles.card,
                        isUnread && styles.unreadCard,
                        {
                            borderLeftColor: notiColor.border,
                        },
                    ]}
                >

                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: notiColor.dot },
                        ]}
                    />

                    <View style={{ flex: 1 }}>

                        <Text
                            style={[
                                styles.title,
                                isUnread && styles.unreadTitle,
                            ]}
                        >
                            {item.title === "ConfirmSuccess"
                                ? "Xác nhận thành công"
                                : item.title}
                        </Text>

                        <Text style={styles.content}>
                            {item.content}
                        </Text>

                        <Text style={styles.time}>
                            {formatDateRender(item.time, "dd/MM/yyyy")}
                        </Text>

                    </View>

                </View>

                {/* </Swipeable> */}

            </GestureHandlerRootView>
        );
    };

    /* =========================
       UI
    ========================= */

    return (

        <SafeAreaView
            style={[styles.safe, { backgroundColor: colors.background }]}
        >

            <HeaderMain title={t("notification.title")} />
            {totalUnRead > 0 && (
                <Pressable
                    style={styles.markAllBtn}
                    onPress={setAllAsRead}
                >
                    <Text style={styles.markAllText}>
                        Đánh dấu tất cả là đã đọc
                    </Text>
                </Pressable>
            )}


            {loading ? (

                <ActivityIndicator
                    color={colors.primary}
                    style={{ marginTop: 20 }}
                />

            ) : (

                <Animated.View style={{ flex: 1, opacity }}>

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 16 }}

                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }

                        onEndReached={loadMore}
                        onEndReachedThreshold={0.3}

                        ListFooterComponent={
                            loadingMore ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator
                                        color={colors.primary}
                                    />
                                </View>
                            ) : null
                        }
                    />

                </Animated.View>

            )}

        </SafeAreaView>
    );
};

export default NotificationScreen;
export const styles = StyleSheet.create({

    safe: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        paddingBottom: 60
    },

    card: {
        flexDirection: "row",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        marginBottom: 12,
        borderLeftWidth: 4,
    },

    unreadCard: {
        backgroundColor: "#EEF2FF",
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
        marginRight: 10,
    },

    title: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },

    unreadTitle: {
        fontWeight: "700",
    },

    content: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    time: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 6,
    },

    swipeAction: {
        justifyContent: "center",
        alignItems: "center",
        width: 90,
        marginBottom: 12,
        borderRadius: 12,
    },

    readAction: {
        backgroundColor: "#3B82F6",
    },

    deleteAction: {
        backgroundColor: "#EF4444",
    },

    swipeText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },

    markAllBtn: {
        alignSelf: "flex-end",
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#EFF6FF",
        borderRadius: 8,
        marginRight: 16,
        marginBottom: 10,
    },

    markAllText: {
        fontSize: 13,
        color: "#2563EB",
        fontWeight: "600",
    },

});