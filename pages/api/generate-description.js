export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { placeName, placeType, userPreferences, city, country } = req.body

    const prompt = `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    
    const response = await fetch('https://xxxxxxxxxxx-xxxxxxxxxxx.xxxxxxxxxxx.xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxx-xxxxxxxxxxx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatInput: prompt,
        sessionId: `desc-${Date.now()}`
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    res.status(200).json({ 
      description: data.output || 'Lugar de interés turístico con gran valor histórico y cultural.'
    })
    
  } catch (error) {
    console.error('Description generation error:', error)
    res.status(500).json({ 
      description: 'Lugar de interés turístico con gran valor histórico y cultural.'
    })
  }
}