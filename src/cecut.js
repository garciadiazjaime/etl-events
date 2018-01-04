import cheerio from 'cheerio'

import config from './config';
import extract from './util/extract';
import load from './util/load';
import printReport from './util/printReport';

const props = {
  isProduction: config.get('env') === 'production',
  imageBaseUrl: 'http://www.cecut.gob.mx',
  url: 'http://www.cecut.gob.mx/teatro.php',
  file: './samples/cecut.html',
  apiUrl: config.get('api.url')
};

const transform = (props, html) => {
  const $ = cheerio.load(html)
  const events = []
  $('.evento').each((i, element) => {
    const image = props.imageBaseUrl + $(element).find('img').attr('src')
    const title = $(element).find('.tit').text()
    const date = $(element).find('.DateTime').text()
    const description = $(element).find('.des').text()
    const price = $(element).find('.price').text()
    const uuid = $(element).attr('id')
    const url = `${props.url}#${uuid}`
    events.push({
      image,
      title,
      date,
      description,
      price,
      uuid,
      url
    })
  })
  return events
};

extract(props)
  .then(html => transform(props, html))
  .then(events => load(props, events))
  .then(printReport)
  .catch(console.log)
