import { Avatar, Button, Grid, Typography } from "@mui/material"
import { deepOrange, grey } from "@mui/material/colors"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IQuisitionComment } from "./ShowQuisitionsEach";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { IUser } from "../App";
import EditAnswerDialog from "./EditAnswerDialog";
import { Cookies } from "react-cookie";
import { useParams } from "react-router";
import IsChange from "../context/IsChange";


export interface IAnswerLike {
    id: string;
    like_for__title: string;
    like_for: string;
    status: string;
    author__id: string;
    author__username: string;
    author__last_name: string;
    author__first_name: string;
}

function ShowAnswers({ quisitionComment, userInfo }: { quisitionComment: IQuisitionComment, userInfo: IUser }) {
    const [, setQuisitionCommentValue] = useState<IQuisitionComment[]>([])
    const [answerLike, setAnswerLike] = useState<IAnswerLike[]>([])
    const [answerLikeLength, setAnswerLikeLength] = useState(0);
    const cookie = new Cookies()
    const token = cookie.get('csrftoken')
    const param = useParams() as { id: string }
    const answerLikeEachOne = answerLike.find((ele) => ele?.author__username == userInfo?.username)

    const isChangeContext = useContext(IsChange)
    if (!isChangeContext) {
        throw new Error('this filde must be boolean')
    }
    const { isChange, setIsChange } = isChangeContext

    const handleQuisitionComment = async () => {
        try {
            const response = await axios.get(`/api/quisition/comment/like/${quisitionComment?.id}/`)
            const data = response.data as { message: IQuisitionComment[] };
            setQuisitionCommentValue(data.message)
        } catch (error: any) {
            console.log(error.response.data.message as string)
        }
    }

    const handleDelete = async () => {
        const answerClient = window.confirm(`Are you sure to delete your comment`)
        if (answerClient) {
            try {
                const data = (await axios.delete(`/api/quisition/comment/${param?.id}/${quisitionComment?.id}/`, { headers: { "X-CSRFToken": token } })).data as { message: string }
                const message = data.message
                setIsChange(true)
                console.log(message)
            } catch (error: any) {
                console.log(error.response.data.message as string)
            }
        }
    }

    const handleAnswerLike = async () => {
        try {
            const response = await axios.get(`/api/quisition/comment/like/${quisitionComment?.id}/`)
            const data = response.data as { message: IAnswerLike[] };
            setAnswerLike(data.message)
        } catch (error: any) {
            console.log(error.response.data.message as string)
        }
    }

    const handleCommentAddLike = async (status: string) => {
        const fullInfo = { ...quisitionComment, status: status }
        try {
            const response = await axios.post(`/api/quisition/comment/like/${quisitionComment?.id}/`, fullInfo, { headers: { "X-csrftoken": token } })
            const data = response.data as { message: string };
            setIsChange(true)
            console.log(data.message)
        } catch (error: any) {
            console.log(error.response.data.message as string)
        }
    }

    useEffect(() => {
        handleQuisitionComment()
        handleAnswerLike()
    }, [isChange])

    useEffect(() => {
        const likes = answerLike?.filter((ele) => ele?.status === 'like');
        const dislikes = answerLike?.filter((ele) => ele?.status === 'dislike');

        const totalLikes = likes?.length || 0;
        const totalDislikes = dislikes?.length || 0;

        let likeDifference = totalLikes - totalDislikes;
        if (likeDifference < 0) {
            likeDifference = 0;
        }

        setAnswerLikeLength(likeDifference);
    }, [answerLike, isChange]);
    return (
        <Typography component={'div'} sx={{ margin: '20px 0' }}>
            <Grid container bgcolor={grey[200]} textAlign={'center'} padding={'20px'}>

                <Grid item xs={6} md={1} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2}>
                    <Typography component={'div'}>
                        <Typography component={'div'} onClick={() => handleCommentAddLike('like')}>
                            {userInfo?.username === answerLikeEachOne?.author__username && answerLikeEachOne?.status == "like" ?
                                <KeyboardArrowUpIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} color="success" />
                                :
                                <KeyboardArrowUpIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} />
                            }
                        </Typography>
                        <Typography component={'h2'} textTransform={'capitalize'}>
                            {answerLikeLength}
                        </Typography>
                        <Typography component={'div'} onClick={() => handleCommentAddLike('dislike')}>
                            {userInfo?.username === answerLikeEachOne?.author__username && answerLikeEachOne?.status == "dislike" ?
                                <KeyboardArrowDownIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} color="error" />
                                :
                                <KeyboardArrowDownIcon sx={{ width: '30px', height: "30px", cursor: "pointer" }} />
                            }
                        </Typography>
                    </Typography>
                    <Typography component={'hr'} height={'100%'} />
                </Grid>

                <Grid item xs={6} md={1} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Avatar sx={{ bgcolor: deepOrange[500], textTransform: "capitalize" }}>{quisitionComment?.author__first_name[0]}</Avatar>
                    <Typography component={'h2'} textTransform={'capitalize'}>
                        {quisitionComment?.author__first_name + " " + quisitionComment?.author__last_name}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={10}>
                    <Typography component={'p'} padding={1}>
                        {quisitionComment?.body}
                    </Typography>
                </Grid>

                {userInfo?.username === quisitionComment?.author__username && <Grid item xs={12} display={'flex'} justifyContent={{ xs: 'center', md: 'end' }} alignItems={'center'} gap={1}>
                    <EditAnswerDialog quisitionComment={quisitionComment} />
                    <Button color="error" variant="contained" onClick={handleDelete}><CancelIcon /></Button>
                </Grid>}

            </Grid>
        </Typography>
    )
}

export default ShowAnswers