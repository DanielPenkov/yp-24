import {getAllPosts} from "@/app/lib/data";
import {unstable_noStore as noStore} from "next/cache";


export default async function Test() {
    noStore();

    const posts = await getAllPosts();

    console.log(posts);



    return (
        <main>
            Test 2
        </main>
    );
}