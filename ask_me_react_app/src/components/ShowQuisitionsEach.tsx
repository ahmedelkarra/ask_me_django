import { useParams } from "react-router"
import { IQuisitions, IUser } from "../App"
import { Avatar, Grid, Typography } from "@mui/material"
import { deepOrange, grey } from "@mui/material/colors"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShowAnswers from "./ShowAnswers";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddAnswerDialog from "./AddAnswerDialog";
import IsChange from "../context/IsChange";
import { Cookies } from "react-cookie";

export interface IQuisitionLike {
    id: string;
    like_for__title: string;
    like_for: string;
    status: string;
    author__username: string;
    author__last_name: string;
    author__first_name: string;
}

export interface IQuisitionComment {
    id: string;
    body: string;
    comment_for_id: string;
    author__id: string;
    author__username: string;
    author__last_name: string;
    author__first_name: string;

}

function ShowQuisitionsEach({ quisitions, userInfo }: { quisitions: IQuisitions[], userInfo: IUser }) {
    const [quisitionLike, setQuisitionLike] = useState<IQuisitionLike[]>([])
    const [quisitionLikeLength, setQuisitionLikeLength] = useState(0);
    const [quisitionComment, setQuisitionComment] = useState<IQuisitionComment[]>([])
    const param = useParams() as { id: string }
    const quisition = quisitions?.find((ele) => ele?.id == param.id)
    const cookie = new Cookies
    const token = cookie.get('csrftoken')
    const quisitionLikeEachOne = quisitionLike.find((ele) => ele?.author__username == userInfo?.username)

    const isChangeContext = useContext(IsChange)
    if (!isChangeContext) {
        throw new Error('this filde must be boolean')
    }
    const { isChange, setIsChange } = isChangeContext

    const handleQuisitionLike = async () => {
        try {
            const response = await axios.get(`/api/quisition/like/${param?.id}/`)
            const data = response.data as { message: IQuisitionLike[] };
            setQuisitionLike(data.message)
        } catch (error: any) {
            console.log(error.response.data.message as string)
        }
    }

    const handleQuisitionAddLike = async (status: string) => {
        const fullInfo = { ...quisition, status: status }
        try {
            const response = await axios.post(`/api/quisition/like/${param?.id}/`, fullInfo, { headers: { "X-csrftoken": token } })
            const data = response.data as { message: string };
            setIsChange(true)
            console.log(data.message)
        } catch (error: any) {
            console.log(error.response.data.message as string)
        }
    }

    const handleQuisitionComment = async () => {
        try {
            const response = await axios.get(`/api/quisition/comment/${param?.id}/`)
            const data = response.data as { message: IQuisitionComment[] };
            setQuisitionComment(data.message)
        } catch (error: any) {
            console.log(error.response.data.message as string)
        }
    }

    useEffect(() => {
        handleQuisitionLike();
        handleQuisitionComment();
    }, [isChange]);

    useEffect(() => {
        const likes = quisitionLike?.filter((ele) => ele?.status === 'like');
        const dislikes = quisitionLike?.filter((ele) => ele?.status === 'dislike');

        const totalLikes = likes?.length || 0;
        const totalDislikes = dislikes?.length || 0;

        let likeDifference = totalLikes - totalDislikes;
        if (likeDifference < 0) {
            likeDifference = 0;
        }

        setQuisitionLikeLength(likeDifference);
    }, [quisitionLike, isChange]);
    return (
        <Typography component={'div'} sx={{ width: '80%', margin: '10px auto', minHeight: '80dvh' }}>

            <AddAnswerDialog />

            <Grid container bgcolor={grey[200]} textAlign={'center'} padding={'20px'}>

                <Grid item xs={6} md={1} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2}>
                <Typography component={'div'}>
                        <Typography component={'div'} onClick={() => handleQuisitionAddLike('like')}>
                            {userInfo?.username === quisition?.author__username && quisitionLikeEachOne?.status == "like" ?
                                <KeyboardArrowUpIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} color="success" />
                                :
                                <KeyboardArrowUpIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} />
                            }
                        </Typography>
                        <Typography component={'h2'} textTransform={'capitalize'}>
                            {quisitionLikeLength}
                        </Typography>
                        <Typography component={'div'} onClick={() => handleQuisitionAddLike('dislike')}>
                            {userInfo?.username === quisition?.author__username && quisitionLikeEachOne?.status == "dislike" ?
                                <KeyboardArrowDownIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} color="error" />
                                :
                                <KeyboardArrowDownIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} />
                            }
                        </Typography>
                    </Typography>
                    <Typography component={'hr'} height={'100%'} />
                </Grid>

                <Grid item xs={6} md={1} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Avatar sx={{ bgcolor: deepOrange[500], textTransform: 'uppercase' }}>{quisition?.author__first_name[0]}</Avatar>
                    <Typography component={'h2'} textTransform={'capitalize'}>
                        {quisition?.author__first_name + ' ' + quisition?.author__last_name}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={10}>
                    <Typography component={'h2'} fontWeight={800} padding={1}>
                        The Quisition
                    </Typography>
                    <Typography component={'h2'} padding={1}>
                        {quisition?.title}
                    </Typography>
                    <Typography component={'p'} padding={1}>
                        {quisition?.body}
                    </Typography>
                </Grid>

            </Grid>
            {quisitionComment?.map((ele) => {
                return (
                    <ShowAnswers key={ele?.id} quisitionComment={ele} userInfo={userInfo} />
                )
            })}
        </Typography>
    )
}

export default ShowQuisitionsEach