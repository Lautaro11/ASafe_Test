import { FastifyRequest, FastifyReply } from "fastify";

export const authenticateJWT = async (
  request: FastifyRequest & { user?: any },
  reply: FastifyReply
) => {
  const token = request.headers['authorization']?.split(' ')[1];

  if (!token) {
    reply.status(401).send({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = await request.jwtVerify();
    request.user = decoded;
  } catch (error) {
    reply.status(403).send({ error: 'Invalid or expired token' });
  }
};
