var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var ExpenseSchema=new mongoose.Schema({

    ExpenseName:String,
    ExpenseAmount:Number,
    friendlist:Array,
    perpersonamount:Number,
    Date:Date
  
    
    

});

ExpenseSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("ExpenseData",ExpenseSchema);