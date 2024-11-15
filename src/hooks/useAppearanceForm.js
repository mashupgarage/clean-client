// src\hooks\useAppearanceForm.js
import { useEffect, useState } from "react";
import axios from "axios";

const initialFormData = {
  font_name: "Arial", // Set to a default or fetched value
  background_image: null,
};

export const useAppearanceForm = (baseUrl, queryParam) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Store machine in state instead of a let-bound variable
  const [machine, setMachine] = useState({});

  const fetchData = async () => {
    if (!(baseUrl && queryParam)) {
      // console.log("Skipping fetch due to missing parameters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // http://127.0.0.1:8000/api/vendingmachines/1/
      const machineURL = `http://${baseUrl}/vendingmachines/${queryParam}`;
      // const machineURL = `http://${baseUrl}/vendingmachines/${machineId}/`;
      console.log(`Appear Machine URL: ${machineURL}`);

      const response = await axios.get(machineURL);
      console.log("Appear Res from API:", response.data);

      // Use setMachine to update machine state
      setMachine(response.data[0]);
      setFormData(response.data[0]);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts and dependencies change
    fetchData();
  }, [baseUrl, queryParam]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      // setFormData({ ...formData, appearanceImage: event.target.files[0] });
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("font_name", formData.font_name);

    // if (formData.appearanceImage) {
    //   formDataToSend.append("background_image", formData.background_image);
    // }
    if (selectedFile) {
      formDataToSend.append("background_image", selectedFile);
    }

    try {
      // http://127.0.0.1:8000/api/vendingmachines/1/
      // const machineURL = `http://${baseUrl}/vendingmachines/${machineId}/`;
      const machineURL = `http://${baseUrl}/vendingmachines/${machine.id}/`;
      console.log(`Appear Submit Machine URL: ${machineURL}`);
      // console.log("Form data to send:", formDataToSend);
      await axios.patch(machineURL, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchData(); // Refetch data after successful submission to update form

      setSelectedFile(null); // Reset selected file
    } catch (error) {
      console.error(error);
      setError("Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleImageChange,
    handleSubmit,
    isLoading,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
  };
};
