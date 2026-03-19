import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { appColors } from '~/utils/constants/appColors';
import { BaseContent } from '~/components/base-screen/BaseContent';
import { useAppColors } from '~/hooks/useAppColors';
import DeviceInfo from "react-native-device-info";

const AboutScreen = () => {
    const { t } = useTranslation();
    const colors = useAppColors();
    const version = DeviceInfo.getVersion();
    return (
        <BaseContent >

            <View style={styles.container}>
                <Image
                    source={require('~/assets/images/logo/app-logo-removebg.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={[styles.appName, { color: colors.textPrimary }]}>
                    TimeSheet
                </Text>

                <Text style={styles.version}>

                    Version: {version}
                </Text>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.text, { color: colors.textPrimary }]}>
                        {t('about.description')}
                    </Text>
                </View>
            </View>
        </BaseContent>
    );
};

export default AboutScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: appColors.background,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        width: 350,
        height: 120,
        marginBottom: 12,
    },
    appName: {
        fontSize: 18,
        fontWeight: '700',
        color: appColors.textPrimary,
    },
    version: {
        fontSize: 13,
        color: appColors.textSecondary,
        marginBottom: 20,
    },
    card: {
        backgroundColor: appColors.card,
        borderRadius: 16,
        padding: 16,
        width: '100%',
        shadowColor: appColors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    text: {
        fontSize: 14,
        lineHeight: 22,
        color: appColors.textPrimary,
        textAlign: 'center',
    },
});
