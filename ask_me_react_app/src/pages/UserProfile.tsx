import { IUser } from "../App";
import UserProfileComponent from "../components/UserProfileComponent";



export default function UserProfile({ userInfo }: { userInfo: IUser }) {
    return (
        <UserProfileComponent userInfo={userInfo} />
    );
}
