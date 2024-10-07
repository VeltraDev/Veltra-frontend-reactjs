import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { useState } from "react"

// Tạo interface cho dữ liệu post
interface PostData {
  profilePicture: string;
  username: string;
  timeAgo: string;
  postImage: string;
  likes: number;
  comments: number;
}

// Dữ liệu post
const postData: PostData = {
  profilePicture: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAFxABAQEBAAAAAAAAAAAAAAAAABFhAf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDsvFigApAQVQQUBBQEFAQUBBQEhFASEUBIRSAkSNAMwUABQRQABQQUBFAAAAFBBQEFAQUBBQEABBQEAABQAAAAAAAUAAAAAAAAAAEFQAAEABRAFAAAAAAVAFAAAAAAAAABBUAABBQAAAAAAAAAAFAAAAAAAABAAAQAFAAAAAAAAAAAAVAFEAUQBRAFQABAAAFAAAAAAAAAAAAAAAAAAAABAAQFEAaAAAAAAAAAAAAAAAAAAQAAAEVAAAVUAUAAAAAAAAAARQBAAAAABAABAAAVUAURQUQBRAFEAVAAAAEAUQABAVAAKgAIA0VmlBqqxVoNDNKDQzSg0JSgozSg1RkoKJSgolSgtKlSg0VmlBSs1KDQzQClAFpQApVAKUAKUAKUAKUASlAClACpQBKUAKlAC6AD/9k=",
  username: "username",
  timeAgo: "1 tuần",
  postImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAFxABAQEBAAAAAAAAAAAAAAAAABFhAf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDsvFigApAQVQQUBBQEFAQUBBQEhFASEUBIRSAkSNAMwUABQRQABQQUBFAAAAFBBQEFAQUBBQEABBQEAABQAAAAAAAUAAAAAAAAAAEFQAAEABRAFAAAAAAVAFAAAAAAAAABBUAABBQAAAAAAAAAAFAAAAAAAABAAAQAFAAAAAAAAAAAAVAFEAUQBRAFQABAAAFAAAAAAAAAAAAAAAAAAAABAAQFEAaAAAAAAAAAAAAAAAAAAQAAAEVAAAVUAUAAAAAAAAAARQBAAAAABAABAAAVUAURQUQBRAFEAVAAAAEAUQABAVAAKgAIA0VmlBqqxVoNDNKDQzSg0JSgozSg1RkoKJSgolSgtKlSg0VmlBSs1KDQzQClAFpQApVAKUAKUAKUAKUASlAClACpQBKUAKlAC6AD/9k=",
  likes: 857,
  comments: 2,
};

export default function SocialMediaPost() {
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <div className="max-w-md mx-32 bg-black text-white">
      <div className="flex items-center p-4">
        <img
          alt="Profile picture"
          className="rounded-full w-8 h-8 object-cover"
          src={postData.profilePicture}
        />
        <span className="ml-3 font-semibold">{postData.username}</span>
        <span className="ml-2 text-gray-400">• {postData.timeAgo}</span>
        <button className="ml-auto">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="relative">
        <img
          alt="Post image"
          className="w-full"
          src={postData.postImage}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <button onClick={handleLike}>
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button>
              <MessageCircle className="h-6 w-6" />
            </button>
            <button>
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button>
            <Bookmark className="h-6 w-6" />
          </button>
        </div>
        <p className="font-semibold">{postData.likes} lượt thích</p>
        <button className="text-gray-400 mt-1">Xem tất cả {postData.comments} bình luận</button>
        <div className="mt-3 flex items-center">
          <input
            className="flex-grow bg-transparent text-white placeholder-gray-400 outline-none"
            placeholder="Thêm bình luận..."
            type="text"
          />
        </div>
      </div>
    </div>
  )
}
