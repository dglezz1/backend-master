const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Test 1: Listar todas las cotizaciones
    const allQuotes = await prisma.quote.findMany();
    console.log('Cotizaciones encontradas:', allQuotes.length);
    
    if (allQuotes.length > 0) {
      console.log('Primera cotización:', allQuotes[0]);
      
      // Test 2: Buscar por ID
      const quoteById = await prisma.quote.findUnique({
        where: { id: allQuotes[0].id }
      });
      console.log('Cotización por ID:', quoteById ? 'Encontrada' : 'No encontrada');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
