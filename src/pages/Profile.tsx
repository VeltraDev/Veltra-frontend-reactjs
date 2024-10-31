import ProfileContent from "../containers/ProfilePage/ProfileContent"
import ProfileHeader from "../containers/ProfilePage/ProfileHeader"
import Sidebar from "../containers/ProfilePage/SideBar"
import ContactList from "../containers/ProfilePage/ContactList"

function Profile() {
   return (
        <div className="flex bg-black">
            <Sidebar />
            <main className="w-full h-full px-32">
                <ProfileHeader />
                <ProfileContent />
            </main>
            <ContactList />
        </div>
    )
}

export default Profile
