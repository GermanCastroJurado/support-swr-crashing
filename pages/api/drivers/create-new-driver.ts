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

export const routeHandler = async (
  req: NextApiRequest & { dbService: DbService; loggedUser: User },
  res: NextApiResponse,
  next: Function
) => {
  const { body: driver, dbService, loggedUser }: { body: any; dbService: DbService; loggedUser: User } = req
  if (!driver) return next(new RequestError(400, 'saveNewPlace.errors.noData'))
  // console.log('driver in api:', driver, 'loggedUser in api', loggedUser)
  await dbService.saveNewDriver(driver, loggedUser._id)
  res.json({ ok: true })
  return next()
}

export default composeRoute(
  [methodFilter('post'), checkUserTokenMiddleware, dbConnection, loadUser({ isRequired: false }), routeHandler],
  errorHandler,
  dbConnectionClose
)
