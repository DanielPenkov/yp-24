import {trpc} from "@/server/client";

export const getUnits = ()=> {
    return trpc.goals.getUnits.useQuery().data
}
