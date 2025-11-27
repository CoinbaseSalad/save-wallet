import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";

export const runtime = 'edge';

export async function GET() {
  return Response.json(withValidManifest(minikitConfig));
}
