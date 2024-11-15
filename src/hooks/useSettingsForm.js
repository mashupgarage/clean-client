// src\hooks\useSettingsForm.js
import { useEffect, useState } from "react";
import axios from "axios";

const initialMachineFormData = {
  font_name: "Arial", // Default value
  background_image: null,
  pin_code: "",
};

const initialDispenserFormData = {
  name: "",
  target_temperature: "",
  temperature_tolerance: "",
  minimum_thermos_weight: "",
  // empty_thermos_weight: "",
  drink_name: "",
  drink_name2: "",
  price_small: "",
  price_large: "",
  dispense_time_small: "",
  dispense_time_large: "",
  weight_small: "",
  weight_large: "",
  SKU: "",
  drink_image: null,
};

export const useSettingsForm = (baseUrl, queryParam, activeTab) => {
  const [machineFormData, setMachineFormData] = useState({
    ...initialMachineFormData,
  });
  const [dispenserFormData, setDispenserFormData] = useState({
    ...initialDispenserFormData,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMachineFile, setSelectedMachineFile] = useState(null);
  const [selectedDispenserFile, setSelectedDispenserFile] = useState(null);

  const [machine, setMachine] = useState({});
  const [selectedDispenserIndex, setSelectedDispenserIndex] = useState(0);

  const fetchData = async () => {
    if (!(baseUrl && queryParam)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const machineURL = `http://${baseUrl}/vendingmachines/${queryParam}`;
      const response = await axios.get(machineURL);
      const data = response.data[0]; // Assuming the response is an array

      // console.log("Data: ", data);

      if (data) {
        setMachine(data);
        setMachineFormData({
          font_name: data.font_name,
          background_image: data.background_image,
          pin_code: data.pin_code,
        });

        if (data.dispensers && data.dispensers.length > 0) {
          const dispenserData = data.dispensers[selectedDispenserIndex];
          setDispenserFormData({
            name: dispenserData.name,
            target_temperature: dispenserData.target_temperature,
            temperature_tolerance: dispenserData.temperature_tolerance,
            minimum_thermos_weight: dispenserData.minimum_thermos_weight,
            // empty_thermos_weight: dispenserData.empty_thermos_weight,
            drink_name: dispenserData.drink_name,
            drink_name2: dispenserData.drink_name2,
            price_small: dispenserData.price_small,
            price_large: dispenserData.price_large,
            dispense_time_small: dispenserData.dispense_time_small,
            dispense_time_large: dispenserData.dispense_time_large,
            weight_small: dispenserData.weight_small,
            weight_large: dispenserData.weight_large,
            SKU: dispenserData.SKU,
            drink_image: dispenserData.drink_image,
          });
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

  useEffect(() => {
    fetchData();
  }, [baseUrl, queryParam, selectedDispenserIndex]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchData();
    }
  }, [activeTab]);

  const handleMachineChange = (event) => {
    const { name, value, checked, type } = event.target;
    setMachineFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDispenserChange = (event) => {
    const { name, value, checked, type } = event.target;
    setDispenserFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMachineImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedMachineFile(event.target.files[0]);
    }
  };

  const handleDispenserImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedDispenserFile(event.target.files[0]);
    }
  };

  const handleMachineSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.keys(machineFormData).forEach((key) => {
      if (key !== "background_image") {
        formDataToSend.append(key, machineFormData[key]);
      }
    });

    if (selectedMachineFile) {
      formDataToSend.append("background_image", selectedMachineFile);
    }

    try {
      const machineURL = `http://${baseUrl}/vendingmachines/${machine.id}/`;
      await axios.patch(machineURL, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchData(); // Refetch data after successful submission to update form
      setSelectedMachineFile(null); // Reset selected file
    } catch (error) {
      console.error(error);
      setError("Failed to submit form");
      setSelectedMachineFile(null); // Clear the file on error
      throw error; // Rethrow error to be handled by the calling function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispenserSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.keys(dispenserFormData).forEach((key) => {
      if (key !== "drink_image") {
        formDataToSend.append(key, dispenserFormData[key]);
      }
    });

    if (selectedDispenserFile) {
      formDataToSend.append("drink_image", selectedDispenserFile);
    }

    try {
      const dispenserURL = `http://${baseUrl}/dispensers/${machine.dispensers[selectedDispenserIndex].id}/`;
      await axios.patch(dispenserURL, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchData(); // Refetch data after successful submission to update form
      setSelectedDispenserFile(null); // Reset selected file
    } catch (error) {
      console.error(error);
      setError("Failed to submit form");
      setSelectedDispenserFile(null); // Clear the file on error
      throw error; // Rethrow error to be handled by the calling function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchChange = (event) => {
    const dispenserIndex = event.target.checked ? 1 : 0;
    setSelectedDispenserIndex(dispenserIndex);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    machineFormData,
    dispenserFormData,
    handleMachineChange,
    handleDispenserChange,
    handleMachineImageChange,
    handleDispenserImageChange,
    handleMachineSubmit,
    handleDispenserSubmit,
    isLoading,
    isSubmitting,
    error,
    handleSwitchChange,
    selectedDispenserIndex,
    resetError, // Return the resetError function
  };
};
