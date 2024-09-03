import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const overviewRouter = router({
  fetchOverview: procedure.query(async () => {
    return [ {
      "name": "Finance",
      "goals": [
        {
          "name": "Mortgage",
          "type": "loan",
          "target": "90200",
          "current_value": "134200",
          "current_target": "134200"
        },
        {
          "name": "Savings",
          "type": "savings",
          "target": "12000",
          "current_value": "7500",
          "current_target": "9000"
        }
      ],
      "tableColumns": [
        "Month",
        "Savings",
        "Mortgage"
      ],
      "tableRows": [
        [
          "January",
          "7,000 BGN",
          "134,200 BGN"
        ],
        [
          "February",
          "7,000 BGN",
          "134,200 BGN"
        ]
      ]
    }]
  }),

});
