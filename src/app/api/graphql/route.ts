import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { typeDefs } from '@/lib/graphql/typeDefs'
import { resolvers } from '@/lib/graphql/resolvers'
import { authOptions } from '../auth/[...nextauth]/route'
import { createContext } from '@/lib/graphql/context'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const session = await getServerSession(authOptions)
    
    const user = session?.user ? {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    } : null
    
    return createContext(user)
  },
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}