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
import IsChange from '../context/IsChange';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IValueInput {
    fName: string;
    lName: string;
    email: string;
    username: string;
    pass: string;
    confirmPass: string;
}

export default function RegisterDialog({ status }: { status: string }) {
    const [valueInput, setValueInput] = React.useState<IValueInput>({ fName: "", lName: "", email: "", username: '', pass: "", confirmPass: "" })
    const [successMessage, setSuccessMessage] = React.useState<string>('')
    const [errorMessage, setErrorMessage] = React.useState<string>('')
    const [open, setOpen] = React.useState(false);

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
        const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = checkEmail.test(valueInput.email);
        if (valueInput.fName && valueInput.lName && valueInput.username && valueInput.pass && valueInput.pass === valueInput.confirmPass && isEmail) {
            try {
                const data = (await axios.post('/api/auth/register/', valueInput)).data as { message: string }
                const message = data.message
                setErrorMessage('')
                setSuccessMessage(message)
                setTimeout(() => {
                    setIsChange(true)
                    setSuccessMessage('')
                    setErrorMessage('')
                    handleClose()
                }, 3000)
            } catch (error: any) {
                setSuccessMessage('')
                setErrorMessage(error.response.data.message as string)
                setTimeout(() => {
                    setErrorMessage('')
                }, 3000)
            }
        } else if (!isEmail) {
            setSuccessMessage('')
            setErrorMessage('Please enter valid email')
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        } else if (valueInput.pass !== valueInput.confirmPass) {
            setSuccessMessage('')
            setErrorMessage('Your password not match')
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        } else {
            setSuccessMessage('')
            setErrorMessage('Please fill all inputs')
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        }
    }
    return (
        <React.Fragment>
            {status == 'sx' ?
                <MenuItem onClick={handleClick}>
                    <Typography textAlign="center" variant='inherit' onClick={handleClick}>Register</Typography>
                </MenuItem>
                :
                <Button
                    onClick={handleClick}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Register
                </Button>
            }
            <Dialog
                fullWidth
                open={open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Register Form</DialogTitle>
                <Typography component={'form'} onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" component={'div'}>
                            <Grid container spacing={'10px'}>
                                <Grid item xs={12}>
                                    {successMessage && <Alert variant="filled" severity="success">{successMessage}</Alert>}
                                    {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant='standard' label="First Name" type='text' fullWidth inputProps={{ maxLength: 20 }} onChange={(e) => setValueInput({ ...valueInput, fName: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant='standard' label="Last Name" type='text' fullWidth inputProps={{ maxLength: 20 }} onChange={(e) => setValueInput({ ...valueInput, lName: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant='standard' label="Email" type='email' fullWidth inputProps={{ maxLength: 50 }} onChange={(e) => setValueInput({ ...valueInput, email: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant='standard' label="Username" type='text' fullWidth inputProps={{ maxLength: 20 }} onChange={(e) => setValueInput({ ...valueInput, username: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant='standard' label="Password" type='password' fullWidth inputProps={{ maxLength: 50, minLength: 7 }} onChange={(e) => setValueInput({ ...valueInput, pass: e.target.value })} required />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField variant='standard' label="confirm Password" type='password' fullWidth inputProps={{ maxLength: 50, minLength: 7 }} onChange={(e) => setValueInput({ ...valueInput, confirmPass: e.target.value })} required />
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
