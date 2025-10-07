// Mapeo de categorías a subcategorías
const categoriasMap = {
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
  xxxxx: ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx']
};

// Generar prompt con lógica 80/20
const generateCriticalPrompt = (userData) => {
  const preferences = []
  
  // 80% para experiencias principales con sus subcategorías
  if (userData.tipoExperiencia && userData.tipoExperiencia.length > 0) {
    const experiencias = userData.tipoExperiencia
    let subcategorias = []
    
    experiencias.forEach(exp => {
      if (categoriasMap[exp]) {
        subcategorias = [...subcategorias, ...categoriasMap[exp]]
      }
    })
    
    if (experiencias.length === 1) {
      preferences.push(`EXPERIENCIA PRINCIPAL (80%): ${experiencias[0].toUpperCase()} - incluir: ${subcategorias.join(', ')}`)
    } else {
      const porcentaje = Math.floor(80 / experiencias.length)
      preferences.push(`EXPERIENCIAS PRINCIPALES (80% total): ${experiencias.map(e => `${porcentaje}% ${e.toUpperCase()}`).join(', ')} - incluir: ${subcategorias.join(', ')}`)
    }
  }
  
  // 20% para intereses específicos
  if (userData.interesesEspecificos && userData.interesesEspecificos.length > 0) {
    preferences.push(`INTERESES ESPECÍFICOS (20%): ${userData.interesesEspecificos.join(', ')}`)
  }
  
 
  
  return preferences.join(' | ') || 'experiencia general'
}

// Alcance geográfico fijo de 300km para garantizar lugares con fotos
const determineGeographicScope = (userData, cityName, countryName) => {
  return {
    scope: 'regional',
    instruction: `Incluir ${cityName} Y ciudades/lugares cercanos en un radio de 300km para máxima variedad de opciones con Wikipedia y fotografías.`
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userData, sessionId } = req.body

    const fechaHoraInicio = userData.inicioTour || new Date().toISOString().slice(0, 16)
    const fechaHoraFin = userData.finTour || new Date(Date.now() + 8*60*60*1000).toISOString().slice(0, 16)
    const ciudad = userData.selectedCity || userData.detectedCity
    const puntoInicio = userData.ubicacionInicio
    
    // Calcular itinerario
    const calcularItinerario = () => {
      const inicio = new Date(fechaHoraInicio)
      const fin = new Date(fechaHoraFin)
      const diasTotales = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)))
      
      const horasDiarias = userData.duracionPreferida || userData.horasDiarias || '4-6h'
      const rangosHoras = {
        '2-3h': { minutos: 150, actividades: 3 },
        '4-5h': { minutos: 270, actividades: 4 },
        '4-6h': { minutos: 300, actividades: 4 },
        '6-7h': { minutos: 390, actividades: 6 },
        '6-8h': { minutos: 420, actividades: 6 },
        '8-10h': { minutos: 540, actividades: 5 }
      }
      
      const config = rangosHoras[horasDiarias] || { minutos: 300, actividades: 4 }
      const totalActividades = Math.min(diasTotales * config.actividades, 50)
      
      return {
        diasTotales,
        actividadesPorDia: config.actividades,
        totalActividades,
        minutosPorDia: config.minutos,
        horasDiarias
      }
    }
    
    const itinerario = calcularItinerario()
    const criticalPromptModifiers = generateCriticalPrompt(userData)
    const cityName = ciudad?.city || ciudad?.name || 'Ciudad'
    const countryName = ciudad?.country || 'País'
    
    const geoScope = determineGeographicScope(userData, cityName, countryName)
    
    const prompt = `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

    // Send to AI
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 600000) // 2 minutes ---
    
    const response = await fetch('https://xxxxxxxxxxx-xxxxxxxxxxx.xxxxxxxxxxx.com/xxxxxxxxxxx/xxxxxxxxxxx-xxxxxxxxxxx', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatInput: prompt,
        sessionId: sessionId || `tour-${Date.now()}`
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Parse AI response
    let tourData
    try {
      if (data.output) {
        let cleanOutput = data.output
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()
        
        // Extract JSON
        const jsonMatch = cleanOutput.match(/{[\s\S]*}/)
        if (jsonMatch) {
          cleanOutput = jsonMatch[0]
        }
        
        tourData = JSON.parse(cleanOutput)
        
        // Clean data
        if (tourData.ruta) {
          tourData.ruta = tourData.ruta.map(punto => ({
            ...punto,
            nombre: punto.nombre?.replace(/undefined\s*/gi, '').trim() || 'Punto de interés',
            lugar_fisico: punto.lugar_fisico?.replace(/undefined\s*/gi, '').trim() || punto.nombre,
            descripcion: punto.descripcion?.replace(/undefined\s*/gi, '').trim() || 'Descripción no disponible'
          }))
        }
        
      } else {
        throw new Error('No output received')
      }
    } catch (error) {
      console.error('Error parsing JSON:', error)
      
      // Fallback
      tourData = {
        titulo: `Tour por ${cityName}`,
        duracion: `${itinerario.diasTotales} día(s)`,
        ruta: [{
          orden: 1,
          nombre: puntoInicio?.direccion || "Punto de inicio",
          lugar_fisico: puntoInicio?.direccion || "Punto de inicio",
          tipo: puntoInicio?.categoria || "punto de inicio",
          tiempo: `${fechaHoraInicio.split('T')[1] || '09:00'}-${fechaHoraInicio.split('T')[1] || '09:30'}`,
          descripcion: puntoInicio?.descripcion || "Punto de partida del recorrido",
          coordenadas: { 
            lat: puntoInicio?.coordenadas?.lat || ciudad?.lat || -33.4489, 
            lon: puntoInicio?.coordenadas?.lon || ciudad?.lon || -70.6693 
          },
        }],
        dias_totales: itinerario.diasTotales,
        actividades_por_dia: itinerario.actividadesPorDia,
        minutos_por_dia: itinerario.minutosPorDia,
      }
    }
    
    res.status(200).json(tourData)
  } catch (error) {
    console.error('Tour generation error:', error)
    res.status(500).json({ error: 'Error generating tour' })
  }
}