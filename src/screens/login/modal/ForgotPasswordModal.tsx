import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import accountApi from '~/api/accountApi';
import { showToast } from '~/utils/toast';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const ForgotPasswordModal = ({
    visible,
    onClose,
}: Props) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        if (!email.trim()) return;

        try {

            setLoading(true);

            // await onSubmit(email);
            await accountApi.sendPasswordResetCode({
                emailAddress: email
            })

            setEmail('');

            onClose();
            showToast('success', 'Mật khẩu mới đã được gửi về mail của bạn', '');

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <Modal
            visible={visible}
            animationType="fade"
            transparent
        >

            <View style={styles.overlay}>

                <View style={styles.modal}>

                    <Text style={styles.title}>
                        Quên mật khẩu
                    </Text>

                    <Text style={styles.description}>
                        Nhập email để nhận link đặt lại mật khẩu
                    </Text>

                    <TextInput
                        placeholder="Nhập email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />

                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <View style={styles.actions}>

                            <Pressable
                                onPress={onClose}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelText}>
                                    Huỷ
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleSubmit}
                                style={styles.submitBtn}
                            >
                                <Text style={styles.submitText}>
                                    Gửi
                                </Text>
                            </Pressable>

                        </View>
                    )}

                </View>

            </View>

        </Modal>

    );

};

export default ForgotPasswordModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8
    },

    description: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 16
    },

    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12
    },

    cancelBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8
    },

    cancelText: {
        color: '#6B7280',
        fontWeight: '500'
    },

    submitBtn: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8
    },

    submitText: {
        color: '#fff',
        fontWeight: '600'
    }

});