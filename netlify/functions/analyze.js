exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { coordinates } = JSON.parse(event.body)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Analiza estas coordenadas GPS y detecta paradas de más de 3 minutos. Responde ÚNICAMENTE con el JSON puro, sin bloques de código markdown, sin backticks, sin texto adicional antes o después.
Formato exacto requerido:{"paradas":[{"inicio":"fecha","fin":"fecha","lat":0.0,"lon":0.0,"duracion_minutos":0}]}

          Coordenadas: ${coordinates}`
        }]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data })
      }
    }

    const text = data.content[0].text

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: text
    }

  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    }
  }
}
