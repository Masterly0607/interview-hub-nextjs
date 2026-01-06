// Main goal: To securely generate a Stream Video token for the logged-in user
// why need token? => Think of Stream Video like a private building: Clerk = your ID card, Token = temporary entry pass, Stream = security guard
// to generate token they will use secret ? why? why we put public key in client?
/*
I own a house (Stream servers).
My house has an address that everyone can know (public key).
I hire a guard (my server) to control access to the house.
The guard holds my master house key (secret key) and never gives it to anyone.
When my sister (browser user) wants to enter, she first uses the house address (public key) to know where to go.
She asks the guard for permission.
The guard checks if it’s really my sister (authentication).
If yes, the guard uses the master house key (secret key) together with the house address (public key) to create a temporary key (token).
The guard gives her that temporary key.
She then goes to the house and opens the door using the temporary key (token).

Note: Public key identifies the house, secret key proves ownership, token allows entry.
*/
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not authenticated");

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  const token = streamClient.generateUserToken({ user_id: user.id });

  return token;
};
