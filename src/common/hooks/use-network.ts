import { StacksMocknet, StacksTestnet } from "@stacks/network";

import { devnet, STACKS_API_URL } from "../constants";

export const useNetwork = () => {
  const network = devnet
    ? new StacksMocknet({ url: STACKS_API_URL })
    : new StacksTestnet({ url: STACKS_API_URL });
  return network;
};
