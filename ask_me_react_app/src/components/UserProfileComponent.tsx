import * as React from 'react';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { IUser } from '../App';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import IsChange from '../context/IsChange';


interface IValueInput {
    id: string;
    fName: string;
    lName: string;
    email: string;
    username: string;
    pass: string;
    newPass: string;
    confirmNewPass: string;
}

export default function UserProfileComponent({ userInfo }: { userInfo: IUser }) {
    const [valueInput, setValueInput] = React.useState<IValueInput>({ id: '', fName: '', lName: '', email: '', username: '', pass: "", newPass: '', confirmNewPass: '' })
    const [successMessage, setSuccessMessage] = React.useState<string>('')
    const [errorMessage, setErrorMessage] = React.useState<string>('')
    const cookie = new Cookies()
    const token = cookie.get('csrftoken')

    const isChangeContext = React.useContext(IsChange)
    if (!isChangeContext) {
        throw new Error('this filde must be boolean')
    }
    const { setIsChange } = isChangeContext

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = checkEmail.test(valueInput.email);
        if (valueInput.fName && valueInput.lName && valueInput.username && valueInput.pass && valueInput.newPass === valueInput.confirmNewPass && isEmail) {
            try {
                const response = await axios.put(`/api/auth/me/${valueInput?.id}`, valueInput, { headers: { "X-CSRFToken": token } });
                const data = response.data as { message: string };
                setErrorMessage('')
                setIsChange(true)
                setSuccessMessage(data.message)

                setTimeout(() => {
                    setSuccessMessage('')
                    setErrorMessage('')
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
        } else if (valueInput.newPass !== valueInput.confirmNewPass) {
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
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/auth/me/${valueInput.id}`, {
                headers: { "X-CSRFToken": token },
                data: valueInput
            } as any)
            const infoMessage = response.data as { message: string };
            console.log(infoMessage.message);
        } catch (error: any) {
            setSuccessMessage('')
            setErrorMessage(error.response.data.message as string)
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        }
    };

    React.useEffect(() => {
        setValueInput({ ...valueInput, id: userInfo?.id, fName: userInfo?.fName, lName: userInfo?.lName, email: userInfo?.email, username: userInfo?.username })
    }, [userInfo])
    return (
        <Typography component={'form'} onSubmit={handleSubmit} width={{ xs: '90%', md: '60%' }} margin={{ xs: '10px auto', md: '0 auto' }} border={'1px solid #757575'} borderRadius={'5px'} padding={3}>
            <Grid container spacing={'10px'}>
                <Grid item xs={12} textAlign={'center'} margin={'10px 0'}>
                    <Typography sx={{ border: '1px solid #757575', borderRadius: "5px", width: { xs: '100%', md: '50%' }, margin: 'auto', padding: '5px' }}>User info page</Typography>
                </Grid>
                <Grid item xs={12}>
                    {successMessage && <Alert variant="filled" severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="filled" severity="error">{errorMessage}</Alert>}
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField variant='standard' label="First Name" type='text' fullWidth inputProps={{ maxLength: 20 }} onChange={(e) => setValueInput({ ...valueInput, fName: e.target.value })} value={valueInput?.fName} required />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField variant='standard' label="Last Name" type='text' fullWidth inputProps={{ maxLength: 20 }} onChange={(e) => setValueInput({ ...valueInput, lName: e.target.value })} value={valueInput?.lName} required />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField variant='standard' label="Username" type='text' fullWidth inputProps={{ maxLength: 20 }} onChange={(e) => setValueInput({ ...valueInput, username: e.target.value })} value={valueInput?.username} required />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField variant='standard' label="Email" type='email' fullWidth inputProps={{ maxLength: 50 }} onChange={(e) => setValueInput({ ...valueInput, email: e.target.value })} value={valueInput?.email} required />
                </Grid>
                <Grid item xs={12}>
                    <TextField variant='standard' label="Password" type='password' fullWidth inputProps={{ maxLength: 50, minLength: 7 }} onChange={(e) => setValueInput({ ...valueInput, pass: e.target.value })} required />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField variant='standard' label="New password" type='password' fullWidth inputProps={{ maxLength: 50, minLength: 7 }} onChange={(e) => setValueInput({ ...valueInput, newPass: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField variant='standard' label="Confirm new password" type='password' fullWidth inputProps={{ maxLength: 50, minLength: 7 }} onChange={(e) => setValueInput({ ...valueInput, confirmNewPass: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6} textAlign={'center'} margin={'5px 0'}>
                    <Button type='submit' variant='contained' color='success' sx={{ width: { xs: '100%', md: '90%' } }}>Submit</Button>
                </Grid>
                <Grid item xs={12} md={6} textAlign={'center'} margin={'5px 0'}>
                    <Button type='button' variant='contained' color='error' sx={{ width: { xs: '100%', md: '90%' } }} onClick={handleDelete}>Delete</Button>
                </Grid>
            </Grid>
        </Typography>
    );
}
