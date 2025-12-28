import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

const connection  = new Connection(process.env.RPC_URL!)

export async function getBalanceMessage(publicKey : string) : Promise<{ 
    message : string ,
    balance : boolean
}>{
    const balance =await connection.getBalance(new PublicKey(publicKey))
    if(balance){
        return{
            message : `${balance/LAMPORTS_PER_SOL}`,
            balance : true
        }
    }
    else{
        return{
            message : "You wallet is empty",
            balance : false
        }
    }
}