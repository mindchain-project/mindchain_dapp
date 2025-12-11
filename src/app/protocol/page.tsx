'use client';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

function useSendTx() {
  const { data: hash, sendTransaction } = useSendTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('address') as `0x${string}`;
    const value = formData.get('value') as string;

    sendTransaction({
      to,
      value: parseEther(value),
    });
  }

  return { hash, submit };
}

const Protocol = () => {
  const { hash, submit } = useSendTx(); 

  return (
    <>
    <h2 className='highlight text-center'>Protocole</h2>
    <div  className="space-y-4 text-center text-muted-foreground mt-30 mb-30">Page en construction.</div>
      <form onSubmit={submit}>
        <input name="address" placeholder="0xA0Cf…251e" required />
        <input name="value" placeholder="0.05" required />
        <button type="submit">Send</button>
        {hash && <div>Transaction Hash: {hash}</div>}
      </form>
    </>
  );
};
export default Protocol;
