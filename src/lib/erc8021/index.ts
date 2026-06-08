/* ERC-8021: Transaction Attribution */

export const ATTRIBUTION_CODE = '[ATTRIBUTION_CODE]';
export const BUILDER_CODE = '[BUILDER_CODE]';

/**
 * Appends builder code attribution to the transaction data.
 * @param hexData The original transaction calldata
 * @returns Calldata with appended ERC-8021 tracking info if applicable
 */
export function withERC8021Attribution(hexData: `0x${string}`): `0x${string}` {
  // Mock implementation for ERC-8021
  // Real implementation would safely append standard calldata attribution identifiers
  // depending on the contract's support for extra calldata payload padding.
  console.log(`[ERC-8021] Tracking transaction with BUILDER_CODE: ${BUILDER_CODE}`);
  return hexData;
}
