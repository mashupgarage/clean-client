// src\hooks\useDispenserForm.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { FETCH_STATUS_INTERVAL } from "../config";

export const useDispenserForm = (baseUrl, queryParam, isActive) => {
  const initialFormData = {
    name: "",
    status: "idle",
    is_locked: false,
    post_notifications: false,
    temperature: "",
    thermos_weight: 0,
    weight_small: 0.0,
    weight_large: 0.0,
    cleaner_mode: 0,
    machineStatus: "",
    dispensers: [], // Store dispensers array
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDispenser, setSelectedDispenser] = useState(null); // Store dispenser object
  const [selectedDispenserIndex, setSelectedDispenserIndex] = useState(0); // Track selected dispenser index
  const [cleanMode, setCleanMode] = useState(null);
  const [cleaningInProgress, setCleaningInProgress] = useState(false);
  const [activeCleanMode, setActiveCleanMode] = useState(null); // To track active cleaning mode
  const initialFormDataRef = useRef({});
  const cleaningTimeoutRef = useRef(null); // Store cleaning timeout ID
  const fieldsToUpdatePeriodically = [
    "temperature",
    "thermos_weight",
    "status",
    "post_notifications",
    "is_locked",
  ];
  const [machine, setMachine] = useState({});

  useEffect(() => {
    let initialLoad = true;

    const fetchMachineData = async () => {
      if (!(baseUrl && queryParam)) {
        // console.log("Skipping fetch due to missing parameters");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const machineURL = `http://${baseUrl}/dispenser/select-vm/${queryParam}`;
        // console.log(`Machine URL: ${machineURL}`);

        const response = await axios.get(machineURL);
        const response_data = response.data[0] || {};

        // console.log("Response data: ", response_data);

        if (response_data.dispensers && response_data.dispensers.length > 0) {
          setMachine(response_data);
          const fetchedData = {
            ...response_data.dispensers[selectedDispenserIndex], // Use selected dispenser index
          };

          setSelectedDispenser(
            response_data.dispensers[selectedDispenserIndex]
          );

          console.log("Fetched data: ", fetchedData);

          setFormData((prevFormData) => ({
            ...prevFormData,
            dispensers: response_data.dispensers,
            ...fetchedData,
            machineStatus: response_data.status, // Set machine status
            postNotifications: response_data.post_notifications, // Set post notifications
            isLocked: response_data.is_locked, // Set lock status
          }));

          if (initialLoad) {
            initialFormDataRef.current = fetchedData;
            initialLoad = false;
          } else {
            setFormData((prevFormData) => ({
              ...prevFormData,
              ...Object.fromEntries(
                fieldsToUpdatePeriodically
                  .filter((field) => fetchedData[field] !== undefined)
                  .map((field) => [field, fetchedData[field]])
              ),
              machineStatus: response_data.status, // Update machine status
              postNotifications: response_data.post_notifications, // Update post notifications
              isLocked: response_data.is_locked, // Update lock status
            }));
          }
        } else {
          setError("No data found");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data on mount and when dependencies change
    if (isActive) {
      fetchMachineData();

      // Setup periodic data fetch
      const intervalId = setInterval(fetchMachineData, FETCH_STATUS_INTERVAL);

      // Cleanup interval on component unmount or before re-running the effect
      return () => clearInterval(intervalId);
    }
  }, [baseUrl, queryParam, selectedDispenserIndex, isActive]); // Add isActive as a dependency

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCleanModeChange = async (mode) => {
    if (cleaningInProgress && mode !== 0) return;

    setCleanMode(mode);
    setActiveCleanMode(mode); // Set the active clean mode
    setCleaningInProgress(mode !== 0);

    try {
      await axios.post(`http://${baseUrl}/dispenser/clean/`, {
        dispenser_name: selectedDispenser.name,
        mode,
      });

      console.log(`Cleaning mode set to ${mode}`);

      if (mode !== 0) {
        cleaningTimeoutRef.current = setTimeout(async () => {
          console.log(`Cleaning timeout completed, setting mode to 0`);
          await axios.post(`http://${baseUrl}/dispenser/clean/`, {
            dispenser_name: selectedDispenser.name,
            mode: 0,
          });
          setCleanMode(null);
          setActiveCleanMode(null); // Reset the active clean mode
          setCleaningInProgress(false);
        }, 15000);
      } else {
        console.log(`Cleaning mode set to 0, cleaning stopped`);
        setCleanMode(null);
        setActiveCleanMode(null);
        setCleaningInProgress(false);
        if (cleaningTimeoutRef.current) {
          clearTimeout(cleaningTimeoutRef.current); // Clear the timeout if OFF is clicked
          cleaningTimeoutRef.current = null;
        }
      }
    } catch (error) {
      console.error("Error performing cleaning operation:", error);
      setCleanMode(null);
      setActiveCleanMode(null); // Reset the active clean mode
      setCleaningInProgress(false);
      if (cleaningTimeoutRef.current) {
        clearTimeout(cleaningTimeoutRef.current); // Clear the timeout on error
        cleaningTimeoutRef.current = null;
      }
    }
  };

  const handleLockedSwitchChange = (event) => {
    const newValue = event.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      isLocked: newValue,
    }));

    // Update the backend with the new locked status
    const updateLockedStatus = async () => {
      if (!(baseUrl && queryParam)) {
        return;
      }

      const dataToSend = {
        is_locked: newValue,
        // if newValue is true, set status to error, otherwise idle
        status: newValue ? "error" : "idle",
      };

      try {
        const machineURL = `http://${baseUrl}/vendingmachines/${machine.id}/`;
        const response = await axios.patch(machineURL, dataToSend);
        console.log("Locked status updated:", response.data);
      } catch (error) {
        console.error("Error updating locked status:", error);
      }
    };

    updateLockedStatus();
  };

  const handleNotificationsToggle = async (event) => {
    const newNotificationsStatus = event.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      postNotifications: newNotificationsStatus,
    }));

    // Update the backend (Django DRF) with the new notifications status
    const updateNotificationsStatus = async () => {
      if (!(baseUrl && queryParam)) {
        return;
      }

      const dataToSend = {
        post_notifications: newNotificationsStatus,
      };

      try {
        const machineURL = `http://${baseUrl}/vendingmachines/${machine.id}/`;
        const response = await axios.patch(machineURL, dataToSend);
        console.log("Notifications status updated:", response.data);
      } catch (error) {
        console.error("Error updating notifications status:", error);
      }
    };

    updateNotificationsStatus();
  };

  const handleHeaterToggle = async (event) => {
    const newHeaterStatus = event.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      heater_status: newHeaterStatus,
    }));

    try {
      await axios.post(`http://${baseUrl}/dispenser/set-heater/`, {
        dispenser_name: selectedDispenser.name,
        heater_status: newHeaterStatus,
      });
      console.log(`Heater status set to ${newHeaterStatus}`);
    } catch (error) {
      console.error("Failed to toggle heater status:", error);
    }
  };

  const handleTempRegulationToggle = async (event) => {
    const newTempRegulation = event.target.checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      temperature_regulation: newTempRegulation,
    }));

    try {
      await axios.post(`http://${baseUrl}/dispenser/set-temp-regulation/`, {
        dispenser_name: selectedDispenser.name,
        temperature_regulation: newTempRegulation,
      });
    } catch (error) {
      console.error("Failed to toggle temperature regulation:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialFormDataRef.current[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (selectedFile) {
      formDataToSend.append("drink_image", selectedFile);
    }

    try {
      const URL = `http://${baseUrl}/dispensers/${formData.id}/`;
      await axios.patch(URL, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Fetch latest data to update the form
      setSelectedFile(null); // Reset selected file
    } catch (err) {
      console.error(err);
      setError("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchChange = (event) => {
    const dispenserIndex = event.target.checked ? 1 : 0;
    setSelectedDispenserIndex(dispenserIndex); // Update selected dispenser index
    if (formData.dispensers && formData.dispensers[dispenserIndex]) {
      setSelectedDispenser(formData.dispensers[dispenserIndex]);
    } else {
      setSelectedDispenser(null);
    }
    if (cleaningTimeoutRef.current) {
      clearTimeout(cleaningTimeoutRef.current);
      setCleanMode(null);
      setActiveCleanMode(null); // Reset the active clean mode
      setCleaningInProgress(false);
      cleaningTimeoutRef.current = null;
    }
  };

  return {
    formData,
    handleChange,
    handleCleanModeChange, // Added for clean mode button handling
    handleSubmit,
    isLoading,
    isSubmitting,
    error,
    handleSwitchChange,
    selectedDispenser,
    cleanMode,
    cleaningInProgress,
    activeCleanMode, // Return the active clean mode
    handleLockedSwitchChange, // Return the locked switch change handler
    handleHeaterToggle, // Return the heater toggle handler
    handleTempRegulationToggle, // Return the temperature regulation toggle handler
    handleNotificationsToggle, // Return the notifications toggle handler
  };
}
