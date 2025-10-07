// Modificadores críticos para optimizar el prompt de IA
export const criticalModifiers = {
  // 1. Tipo de experiencia - Determina actividades principales
  tipoExperiencia: {
    xxxx: "xxxx, xxxx, xxxx",
    xxxx: "xxxx, xxxx, xxxx",
    xxxx: "xxxx, xxxx, xxxx",
    xxxx: "xxxx, xxxx, xxxx",
    xxxx: "xxxx, xxxx, xxxx",
    xxxx: "xxxx, xxxx, xxxx",
    xxxx: "xxxx, xxxx, xxxx",
  },
}

// Generar modificadores para el prompt
export const generateCriticalPrompt = (userPreferences) => {
  const modifiers = []
  
  // Solo procesar campos críticos
  const criticalFields = ['tipoExperiencia', 'restricciones']
  
  criticalFields.forEach(field => {
    const value = userPreferences[field]
    
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (criticalModifiers[field]?.[item]) {
          modifiers.push(criticalModifiers[field][item])
        }
      })
    } else if (value && criticalModifiers[field]?.[value]) {
      modifiers.push(criticalModifiers[field][value])
    }
  })
  
  return modifiers.join(', ')
}