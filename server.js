import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000;

const toursData = fs.readFileSync('./tours.json', 'utf-8')
const parsedToursData = JSON.parse(toursData)
console.log(parsedToursData.data)

app.use(express.json())

app.get('/api/v1/tours', (req, res) => {
    res.status(200).send(parsedToursData)
  })

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params.id)
  console.log(typeof +req.params.id, "==>>typeof")

  if( req.params.id > parsedToursData.data.length ){
    res.status(400).send('error hay bawa')
  }

  const singleTour = parsedToursData.data.find((tour) => {
   return tour.id == req.params.id
  })

  res.status(200).send({
    status: 'Data gotten successfully',
    data: singleTour
  })
})


app.post('/api/v1/tours', (req, res) => {
  if(!req.body.id  ||
    !req.body.destinationName ||
    !req.body.country ||
    !req.body.tourCapacity ||
    !req.body.departure ||
    !req.body.arrival ||
    !req.body.price ||
    !req.body.transport){
      res.status(401).send('Fill out all the fields')
  }
  console.log(req.body.id)

  let dataToWriteInDB = {
    id : parsedToursData.data.length + 1,
    ...req.body
  }

  parsedToursData.data.push(dataToWriteInDB)

  res.status(200).send({
    status: 'Successfully added',
    data : parsedToursData
  })
})

app.delete('/api/v1/tours/:tourId', (req, res) => {
  let idxOfData = parsedToursData.data.findIndex((tour) => {
    return tour.id === +req.params.tourId
  })
  console.log(idxOfData)
  parsedToursData.data.splice(idxOfData, 1)

  fs.writeFile('./tours.json', JSON.stringify(parsedToursData), () => {
    res.status(200).send({
      status: 'Ok',
      data : 'Data deleted'
    })
  })
})

app.put('/api/v1/tours/:tourId', (req, res) => {

  let idxOfData = parsedToursData.data.findIndex((tour) => {
    return tour.id === +req.params.tourId
  });
  console.log(req.body)
  console.log(idxOfData)
  console.log(parsedToursData.data.splice(idxOfData, 1, req.body))
  
  fs.writeFile('./tours.json', JSON.stringify(parsedToursData), () => {
    res.status(200).send({
      status: 'Ok',
      data : 'Data updated'
    })
  });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})