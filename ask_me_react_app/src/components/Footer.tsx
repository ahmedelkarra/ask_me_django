import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { pink } from '@mui/material/colors';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Typography } from '@mui/material';

function Footer() {
  return (
    <AppBar position="static" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: pink[500], minHeight: '80px' }}>
      <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
        <Typography component={'p'} fontSize={'20px'} textAlign={'center'}>
          Welcome to Ask-Me website! Ask your questions and get quick, reliable answers.
        </Typography>
        <Typography component={"div"}>
          <Typography component={'a'} href='https://www.linkedin.com/in/ahmed-el-karra-ab4629249' target='_blank' color={'white'} >
            <LinkedInIcon sx={{ width: '30px', height: '30px' }} />
          </Typography>
          <Typography component={'a'} href='https://github.com/ahmedelkarra?tab=repositories' target='_blank' color={'white'}>
            <GitHubIcon sx={{ width: '30px', height: '30px' }} />
          </Typography>
        </Typography>
      </Container>
    </AppBar>
  );
}
export default Footer;
