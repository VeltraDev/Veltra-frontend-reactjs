import ProfileContent from "../containers/ProfilePage/ProfileContent"
import ProfileHeader from "../containers/ProfilePage/ProfileHeader"
import Sidebar from "../containers/ProfilePage/SideBar"

function Profile() {
   return (
        <div className="flex">
            <Sidebar />
            <main className="w-full h-full bg-black pl-64">
                <ProfileHeader />
                <ProfileContent />
            </main>
            
        </div>
    )
}

export default Profile
