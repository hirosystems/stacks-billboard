import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.0.2/index.ts";
import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";

Clarinet.test({
  name: 'Ensure that the initial message is "Hello, world!"',
  fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const message = chain.callReadOnlyFn(
      "billboard",
      "get-message",
      [],
      deployer.address
    );
    message.result.expectUtf8("Hello, world!");
  },
});

Clarinet.test({
  name: "Ensure that the message updates",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;
    const block = chain.mineBlock([
      Tx.contractCall(
        "billboard",
        "set-message",
        [types.utf8("Something else")],
        wallet1.address
      ),
    ]);
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk();

    const message = chain.callReadOnlyFn(
      "billboard",
      "get-message",
      [],
      wallet1.address
    );
    message.result.expectUtf8("Something else");
  },
});

Clarinet.test({
  name: "Ensure that the price increments by 10",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;
    let block = chain.mineBlock([
      Tx.contractCall(
        "billboard",
        "set-message",
        [types.utf8("Price incremented")],
        wallet1.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(110);

    block = chain.mineBlock([
      Tx.contractCall(
        "billboard",
        "set-message",
        [types.utf8("Price incremented again")],
        wallet1.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(120);
  },
});
