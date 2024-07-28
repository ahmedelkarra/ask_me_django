import { IQuisitions, IUser } from "../App"
import ShowQuisitionsEach from "../components/ShowQuisitionsEach"

function Quisitions({ quisitions, userInfo }: { quisitions: IQuisitions[], userInfo: IUser }) {
    return (
        <ShowQuisitionsEach quisitions={quisitions} userInfo={userInfo} />
    )
}

export default Quisitions