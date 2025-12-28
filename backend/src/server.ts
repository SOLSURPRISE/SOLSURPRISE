import { Telegraf, Markup} from 'telegraf'
import dotenv from 'dotenv'
import { PrismaClient } from '../src/generated/prisma'
import { Keypair } from '@solana/web3.js'
import { getBalanceMessage } from './solana'

dotenv.config()
const prisma =new PrismaClient();

const bot = new Telegraf(process.env.TELEGRAM_API_KEY!)

const DEFAULT_KEYBOARD = Markup.inlineKeyboard([[
    Markup.button.callback("public_wallet_public_key", "public_wallet_public_key"),
    Markup.button.callback("public_wallet_private_key", "public_wallet_private_key")],[
    Markup.button.callback("private_wallet_public_key", "private_wallet_public_key"),
    Markup.button.callback("private_wallet_private_key", "private_wallet_private_key")],[
    Markup.button.callback("public_wallet_balance", "public_wallet_balance"),
    Markup.button.callback("private_wallet_balance", "private_wallet_balance")
]])


bot.start(async (ctx) => {
    try{
        const existUser = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat.id.toString()
            }
        })

        if(existUser){
            ctx.reply(`Welcome back to SolSurprise!`,{
                ...DEFAULT_KEYBOARD
            })
        }
        else{
            const public_wallet_credentials = Keypair.generate()
            const private_wallet_credentials = Keypair.generate()
            await prisma.users.create({
                data : {
                    tgUserId : ctx.chat.id.toString(),
                    publicWallet : {
                        create : {
                            publicKey : public_wallet_credentials.publicKey.toBase58(),
                            privateKey : public_wallet_credentials.secretKey.toString(),
                        }
                    },
                    privateWallet : {
                        create : {
                            publicKey : private_wallet_credentials.publicKey.toBase58(),
                            privateKey : private_wallet_credentials.secretKey.toString(),
                        }
                    }
                }
                
            })
            ctx.reply(`Welcome to SolSurprise! Your new account has been created`,{
                ...DEFAULT_KEYBOARD
            })
        }
    }
    catch(e){
        console.log(e)
        ctx.reply('Server Error, Please try again!')
    }
})

bot.action("public_wallet_public_key", async(ctx)=>{
    try{
        const user = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat?.id.toString()
            },
            include : {
                publicWallet : true
            }
        })

        return ctx.reply(
            `Your public_wallet public_key is ${user?.publicWallet?.publicKey}`,{
                ...DEFAULT_KEYBOARD
            }
        )
    }
    catch(e){
        ctx.reply('Server Error, Please try again!')
    }
})

bot.action("public_wallet_private_key", async(ctx)=>{
    try{
        const user = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat?.id.toString()
            },
            include : {
                publicWallet : true
            }
        })

        return ctx.reply(
            `Your public_wallet private_key is ${user?.publicWallet?.privateKey}`,{
                ...DEFAULT_KEYBOARD
            }
        )
    }
    catch(e){
        ctx.reply('Server Error, Please try again!')
    }
})

bot.action("private_wallet_public_key", async(ctx)=>{
    try{
        const user = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat?.id.toString()
            },
            include : {
                privateWallet : true
            }
        })

        return ctx.reply(
            `Your private_wallet public_key is ${user?.privateWallet?.publicKey}`,{
                ...DEFAULT_KEYBOARD
            }
        )
    }
    catch(e){
        ctx.reply('Server Error, Please try again!')
    }
})

bot.action("private_wallet_private_key", async(ctx)=>{
    try{
        const user = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat?.id.toString()
            },
            include : {
                privateWallet : true
            }
        })

        return ctx.reply(
            `Your private_wallet private_key is ${user?.privateWallet?.privateKey}`,{
                ...DEFAULT_KEYBOARD
            }
        )
    }
    catch(e){
        ctx.reply('Server Error, Please try again!')
    }
})

bot.action("public_wallet_balance", async(ctx)=>{
    try{
        const user = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat?.id.toString()
            },
            include : {
                publicWallet : true
            }
        })

        const {balance, message} = await getBalanceMessage(user?.publicWallet?.publicKey!)

        return ctx.reply(
            `${balance ? `Your public_wallet balance is ${message}` : `${message}`}`,{
                ...DEFAULT_KEYBOARD
            }
        )
    }
    catch(e){
        ctx.reply('Server Error, Please try again!')
    }
})

bot.action("private_wallet_balance", async(ctx)=>{
    try{
        const user = await prisma.users.findFirst({
            where : {
                tgUserId : ctx.chat?.id.toString()
            },
            include : {
                privateWallet : true
            }
        })

        const {balance, message} = await getBalanceMessage(user?.privateWallet?.publicKey!)

        return ctx.reply(
            `${balance ? `Your private_wallet balance is ${message}` : `${message}`}`,{
                ...DEFAULT_KEYBOARD
            }
        )
    }
    catch(e){
        ctx.reply('Server Error, Please try again!')
    }
})

bot.launch()