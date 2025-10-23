import { Outlet } from "react-router";
import { SideNav } from "./components/shared/SideNav";
import { Toaster } from "sonner";
import { NotificationBell } from "./components/notifications/NotificationBell";

function App() {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-[#FFF5EB] overflow-hidden">
            <Toaster position="top-center" />
            <SideNav />
            <div className="flex-1 overflow-auto bg-white h-full lg:max-w-4xl lg:mx-auto lg:my-4 lg:rounded-xl lg:shadow-md">
                <div className="lg:hidden sticky top-0 z-50 bg-white">
                    <div className="flex justify-end p-4">
                        <NotificationBell />
                    </div>
                </div>
                <Outlet />
            </div>
            {/* Global notification bell for desktop */}
            <div className="hidden lg:block fixed top-6 right-6 z-50">
                <NotificationBell />
            </div>
        </div>
    )
}

export default App
