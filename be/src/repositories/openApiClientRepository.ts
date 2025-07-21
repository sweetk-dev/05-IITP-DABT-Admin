import { OpenApiClient } from '../models/openApiClient';

export async function isEmailExists(email: string): Promise<boolean> {
  const client = await OpenApiClient.findOne({ where: { clientId: email } });
  return !!client;
}

export async function createClient({ email, password, name, affiliation }: { email: string; password: string; name: string; affiliation?: string; }): Promise<{ id: number }> {
  const client = await OpenApiClient.create({
    clientId: email,
    password,
    clientName: name,
    affiliation,
    status: 'A',
    delYn: 'N',
    createdBy: 'SYSTEM'
  });
  return { id: client.apiCliId };
} 