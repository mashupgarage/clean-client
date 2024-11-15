import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispenserForm } from "../../hooks/useDispenserForm.js";
import { useSettingsForm } from "../../hooks/useSettingsForm";
import DispenserForm from "./DispenserForm";
import SettingsForm from "./SettingsForm";
import MessageInterfaceMachines from "./MessageInterfaceMachines";
import { Box, Tab, Tabs, Container } from "@mui/material";
import { Store } from "../../@types/store";

interface StoreProps {
  data: Store[];
}

const MessageInterface = (props: StoreProps) => {
  const { data } = props;
  // console.log("MessageInterface data:", data); // Store data

  // IP/:storeId/:machineId
  // const { storeId, machineId } = useParams();
  const { machineId } = useParams();

  const machines = data?.[0]?.machines ?? [];
  const machine = machines.find(
    (m: { id: string | undefined }) => m.id == machineId,
  ); // === doesn't work here

  let baseUrl = null;
  let queryParam = null;
  if (machine && data?.[0]?.url) {
    const baseIp = data[0].url; // store URL
    // const baseIp = machine.url; // Vending Machine URL
    const portNo = machine.port ?? null;
    const machineName = machine.name ?? null;
    baseUrl = portNo ? `${baseIp}:${portNo}/api` : null;
    queryParam = machineName
      ? `?name=${encodeURIComponent(machineName)}`
      : null;
  } else {
    console.log("Required data is missing to form the URL or query param");
  }

  // console.log("Base URL:", baseUrl);
  // console.log("Query Param:", queryParam);
  // console.log(`storeId: ${storeId}, machineId: ${machineId}`);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (
    _event: React.ChangeEvent<unknown>,
    newValue: number,
  ) => {
    setActiveTab(newValue);
  };

  const {
    formData,
    isLoading: dispFormIsLoading,
    error: dispFormError,
    handleSwitchChange,
    handleCleanModeChange,
    selectedDispenser,
    cleaningInProgress,
    activeCleanMode,
    handleLockedSwitchChange,
    handleHeaterToggle,
    handleTempRegulationToggle,
    handleNotificationsToggle,
  } = useDispenserForm(baseUrl, queryParam, activeTab === 0); // Pass activeTab as isActive

  const {
    machineFormData,
    dispenserFormData,
    handleMachineChange,
    handleDispenserChange,
    handleMachineImageChange,
    handleDispenserImageChange,
    handleMachineSubmit,
    handleDispenserSubmit,
    isLoading: settingsFormIsLoading,
    isSubmitting: settingsFormIsSubmitting,
    error: settingsFormError,
    handleSwitchChange: handleSettingsSwitchChange,
    selectedDispenserIndex,
    resetError,
  } = useSettingsForm(baseUrl, queryParam, activeTab);

  return (
    <Container maxWidth="md">
      <MessageInterfaceMachines data={data} />

      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
          // centered // This prop centers the tabs
          variant="fullWidth" // Makes tabs take up the full width
          sx={{
            ".MuiTabs-flexContainer": {
              justifyContent: "space-between", // This applies flexbox's space-between
            },
          }}
        >
          <Tab label="Status & Control" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      {activeTab === 0 && dispFormIsLoading && (
        <Box style={{ padding: "20px", color: "black" }}>Loading...</Box>
      )}

      {activeTab === 0 && dispFormError && (
        <Box style={{ padding: "20px", color: "red" }}>
          Error: {dispFormError}
        </Box>
      )}

      {activeTab === 1 && settingsFormIsLoading && (
        <Box style={{ padding: "20px", color: "black" }}>Loading...</Box>
      )}

      {activeTab === 1 && settingsFormError && (
        <Box style={{ padding: "20px", color: "red" }}>
          Error: {settingsFormError}
        </Box>
      )}

      {/* Conditional rendering based on the active tab */}
      {activeTab === 0 &&
        !dispFormIsLoading &&
        !dispFormError &&
        baseUrl &&
        queryParam &&
        machineId && (
          <DispenserForm
            formData={formData}
            handleSwitchChange={handleSwitchChange}
            selectedDispenser={selectedDispenser}
            handleCleanModeChange={handleCleanModeChange}
            cleaningInProgress={cleaningInProgress}
            activeCleanMode={activeCleanMode}
            handleLockedSwitchChange={handleLockedSwitchChange}
            handleHeaterToggle={handleHeaterToggle}
            handleTempRegulationToggle={handleTempRegulationToggle}
            handleNotificationsToggle={handleNotificationsToggle}
          />
        )}
      {activeTab === 1 &&
        !settingsFormIsLoading &&
        !settingsFormError &&
        baseUrl &&
        queryParam &&
        machineId && (
          <SettingsForm
            baseUrl={baseUrl}
            machineFormData={machineFormData}
            dispenserFormData={dispenserFormData}
            handleMachineChange={handleMachineChange}
            handleDispenserChange={handleDispenserChange}
            handleMachineImageChange={handleMachineImageChange}
            handleDispenserImageChange={handleDispenserImageChange}
            handleMachineSubmit={handleMachineSubmit}
            handleDispenserSubmit={handleDispenserSubmit}
            isSubmitting={settingsFormIsSubmitting}
            handleSwitchChange={handleSettingsSwitchChange}
            selectedDispenserIndex={selectedDispenserIndex}
            resetError={resetError}
            error={settingsFormError}
          />
        )}
    </Container>
  );
};

export default MessageInterface;
