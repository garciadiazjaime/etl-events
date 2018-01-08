import cheerio from 'cheerio'

import config from './config'
import extract from './util/extract'
import load from './util/load'
import printReport from './util/printReport'
import categories from './categories'

const pages = [
  {
    url: 'http://www.cecut.gob.mx/teatro.php',
    category: categories.TEATRO
  },
  {
    url: 'http://www.cecut.gob.mx/cursos.php',
    category: categories.CURSOS
  },
  {
    url: 'http://www.cecut.gob.mx/infantiles.php',
    category: categories.INFANTILES
  },
  {
    url: 'http://www.cecut.gob.mx/literatura.php',
    category: categories.LITERATURA
  },
  {
    url: 'http://www.cecut.gob.mx/museo.php',
    category: categories.MUSEO
  },
  {
    url: 'http://www.cecut.gob.mx/cine.php',
    category: categories.CINE
  }
]

const props = {
  isProduction: config.get('env') === 'production',
  imageBaseUrl: 'http://www.cecut.gob.mx',
  file: './samples/cecut.html',
  apiUrl: config.get('api.url')
}

const transformDate = date => {
  const bits = date.split('|')
  const newDate = new Date()
  if (bits[0].match(/\d/) && bits.length === 2){
    const day = bits[0].match(/\d+/).pop()
    const hour = bits[1].match(/\d+/).pop()
    const minute = bits[1].match(/:\d+/).pop().replace(':', '')
    newDate.setDate(day)
    newDate.setHours(hour)
    newDate.setMinutes(minute)
  }
  else {
    newDate.setDate(1)
  }
  return newDate
}
 
const transform = (props, html, page) => {
  const $ = cheerio.load(html)
  const events = []
  $('.evento').each((i, element) => {
    const image = props.imageBaseUrl + $(element).find('img').attr('src')
    const title = $(element).find('.tit').text()
    const date = $(element).find('.DateTime').text()
    const description = $(element).find('.des').text()
    const price = $(element).find('.price').text()
    const uuid = $(element).attr('id')
    const url = `${page.url}#${uuid}`
    events.push({
      uuid,
      title,
      description,
      url,
      image,
      price,
      date: transformDate(date),
      rawDate: date,
      category: page.category,
      place: 'CECUT'
    })
  })
  return events
}

const main = () => {
  const promises = pages.map(page => {
    return extract(props, page)
    .then(html => transform(props, html, page))
    .then(events => load(props, events))
    .then(results => printReport(page, results))
    .catch(console.log)
  })
  return Promise.all(promises)
}


export default main
