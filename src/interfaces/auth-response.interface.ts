
import {Client} from "@/interfaces/client/client.interface";

export interface AuthResponse {
  access_token: string;
  client: Client;
}