const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')
const mongoose = require('mongoose')

async function createTransaction(req,res){

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "fromAccount, toAccount, amount, idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })
    if(!toUserAccount){
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey : idempotencyKey
    })
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message : "Transaction already processed",
                transaction : isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(202).json({
                message : "Transaction is still under process"
            })
        }
        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message : "Transaction processing failed, please retry"
            })
        }
        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message : "Transaction was reversed, please retry"
            })
        }
    }

    if(fromUserAccount.status !== "ACTIVE" ){
        return res.status(400).json({
            message : "fromAccount must be ACTIVE to process transaction"
        })
    }
    if(toUserAccount.status !== "ACTIVE" ){
        return res.status(400).json({
            message : "toAccount must be ACTIVE to process transaction"
        })
    }

    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message: `Insufficient balance in fromAccount. Current Balance is ${balance}. Requested amount is ${amount}`
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"
    }, {session})

    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        amount : amount,
        transaction: transaction._id,
        type:"DEBIT"
    }, {session})

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount : amount,
        transaction: transaction._id,
        type:"CREDIT"
    }, {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction : transaction
    })

}

module.exports = {
    createTransaction
}