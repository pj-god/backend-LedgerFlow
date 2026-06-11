const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({

    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "account",
        required : [true, "Ledger must be associated with an account"],
        index : true,
        immutable : true
    },
    amount : {
        type : Number,
        required : [true, "Amount is required to create ledger entry"],
        immutable : true
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required : [true, "Ledger must be associated with a transaction"],
        index : true,
        immutable : true
    },
    type : {
        type : String,
        enum : {
            values : ["CREDIT", "DEBIT"],
            message : "Type can either be credit or debit"
        },
        required : [true, "Ledger type is required"],
        immutable : true
    }

})

function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)
ledgerSchema.pre('findOneAndReplace', preventLedgerModification)
ledgerSchema.pre('replaceOne', preventLedgerModification)
ledgerSchema.pre('remove', preventLedgerModification)
ledgerSchema.pre('updateOne', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification)
ledgerSchema.pre('deleteOne', preventLedgerModification)
ledgerSchema.pre('deleteMany', preventLedgerModification)

const ledgerModel = mongoose.model('ledger', ledgerSchema)

module.exports = ledgerModel