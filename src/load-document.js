const loadDocument = async (PDFJS, data) => {
  const pdf = await PDFJS.getDocument(data)
  const count = pdf.pdfInfo.numPages

  const getPage = async (n) => {
    const page = await pdf.getPage(n)
    const {items} = await page.getTextContent()

    return items
  }

  getPage.pageCount = count
  getPage.data = data

  return getPage
}

export default loadDocument
