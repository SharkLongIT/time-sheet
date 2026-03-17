import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';

import authApi from '~/api/auth.api';
import { BaseContent } from '~/components/base-screen/BaseContent';
import { useAppColors } from '~/hooks/useAppColors';
import { MainParamList } from '~/navigation/MainNavigator';
import { useAppDispatch } from '~/redux/hooks';
import { RootState } from '~/redux/store';
import { handleGetUser } from '~/thunk/authThunk';
import { showToast } from '~/utils/toast';

const ProfileScreen = () => {

    const navigation =
        useNavigation<NativeStackNavigationProp<MainParamList>>();

    const dispatch = useAppDispatch();
    const auth = useSelector((state: RootState) => state.auth.user);

    const { t } = useTranslation();
    const colors = useAppColors();

    const nameInputRef = useRef<TextInput>(null);

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');

    /* ---------------- SYNC REDUX USER ---------------- */

    useEffect(() => {

        if (!auth) return;

        setUserName(auth.userName ?? '');
        setName(auth.name ?? '');
        setEmailAddress(auth.emailAddress ?? '');

    }, [auth]);

    /* ---------------- SAVE PROFILE ---------------- */

    const onToggleEdit = async () => {

        if (!editing) {

            setEditing(true);

            setTimeout(() => {
                nameInputRef.current?.focus();
            }, 150);

            return;
        }

        try {

            setLoading(true);
            console.log(name)
            const payload = {
                userName,
                name,
                surname: '?',
                emailAddress
            };

            await authApi.updateCurrentUserProfile(payload);

            await dispatch(handleGetUser()).unwrap();

            setEditing(false);

            showToast(
                'success',
                t('profile.updateProfileSuccess'),
                ''
            );

        } catch (error) {

            console.log(error);

            showToast(
                'error',
                'Cập nhật thông tin thất bại',
                ''
            );

        } finally {

            setLoading(false);

        }

    };

    /* ---------------- HEADER BUTTON ---------------- */
    useLayoutEffect(() => {

        navigation.setOptions({

            headerRight: () => (

                <Pressable
                    disabled={loading}
                    onPress={onToggleEdit}
                >
                    <Text
                        style={[
                            styles.textTitle,
                            loading && { opacity: 0.5 }
                        ]}
                    >
                        {editing
                            ? t('common.save')
                            : t('common.edit')}
                    </Text>

                </Pressable>

            )

        });

    }, [
        navigation,
        editing,
        loading,
        name,
        userName,
        emailAddress
    ]);

    /* ---------------- UI ---------------- */

    return (

        <BaseContent>

            <View style={styles.container}>

                {loading && (
                    <ActivityIndicator style={{ marginBottom: 10 }} />
                )}

                <View style={styles.avatarWrap}>

                    <Image
                        source={require('~/assets/images/default-avatar.png')}
                        style={styles.avatar}
                    />

                </View>

                <View
                    style={[
                        styles.card,
                        { backgroundColor: colors.card }
                    ]}
                >

                    {/* USERNAME */}

                    <Text
                        style={[
                            styles.label,
                            { color: colors.textPrimary }
                        ]}
                    >
                        Tên người dùng
                    </Text>

                    <TextInput
                        ref={nameInputRef}
                        value={userName}
                        editable={editing}
                        onChangeText={setUserName}
                        style={[
                            styles.input,
                            !editing && styles.inputDisabled,
                            {
                                backgroundColor: colors.inputBackground,
                                color: colors.textPrimary
                            }
                        ]}
                    />

                    {/* NAME */}

                    <Text
                        style={[
                            styles.label,
                            { color: colors.textPrimary }
                        ]}
                    >
                        Họ và tên
                    </Text>

                    <TextInput
                        value={name}
                        editable={editing}
                        onChangeText={setName}
                        style={[
                            styles.input,
                            !editing && styles.inputDisabled,
                            {
                                backgroundColor: colors.inputBackground,
                                color: colors.textPrimary
                            }
                        ]}
                    />

                    {/* EMAIL */}

                    <Text
                        style={[
                            styles.label,
                            { color: colors.textPrimary }
                        ]}
                    >
                        Email
                    </Text>

                    <TextInput
                        value={emailAddress}
                        editable={false}
                        style={[
                            styles.input,
                            styles.inputDisabled,
                            {
                                backgroundColor: colors.inputBackground,
                                color: colors.textPrimary
                            }
                        ]}
                    />

                </View>

            </View>

        </BaseContent>

    );

};

export default ProfileScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16
    },

    avatarWrap: {
        alignItems: 'center',
        marginBottom: 24
    },

    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E5E7EB'
    },

    card: {
        borderRadius: 16,
        padding: 16
    },

    label: {
        fontSize: 12,
        marginBottom: 6,
        fontWeight: '600'
    },

    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        marginBottom: 16
    },

    inputDisabled: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF'
    },

    textTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF'
    }

});