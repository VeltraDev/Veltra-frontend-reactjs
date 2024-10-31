import Sidebar from "../containers/ProfilePage/SideBar"
import EditProfilePage from "../containers/ProfilePage/EditProfile";

function EditProfile() {
   return (
        <div className="flex">
            <Sidebar />
            <main className="w-full h-screen bg-black px-64">
                <EditProfilePage />
            </main>
            
        </div>
    );
}

export default EditProfile
