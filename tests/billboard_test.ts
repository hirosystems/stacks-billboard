import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.14.0/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Clarinet.test({
  name: 'Ensure that the initial message is "Hello, world!"',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let message = chain.callReadOnlyFn(
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
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let wallet1 = accounts.get("wallet_1")!;
    let block = chain.mineBlock([
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

    let message = chain.callReadOnlyFn(
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
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let wallet1 = accounts.get("wallet_1")!;
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
