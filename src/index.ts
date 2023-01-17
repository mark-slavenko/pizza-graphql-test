import { createSchema, createYoga } from 'graphql-yoga'
import * as express from "express"
// @ts-ignore
import * as killPort from 'kill-port'
import * as cors from 'cors'

import env from "./lib/helpers/env";
import resolvers from './db/resolvers'
import typeDefs from './db/typeDefs'

async function run() {
  try {

    const servPort = env?.SERVER_PORT || 4001
    const app = express()

    const yoga = createYoga({
      schema: createSchema ({
        typeDefs,
        resolvers,
      })
    })
    app.use(cors())

    // @ts-ignore
    await killPort(servPort, 'tcp')
    app.use('/graphql', yoga)

    app.listen(servPort, () => {
      console.log(`🚀 Server ready at http://localhost:${servPort}`)
    })
  } catch (err) {
    console.log(err)
  }
}

run()
