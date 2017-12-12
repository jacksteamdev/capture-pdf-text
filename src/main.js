const waitOneSecond = (x) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x)
    }, 1000)
  })
}

export default async (data) => {
  const pages = ['empty', ...data]

  const getPage = async (n) => {
    const result = await waitOneSecond(pages[n])
    return result
  }
  getPage.size = pages.length

  const api = await waitOneSecond(getPage)

  return api
}
