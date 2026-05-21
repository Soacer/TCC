import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Função para testar a conexão no log ao iniciar o app
export async function connectDb() {
  try {
    await prisma.$connect()
    console.log('✅ Banco de dados conectado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error)
  }
}
