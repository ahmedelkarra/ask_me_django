import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Grid } from '@mui/material';
import { IQuisitions } from '../App';
import { useNavigate } from 'react-router';



export default function ShowQuisitions({ quisitions }: { quisitions: IQuisitions }) {
    const dataDate = new Date(quisitions?.created_at)
    const date = dataDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const navigate = useNavigate()
    return (
        <Grid item xs={12}>
            <Typography component={'div'} onClick={() => navigate(`/${quisitions?.id}`)}>
                <Card sx={{ width: { xs: '95%', md: '50%' }, margin: 'auto', cursor: 'pointer' }} >
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {quisitions?.author__first_name[0]?.toUpperCase()}
                            </Avatar>
                        }
                        title={quisitions?.title}
                        subheader={date}
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} >
                            {quisitions?.body}
                        </Typography>
                    </CardContent>
                </Card>
            </Typography>
        </Grid>
    );
}
