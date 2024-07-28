import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Alert, Grid, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import IsChange from '../context/IsChange';
import { Cookies } from 'react-cookie';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IValueInput {
    title: string;
    body: string;
}

export default function AddQuisitionDialog({ status }: { status: string }) {
    const [valueInput, setValueInput] = React.useState<IValueInput>({ title: "", body: "" })
    const [successMessage, setSuccessMessage] = React.useState<string>('')
    const [errorMessage, setErrorMessage] = React.useState<string>('')
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const cookie = new Cookies()
    const token = cookie.get('csrftoken')

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
        if (valueInput.body && valueInput.title) {
            try {
                const data = (await axios.post('/api/quisition/', valueInput, { headers: { "X-CSRFToken": token } })).data as { message: string }
                const message = data.message
                setErrorMessage('')
                setSuccessMessage(message)
                setTimeout(() => {
                    setIsChange(true)
                    setSuccessMessage('')
                    setErrorMessage('')
                    handleClose()
                    navigate('/')
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
            setErrorMessage('Please fill every inputs')
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        }
    }
    return (
        <React.Fragment>
            {status == 'sx' ?
                <MenuItem onClick={handleClick}>
                    <Typography textAlign="center" variant='inherit' onClick={handleClick}>Ask Us</Typography>
                </MenuItem>
                :
                <Button
                    onClick={handleClick}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Ask Us
                </Button>
            }
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Add Quisition</DialogTitle>
                <Typography component={'form'} onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" component={'div'}>
                            <Grid container spacing={'10px'}>
                                <Grid item xs={12}>
                                    {successMessage && <Alert variant="filled" severity="success">{successMessage}</Alert>}
                                    {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField variant='standard' label="Title" type='text' fullWidth inputProps={{ maxLength: 30 }} onChange={(e) => setValueInput({ ...valueInput, title: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField multiline variant='standard' label="Body" type='text' fullWidth minRows={3} inputProps={{ maxLength: 50, minLength: 7 }} onChange={(e) => setValueInput({ ...valueInput, body: e.target.value })} required />
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
