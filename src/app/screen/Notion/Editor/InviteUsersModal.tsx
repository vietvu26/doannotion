import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon } from '@ui-kitten/components';
import TextCM from '../../../components/Text';
import Color from '../../../../constants/Color';
import { displayLocalNotification } from './notificationService';

type InviteUsersModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onInvite: (emails: string[], permission: 'full' | 'comment' | 'view') => void;
};

const InviteUsersModal: React.FC<InviteUsersModalProps> = ({
  isVisible,
  onClose,
  onInvite,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showPermissionDropdown, setShowPermissionDropdown] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<'full' | 'comment' | 'view'>('full');

  // Permission options
  const permissionOptions = [
    { key: 'full' as const, label: 'Truy cập đầy đủ' },
    { key: 'comment' as const, label: 'Có thể bình luận' },
    { key: 'view' as const, label: 'Có thể xem' },
  ];

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setSearchText('');
      setSelectedEmails([]);
      setShowPermissionDropdown(false);
      setSelectedPermission('full');
    }
  }, [isVisible]);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Check if current input is a valid email
  const currentEmail = searchText.trim();
  const isCurrentEmailValid = currentEmail.length > 0 && isValidEmail(currentEmail);
  const isEmailAlreadySelected = isCurrentEmailValid && selectedEmails.includes(currentEmail);

  // Handle text change
  const handleTextChange = (text: string) => {
    setSearchText(text);
  };

  // Add email to selected list
  const handleSelectUser = () => {
    const email = currentEmail;
    if (isCurrentEmailValid && !isEmailAlreadySelected) {
      setSelectedEmails([...selectedEmails, email]);
      setSearchText(''); // Clear input after adding
    }
  };

  // Remove email from selected list
  const handleRemoveEmail = (emailToRemove: string) => {
    setSelectedEmails(selectedEmails.filter((email) => email !== emailToRemove));
  };

  // Handle submit - invite all selected users
  const handleSubmit = () => {
    if (selectedEmails.length > 0) {
      onInvite(selectedEmails, selectedPermission);
    }
  };

  // Handle permission selection
  const handleSelectPermission = (permission: 'full' | 'comment' | 'view') => {
    setSelectedPermission(permission);
    setShowPermissionDropdown(false);
  };

  // Get current permission label
  const getPermissionLabel = () => {
    const option = permissionOptions.find((opt) => opt.key === selectedPermission);
    return option ? option.label : 'Truy cập đầy đủ';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: Color.Background,
        }}
      >
        <TouchableOpacity onPress={onClose} style={{ minWidth: 60 }}>
          <TextCM
            style={{
              fontSize: 16,
              color: Color.add,
              fontWeight: '500',
            }}
          >
            Hủy
          </TextCM>
        </TouchableOpacity>
        <TextCM
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Color.colorText,
            flex: 1,
            textAlign: 'center',
          }}
        >
          Mời người dùng
        </TextCM>
        <TouchableOpacity 
          onPress={() => {
            handleSubmit();
            
          }}
          style={{ minWidth: 60, alignItems: 'flex-end' }}
          disabled={selectedEmails.length === 0}
        >
          <TextCM
            style={{
              fontSize: 16,
              color: selectedEmails.length > 0 ? Color.add : Color.Text055,
              fontWeight: '600',
            }}
          >
            Mời
          </TextCM>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Selected Emails List */}
        {selectedEmails.length > 0 && (
          <View style={styles.selectedEmailsContainer}>
            {selectedEmails.map((email, index) => (
              <View key={index} style={styles.selectedEmailBox}>
                <TextCM style={styles.selectedEmailText} numberOfLines={1}>
                  {email}
                </TextCM>
                <TouchableOpacity
                  onPress={() => handleRemoveEmail(email)}
                  style={styles.removeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name="close-outline"
                    width={16}
                    height={16}
                    fill={Color.Text055}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Search Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm email, tên hoặc nhóm"
            placeholderTextColor={Color.Text055}
            value={searchText}
            onChangeText={handleTextChange}
            autoFocus={selectedEmails.length === 0}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Permission Level Section */}
        <View style={styles.permissionSection}>
          <TextCM style={styles.permissionLabel}>Cấp độ quyền hạn</TextCM>
          <View style={styles.permissionRowContainer}>
            <TouchableOpacity 
              style={styles.permissionRow}
              onPress={() => setShowPermissionDropdown(!showPermissionDropdown)}
            >
              <TextCM style={styles.permissionText}>{getPermissionLabel()}</TextCM>
              <Icon
                name={showPermissionDropdown ? "chevron-up-outline" : "chevron-down-outline"}
                width={20}
                height={20}
                fill={Color.Text055}
              />
            </TouchableOpacity>
            {showPermissionDropdown && (
              <View style={styles.dropdownList}>
                {permissionOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.dropdownOption,
                      selectedPermission === option.key && styles.dropdownOptionSelected,
                      index === permissionOptions.length - 1 && styles.dropdownOptionLast,
                    ]}
                    onPress={() => handleSelectPermission(option.key)}
                  >
                    <TextCM
                      style={[
                        styles.dropdownOptionText,
                        selectedPermission === option.key && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </TextCM>
                    {selectedPermission === option.key && (
                      <Icon
                        name="checkmark-outline"
                        width={20}
                        height={20}
                        fill={Color.add}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Select User Section - Show when email is valid and not already selected */}
        {isCurrentEmailValid && !isEmailAlreadySelected && (
          <View style={styles.selectUserSection}>
            <TextCM style={styles.selectUserLabel}>Chọn người dùng</TextCM>
            <TouchableOpacity 
              style={styles.selectedUserRow}
              onPress={handleSelectUser}
            >
              <Icon
                name="email-outline"
                width={20}
                height={20}
                fill={Color.add}
                style={styles.emailIcon}
              />
              <TextCM style={styles.selectedUserEmail} numberOfLines={1}>
                {currentEmail}
              </TextCM>
              <Icon
                name="chevron-right-outline"
                width={20}
                height={20}
                fill={Color.Text055}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  selectedEmailsContainer: {
    marginBottom: 16,
  },
  selectedEmailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.Background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    minHeight: 40,
  },
  selectedEmailText: {
    fontSize: 14,
    color: Color.colorText,
    flex: 1,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: Color.Background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Color.colorText,
    minHeight: 40,
  },
  permissionSection: {
    marginTop: 8,
    zIndex: 10,
  },
  permissionLabel: {
    fontSize: 12,
    color: Color.Text055,
    marginBottom: 12,
    fontWeight: '500',
  },
  permissionRowContainer: {
    position: 'relative',
    zIndex: 10,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Color.Background,
    borderRadius: 8,
  },
  permissionText: {
    fontSize: 14,
    color: Color.colorText,
    fontWeight: '500',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: Color.White,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.Background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  selectUserSection: {
    marginTop: 24,
  },
  selectUserLabel: {
    fontSize: 12,
    color: Color.Text055,
    marginBottom: 12,
    fontWeight: '500',
  },
  selectedUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Color.Background,
    borderRadius: 8,
  },
  emailIcon: {
    marginRight: 12,
  },
  selectedUserEmail: {
    fontSize: 14,
    color: Color.colorText,
    fontWeight: '500',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: Color.Background,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionSelected: {
    backgroundColor: Color.Background,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: Color.colorText,
    fontWeight: '400',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    fontWeight: '600',
    color: Color.add,
  },
});

export default InviteUsersModal;

