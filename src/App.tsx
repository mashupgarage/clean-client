import { Outlet } from "react-router-dom";

function App() {
  // Base layout
  return (
    <div className="max-h-screen min-h-screen bg-cover">
      <Outlet />
    </div>
  );
}

export default App;
