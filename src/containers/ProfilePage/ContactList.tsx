import { Search, MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"

type Contact = {
  id: number
  name: string
  imageUrl: string
  isOnline: boolean
}

const ContactItem = ({ contact }: { contact: Contact }) => (
  <div className="flex items-center space-x-4 p-4  hover:bg-slate-500 rounded-md">
    <div className="relative">
      <img
        src={contact.imageUrl}
        alt={contact.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      {contact.isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
      )}
    </div>
    <span className="text-white text-lg">{contact.name}</span>
  </div>
)

export default function ContactList() {
  const contacts: Contact[] = [
    { id: 1, name: "Minh Quân", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: true },
    { id: 2, name: "Vĩnh Khang", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: true },
    { id: 3, name: "Hoàng Kiên", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: true },
    { id: 4, name: "Nguyễn Anh Đức", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: false },
    { id: 5, name: "Thanh Duy", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: true },
    { id: 6, name: "Phú Thuận", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: true },
    { id: 7, name: "Phương Tuấn", imageUrl: "https://cherryradio.com.au/uploads/singer/avatar/2021/04/15043/1618372223_600.jpg", isOnline: true },
  ]

  return (
    <div className="w-1/4 py-4 px-2 mx-2 border-l border-gray-800 bg-black">
        <div className="flex justify-between items-center mb-4 text-white">
          <h2 className="text-lg font-semibold">Người liên hệ</h2>
          <div className="flex space-x-4">
            <Search className="w-5 h-5" />
            <MoreHorizontal className="w-5 h-5" />
          </div>
        </div>
        <Link to="" className="space-y-2">
          {contacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </Link>
      </div>
  )
}