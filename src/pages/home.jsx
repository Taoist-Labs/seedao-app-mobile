import {useSelector} from "react-redux";
import Layout from "components/layout/layout";

export default function Home(){
    const account = useSelector(state=> state.account)
    return <Layout noHeader={true}>
        <div>Home,{account}</div>
    </Layout>
}