import express from 'express'
import { AddClientUseCase } from '../../modules/client-adm/use-case/add-client/add-client.usecase'
import { ClientRepository } from '../../modules/client-adm/repository/client.repository'

export const clientRoute = express.Router()

clientRoute.post('/', async (req, res) => {
  const usecase = new AddClientUseCase(new ClientRepository())

  try {
    const customerDTO = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode
    }

    const output = await usecase.execute(customerDTO)
    res.status(200).json(output)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
})
