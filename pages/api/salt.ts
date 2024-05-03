import type { NextApiRequest, NextApiResponse } from "next";

import { kv } from "@vercel/kv";
import { LoginResponse, ZKPRequest } from "../../components/types/UsefulTypes";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("hello");

  const body = await req.body;
  return res.status(200).json({ salt: "1234567890123456" });

  const zkpRequest = body;
  if (!zkpRequest) {
    return res.status(422).json({ message: "Wrong Body Format!" });
  }

  const decodedJwt: LoginResponse = jwt_decode(zkpRequest.jwt) as LoginResponse;

  console.log(
    "Received request to get proof for subject = ",
    decodedJwt.sub,
    " Force Update = ",
    zkpRequest.forceUpdate ?? false
  );

  const savedProof = await kv.hget(decodedJwt?.sub, "zkp");
  console.log("zkproof", savedProof);

  if (savedProof && !zkpRequest.forceUpdate) {
    console.log("ZK Proof found in database.");
    return res.status(200).json({ zkp: savedProof });
  } else {
    const proverResponse = await getZKPFromProver(zkpRequest);

    if (proverResponse?.status !== 200 || !proverResponse.data) {
      return res.status(200).json({
        message: proverResponse.statusText,
      });
    }

    const zkpProof = proverResponse.data;
    console.log("ZK Proof created from prover ", zkpProof);

    //Proof is created for first time. We should store it in database before returning it.
    storeProofInDatabase(zkpProof, decodedJwt.sub);

    return res.status(200).json({ zkp: zkpProof });
  }
}

async function getZKPFromProver(zkpPayload: any) {
  console.log("ZK Proof not found in database. Creating proof from prover...");
  const proverURL =
    process.env.NEXT_PUBLIC_PROVER_API || "https://prover.mystenlabs.com/v1";
  try {
    const res = await axios.post(proverURL, zkpPayload);
    return res;
  } catch (error) {
    console.log("Error from proveer:", error);
  }
}

function storeProofInDatabase(zkpProof: string, subject: string) {
  kv.hset(subject, { zkp: zkpProof });
  console.log("Proof stored in database.");
}
