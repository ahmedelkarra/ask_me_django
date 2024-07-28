
import { Grid } from "@mui/material"
import ShowQuisitions from "../components/ShowQuisitions"
import { IQuisitions } from "../App"

function Home({ quisitions }: { quisitions: IQuisitions[] }) {
    return (
        <Grid container component={'div'} justifyContent={'center'} alignItems={'start'} minHeight={'80dvh'} rowSpacing={'5px'} margin={'10px 0'}>
            {quisitions?.map((ele) => {
                return (
                    <ShowQuisitions quisitions={ele} />
                )
            })}
        </Grid>
    )
}

export default Home