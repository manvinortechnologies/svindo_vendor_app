import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MainContainer from "../CommonComponent/MainContainer";
import Headerwithback from "./Headerwithback";
import CustomButton from "../CommonComponent/CustomeButton";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import { convert24To12Hour, convertTo24Hour } from "../utils/dateandTime";
import Loading from "../CommonComponent/Loading";
import api from "../services/api/api";
import { API_ROUTES } from "../constants/api-routes.constants";
import Toast from "react-native-toast-message";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const StoreWorkingHours = () => {
  const [hours, setHours] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = {
        isOpen: true,
        openTime: "",
        closeTime: "",
      };
      return acc;
    }, {} as { [key: string]: { isOpen: boolean; openTime: string; closeTime: string } })
  );

  const [timePicker, setTimePicker] = useState<{
    day: string | null;
    field: "openTime" | "closeTime" | null;
    show: boolean;
  }>({
    day: null,
    field: null,
    show: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showTimePicker = (day: string, field: "openTime" | "closeTime") => {
    setTimePicker({ day, field, show: true });
  };
  useEffect(() => {
    fetchWorkingData();
  }, []);

  const fetchWorkingData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.storeWorkingHour);
      if (res.data.length > 0) {
        const workingHours = transformWorkingHoursFromBE(res.data);
        console.log("datttaaaa->", workingHours);
        setHours(workingHours);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const transformWorkingHoursFromBE = (data: any[]) => {
    try {
      const formatted: {
        [key: string]: { isOpen: boolean; openTime: string; closeTime: string };
      } = {};

      data.map((item) => {
        const dayKey = item.day.charAt(0).toUpperCase() + item.day.slice(1); // "sunday" → "Sunday"

        formatted[dayKey] = {
          isOpen: item.is_open,
          openTime: item.open_time,
          closeTime: item.close_time,
        };
      });

      return formatted;
    } catch (error) {
      console.log(error, "formatting and listing error");
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setTimePicker((prev) => ({ ...prev, show: false }));
    }

    if (selectedTime && timePicker.day && timePicker.field) {
      const formatted = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setHours((prev) => ({
        ...prev,
        [timePicker.day!]: {
          ...prev[timePicker.day!],
          [timePicker.field!]: formatted,
        },
      }));
    }
  };

  const handleToggle = (day: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = Object.entries(hours).map(([day, value]) => ({
        day: day,
        open_time: convertTo24Hour(value.openTime),
        close_time: convertTo24Hour(value.closeTime),
        is_open: value.isOpen,
      }));

      const res = await api.post(API_ROUTES.storeWorkingHourBulk, payload);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Store timing has been successfully updated.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update store timing",
      });
    } finally {
      setIsLoading(false);
    }

    // Send payload to backend

    // Add your API call here
  };

  console.log(hours, "hours");

  return (
    <MainContainer>
      <View style={styles.container}>
        <Headerwithback title="Store Working Hours" />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Note :</Text>
            <Text style={styles.noteText}>
              This timings will be used to automatically open/close the shop
              working status on svindo app and instant delivery orders.
            </Text>
          </View>

          {daysOfWeek.map((day) => (
            <View key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayText}>{day}</Text>
                <Text style={styles.openText}>Open</Text>
                <CustomSwitch
                  value={hours[day].isOpen}
                  onValueChange={() => handleToggle(day)}
                />
              </View>

              {hours[day].isOpen && (
                <View style={styles.timeRow}>
                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => showTimePicker(day, "openTime")}
                  >
                    <Text style={styles.timeText}>
                      {hours[day].openTime || "00:00 am"}
                    </Text>
                    {/* <Text style={styles.fixedLabel}>AM</Text> */}
                  </TouchableOpacity>

                  <Text style={styles.dash}>-</Text>

                  <TouchableOpacity
                    style={styles.timeBox}
                    onPress={() => showTimePicker(day, "closeTime")}
                  >
                    <Text style={styles.timeText}>
                      {hours[day].closeTime || "00:00 pm"}
                    </Text>
                    {/* <Text style={styles.fixedLabel}>PM</Text> */}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          <CustomButton title="SAVE" onPress={handleSubmit} />
        </ScrollView>
        <Loading visible={isLoading} />

        {/* Time Picker */}
        {timePicker.show && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}
      </View>
    </MainContainer>
  );
};

export default StoreWorkingHours;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 10,
  },
  noteBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  noteLabel: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  noteText: {
    fontSize: 13,
    color: "#555",
  },
  dayCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    color: "#000",
  },
  openText: {
    fontSize: 13,
    color: "#000",
    marginRight: 10,
    fontWeight: "400",
  },
  timeRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    width: "60%",
  },
  timeBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
    backgroundColor: "#FFEBCB",
  },
  timeText: {
    fontSize: 14,
    color: "#000",
  },
  fixedLabel: {
    fontSize: 14,
    color: "#000",
    marginLeft: 6,
  },
  dash: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 4,
  },
});
