declare module "ipfs-only-hash" {
  export function of(
    input: Buffer | Uint8Array,
    options?: {
      cidVersion?: number;
      rawLeaves?: boolean;
    }
  ): Promise<string>;
}
