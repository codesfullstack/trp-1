export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const forwarded = req.headers['x-forwarded-for']
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress

    let targetIp = ip
    if (ip === 'xxxxxxxxxxx.0.0.1' || ip === '::1' || ip?.startsWith('xxxxxxxxxxx.xxxxxxxxxxx.')) {
      const ipResponse = await fetch('https://xxxxxxxxxxx.xxxxxxxxxxx.xxxxxxxxxxx?xxxxxxxxxxx=json')
      const { ip: publicIp } = await ipResponse.json()
      targetIp = publicIp
    }

    const geoResponse = await fetch(`http://xxxxxxxxxxx-xxxxxxxxxxx.xxxxxxxxxxx/json/${targetIp}`)
    const geoData = await geoResponse.json()
    
    if (geoData.status === 'success') {
      return res.status(200).json({
        city: geoData.city,
        country: geoData.country,
        lat: geoData.lat,
        lon: geoData.lon
      })
    }

    return res.status(200).json({
      city: 'Santiago',
      country: 'Chile',
      lat: -33.4372,
      lon: -70.6506
    })

  } catch (error) {
    return res.status(200).json({
      city: 'Santiago',
      country: 'Chile',
      lat: -33.4372,
      lon: -70.6506
    })
  }
}