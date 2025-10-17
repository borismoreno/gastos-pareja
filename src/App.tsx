import { Outlet } from "react-router";
import { SideNav } from "./components/shared/SideNav";
import { Toaster } from "sonner";

function App() {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-[#FFF5EB] overflow-hidden">
            <Toaster position="top-center" />
            <SideNav />
            <div className="flex-1 overflow-auto bg-white h-full lg:max-w-4xl lg:mx-auto lg:my-4 lg:rounded-xl lg:shadow-md">
                <Outlet />
            </div>
        </div>
    )
}

export default App
