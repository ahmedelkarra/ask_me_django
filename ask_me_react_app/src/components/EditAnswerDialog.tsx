import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Alert, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import IsChange from '../context/IsChange';
import { Cookies } from 'react-cookie';
import { useParams } from 'react-router';
import { IQuisitionComment } from './ShowQuisitionsEach';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IValueInput {
    body: string;
}

export default function EditAnswerDialog({ quisitionComment }: { quisitionComment: IQuisitionComment }) {
    const [valueInput, setValueInput] = React.useState<IValueInput>({ body: "" })
    const [successMessage, setSuccessMessage] = React.useState<string>('')
    const [errorMessage, setErrorMessage] = React.useState<string>('')
    const [open, setOpen] = React.useState(false);
    const cookie = new Cookies()
    const token = cookie.get('csrftoken')
    const param = useParams() as { id: string }

    const isChangeContext = React.useContext(IsChange)
    if (!isChangeContext) {
        throw new Error('this filde must be boolean')
    }
    const { setIsChange } = isChangeContext

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = () => {
        handleClickOpen()
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (valueInput.body) {
            try {
                const data = (await axios.put(`/api/quisition/comment/${param?.id}/${quisitionComment?.id}/`, valueInput, { headers: { "X-CSRFToken": token } })).data as { message: string }
                const message = data.message
                setErrorMessage('')
                setSuccessMessage(message)
                setTimeout(() => {
                    setIsChange(true)
                    setSuccessMessage('')
                    setErrorMessage('')
                    setValueInput({ ...valueInput, body: '' })
                    handleClose()
                }, 3000)
            } catch (error: any) {
                setSuccessMessage('')
                setErrorMessage(error.response.data.message as string)
                setTimeout(() => {
                    setErrorMessage('')
                }, 3000)
            }
        } else {
            setSuccessMessage('')
            setErrorMessage('Please fill body input')
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        }
    }

    React.useEffect(() => {
        setValueInput({ ...valueInput, body: quisitionComment.body })
    }, [quisitionComment])
    return (
        <React.Fragment>

            <Button color="success" variant="contained" onClick={handleClick}><BorderColorIcon /></Button>

            <Dialog
                fullWidth
                open={open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Add Answer Form</DialogTitle>
                <Typography component={'form'} onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" component={'div'}>
                            <Grid container spacing={'10px'}>
                                <Grid item xs={12}>
                                    {successMessage && <Alert variant="filled" severity="success">{successMessage}</Alert>}
                                    {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField multiline rows={3} variant='standard' label="Edit your answer" type='text' fullWidth inputProps={{ maxLength: 50 }} onChange={(e) => setValueInput({ ...valueInput, body: e.target.value })} value={valueInput.body} required />
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant='contained' color='warning' type='reset'>Cancel</Button>
                        <Button variant='contained' color='success' type='submit'>Submit</Button>
                    </DialogActions>
                </Typography>
            </Dialog>
        </React.Fragment>
    );
}
