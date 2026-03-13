import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import dayjs from 'dayjs';

const DateRangePicker = ({
  label = 'Thời gian thu thập đến ngày',
  onChange,
  fromDate,
  toDate,
  require = true
}: {
  label?: string;
  onChange?: ({ from, to }: { from?: Date; to?: Date }) => void;
  fromDate?: Date | null;
  toDate?: Date | null;
  require?: boolean
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();

  useEffect(() => {
    if (fromDate && toDate) {
      setSelectedStartDate(fromDate);
      setSelectedEndDate(toDate);
    }
  }, [fromDate, toDate]);

  const handleConfirm = () => {
    setVisible(false);
    onChange?.({ from: selectedStartDate, to: selectedEndDate });
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {require &&
            (<Text style={{ color: 'red' }}>*</Text>)}
        </Text>
      )}

      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={styles.inputText}>
          {selectedStartDate && selectedEndDate
            ? `${dayjs(selectedStartDate).format('DD/MM/YYYY')} - ${dayjs(
              selectedEndDate,
            ).format('DD/MM/YYYY')}`
            : 'Từ ngày - đến ngày'}
        </Text>
      </TouchableOpacity>

      {/* Modal chọn ngày */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <CalendarPicker
              allowRangeSelection={true}
              selectedStartDate={selectedStartDate || undefined}
              selectedEndDate={selectedEndDate || undefined}
              onDateChange={(date, type) => {
                if (type === 'START_DATE') {
                  setSelectedStartDate(date);
                  setSelectedEndDate(undefined);
                } else {
                  setSelectedEndDate(date);
                }
              }}
              weekdays={['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']}
              months={[
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
              ]}
              previousTitle="Trước"
              nextTitle="Sau"
              todayBackgroundColor="#3B82F6"
              selectedDayColor="#e97d34"
              selectedDayTextColor="#fff"
              todayTextStyle={{ color: '#fff' }}
            />

            <View style={styles.actions}>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ccc' }]}
                onPress={() => setVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#89d9f1ff' }]}
                onPress={() => {
                  setSelectedStartDate(undefined);
                  setSelectedEndDate(undefined);
                }

                }
              >
                <Text>Làm mới</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#e97d34' }]}
                onPress={handleConfirm}
              >
                <Text style={{ color: '#fff' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  inputText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '95%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default DateRangePicker;
