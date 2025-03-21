import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
    const res = await axios.post(`${BACKEND_URL}/room/${slug}`);
    if (res.data.success == false) return null
    return res.data.roomId;
}

export default async function ChatRoom1(
    { params }: {
        params: {
            slug: string
        }
    }) {
    const slug = await params.slug;
    // console.log(slug)
    const roomId = await getRoomId(slug)
    // console.log(roomId);
    if (roomId === null) {
        return <div>Room not found. Please check the URL and try again.</div>;
    }
    return <ChatRoom roomId={roomId} />
}