import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionModalContextType {
    showModal: () => void;
    hideModal: () => void;
}

const ActionModalContext = createContext<ActionModalContextType | undefined>(undefined);

export const useActionModal = () => {
    const context = useContext(ActionModalContext);
    if (!context) {
        throw new Error('useActionModal must be used within ActionModalProvider');
    }
    return context;
};

interface ActionModalProviderProps {
    children: ReactNode;
}

export const ActionModalProvider: React.FC<ActionModalProviderProps> = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const handleLostPress = () => {
        hideModal();
        router.push('/report-missing');
    };

    const handleFoundPress = () => {
        hideModal();
        router.push('/report-found');
    };

    return (
        <ActionModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={hideModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bạn muốn làm gì ?</Text>

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleLostPress}
                            >
                                <Text style={styles.buttonText}>Báo cáo mất đồ</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleFoundPress}
                            >
                                <Text style={styles.buttonText}>Báo cáo nhặt đồ</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={hideModal}
                        >
                            <MaterialIcons name="close" size={24} color="#484C52" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ActionModalContext.Provider>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 24,
    },
    buttonsContainer: {
        gap: 16,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#2B6CB0',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        alignSelf: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F7FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
});
