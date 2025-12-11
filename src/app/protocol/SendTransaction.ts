'use client';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export function useSendTx() {
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


'use server'
import * as React from 'react'
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'

export default function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction()

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const to = formData.get('address') as `0x${string}` 
    const value = formData.get('value') as string 
    sendTransaction({ to, value: parseEther(value) })
  }
    return { hash, submit }
}
