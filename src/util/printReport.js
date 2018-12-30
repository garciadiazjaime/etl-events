const printReport = (page, results) => results.status ?
  `${page.url} ${results.data} events created`
  : `Error: ${JSON.stringify(results.error)}`

export default printReport;
