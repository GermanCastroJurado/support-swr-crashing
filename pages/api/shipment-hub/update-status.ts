import { NextApiRequest, NextApiResponse } from 'next'
import { composeRoute, RequestError } from 'services/api/helpers'
import {
  methodFilter,
  checkUserToken,
  dbConnection,
  dbConnectionClose,
  errorHandler,
  loadUser,
} from 'services/api/helpers/middlewares'
import { DbService, User } from 'services/model'

const checkUserTokenMiddleware = checkUserToken({ errorMessage: 'saveCfdiDraft.errors.invalidUser' })

type Request = NextApiRequest & { dbService: DbService; loggedUser: User }

export const routeHandler = async (
  req: Request, 
  res: NextApiResponse, 
  next: Function
  ) => {
  const { body, dbService }: { body: any; loggedUser: User; dbService: DbService } = req
  const {
    id,
    fields,
  }: {
    id: string
    fields: any
  } = body

  // console.log('update-field server', {id, fields})

  // eslint-disable-next-line no-console
  const response = await dbService.updateHubStatus(id, fields).catch(error => console.log(error))
  console.log({response: await response})
  res.json({ ok: true })
  return next()
}

export default composeRoute(
  [
    methodFilter('post'),
    checkUserTokenMiddleware,
    dbConnection,
    loadUser({ isRequired: false }),
    routeHandler
  ],
  errorHandler,
  dbConnectionClose
)
